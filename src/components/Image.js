import React from 'react';
import { request } from '../assets/helpers';
import { IMAGE_DEFAULT } from '../assets/settings.json';
import { SITEMAP_PROPS, LIST_PROPS, LIST_ITEM_PROPS } from '../assets/props';

/**
 * The category image component responsible of image's lazy loading. The props
 * are the default props extended with the listItem props. Used in the ListItem
 * component.
 */
export default class Image extends React.Component {
  static propTypes = {
    ...SITEMAP_PROPS,
    ...LIST_PROPS,
    ...LIST_ITEM_PROPS
  };

  constructor(props) {
    super(props);
    this.imgWrapperEl = React.createRef();
    this.state = {
      // If the image is loading or not.
      loading: false,
      // Is the image finally loaded? Don't try to load it again.
      loaded: false,
      // Is the image broken or not? Show a message to the user.
      hasError: false,
      // A transparent gif will be used as a placeholder.
      // This will be changed to the downloaded image's source.
      source: IMAGE_DEFAULT
    };
    this.fadeIn = this.fadeIn.bind(this);
  }

  // Fetch and change the state according to the fetch status
  // Used after first mount and on every update if necessary
  getImage() {
    // Check if image url is empty or not
    if (this.props.image && this.props.image.length > 0) {
      this.setState({ ...this.state, loading: true });
      request({
        url: this.props.image,
        responseType: 'blob'
      })
        .then(response => {
          this.setState({
            loading: false,
            hasError: false,
            loaded: true,
            source: window.URL.createObjectURL(response)
          });
        })
        .catch(errorMsg => {
          this.setState({ loading: false, hasError: true, loaded: true });
        });
    } else {
      this.setState({ ...this.state, hasError: true });
    }
  }

  // Fades the image via --fadeIn class
  // Used in componentDidUpdate
  fadeIn() {
    const imgWrapperEl = this.imgWrapperEl.current;
    const classFadeIn = `${this.props.namespace}__imgWrapper--fadeIn`;
    if (!imgWrapperEl.classList.contains(classFadeIn))
      imgWrapperEl.classList.add(classFadeIn);
  }

  // If the images are visible on the viewport download them
  componentDidMount() {
    if (this.props.visible) this.getImage();
  }

  componentWillReceiveProps(newProps) {
    // If there are broken images try them again on every menu reveal
    if (newProps.visible && !this.state.loaded) {
      this.getImage();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.loaded && this.state.loaded) {
      setTimeout(this.fadeIn, 100);
    }
  }

  shouldComponentUpdate(newProps, newState) {
    if (this.state.loaded && newState.loaded) return false;
    return true;
  }

  render() {
    const { loaded, loading, hasError, source } = this.state;
    const { namespace, title, i18n, visible } = this.props;

    const classWrapper = `${namespace}__imgWrapper`;
    const classImage = `${namespace}__image`;
    const classError = `${namespace}__imgError`;
    const classSpinner = `${namespace}__spinner`;
    const wrapperClasses = [classWrapper];
    if (loaded) wrapperClasses.push(`${classWrapper}--loaded`);
    if (loading) wrapperClasses.push(`${classWrapper}--loading`);
    if (hasError) wrapperClasses.push(`${classWrapper}--error`);

    return (
      visible && (
        <div
          className={wrapperClasses.join(' ')}
          ref={this.imgWrapperEl}
          role="presentation"
        >
          {!loading &&
            !hasError && (
              <img src={source} alt={`${title} image`} className={classImage} />
            )}
          {loading && <div className={classSpinner}>{i18n.loadingText}</div>}
          {hasError && <div className={classError}>{i18n.error.noImage}</div>}
        </div>
      )
    );
  }
}
