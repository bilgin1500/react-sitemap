import React from 'react';
import List from './List';
import { DEFAULT_PROPS, SITEMAP_PROPS } from '../assets/props';
import { IX_TYPES, THEMES } from '../assets/settings';
import '../assets/style.styl';
import { deepMapKeys } from '../assets/helpers';

/**
 * Container component to bind them all
 */
export default class Sitemap extends React.Component {
  static defaultProps = { ...DEFAULT_PROPS };
  static propTypes = { ...SITEMAP_PROPS };

  // Prepare the core data to be passed to the child components.
  constructor(props) {
    super(props);

    const { theme, ixType, data, i18n } = props;

    // Data normalization:
    // 1. The 'children' property name is reserved in React ecosystem.
    // To prevent React's 'children' to be overwritten by our data source
    // we have to change the 'children' property as '_children' using deepMapKeys.
    // 2. Also for a simpler recursive operation we'll add a first level
    // '_children' property so that the UI can parse the array recursively.
    this.normalizedData = [
      {
        _children: deepMapKeys(data, key => {
          if (key == 'children') return '_children';
          return key;
        })
      }
    ];

    // Start depth level counting within this container.
    this.depth = 0;

    // The ID of the main (depth 0) visible list
    this.listId = `${this.props.id}-list`;

    // Data is crucial, we should warn the user.
    if (!Array.isArray(data) || data.length == 0) {
      console.error(i18n.error.noData, !Array.isArray(data), data.length > 0);
    }

    // No theme can be problematic, we should warn the user.
    if (!Object.keys(THEMES).includes(theme) || theme == THEMES[0]) {
      console.warn(i18n.warn.noTheme);
    }

    // The horizontal menu behaves like a accordion menu with only one
    // submenu visible at a time. To track all the expanded menus and
    // their relations focusOn array keeps track of the expanded
    // menu history.
    this.state = { focusOn: [this.listId] };
    this.changeFocus = this.changeFocus.bind(this);
    this.resetFocus = this.resetFocus.bind(this);
  }

  // We add or subtract the new list ID on every toggle interaction.
  // 'focusOn' is an array state to keep track of the previous states.
  changeFocus(id) {
    if (this.state.focusOn.includes(id)) {
      this.setState({
        focusOn: this.state.focusOn.filter(item => item != id)
      });
    } else {
      this.setState({ focusOn: [...this.state.focusOn, id] });
    }
  }

  resetFocus(id) {
    this.setState({ focusOn: [this.listId] });
  }

  // Get the last focused item from the array
  getLastFocusedItem() {
    if (this.state.focusOn.length > 0) {
      return this.state.focusOn[this.state.focusOn.length - 1];
    }
    return null;
  }

  // Returns the focused items' history
  getAllFocusedItems() {
    return this.state.focusOn;
  }

  render() {
    const {
      id,
      data,
      ixType,
      theme,
      title,
      namespace,
      showTitle,
      headingStartLevel
    } = this.props;

    // Our starting heading will be set according to our headingStartLevel
    const Heading = `h${headingStartLevel}`;

    // Set up the classes
    const classBase = namespace;
    const classTheme = `${namespace}--${theme}`;
    const headingClasses = [`${namespace}__title`];
    const componentClasses = [classBase];
    if (theme != THEMES[0]) componentClasses.push(classTheme);
    if (!showTitle) headingClasses.push(namespace + '-screen-reader-text');
    if (ixType != IX_TYPES[0]) componentClasses.push(`${namespace}--${ixType}`);

    return (
      <nav
        id={id}
        className={componentClasses.join(' ')}
        aria-labelledby={`${id}-title  `}
      >
        <Heading id={`${id}-title`} className={headingClasses.join(' ')}>
          {title}
        </Heading>

        <List
          {...this.props}
          data={this.normalizedData}
          _children={this.normalizedData[0]._children}
          id={this.listId}
          visible={true}
          depth={this.depth}
          ixType={ixType}
          expanded={true}
          focusOn={this.getLastFocusedItem()}
          focusHistory={this.getAllFocusedItems()}
          focusReset={this.resetFocus}
          onFocusChange={this.changeFocus}
        />
      </nav>
    );
  }
}
