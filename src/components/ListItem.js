import React from 'react';
import Image from './Image';
import Link from './Link';
import List from './List';
import { SITEMAP_PROPS, LIST_PROPS, LIST_ITEM_PROPS } from '../assets/props';
import { LIST_ITEM_TRANSITION_DELAY, IX_TYPES } from '../assets/settings';

/**
 * A ListItem container consists of the smaller components we declared above.
 * This component holds all the toggling state and manages related interaction
 * events. The props are the default props extended with the listItem props.
 * Used in the Sitemap for level 1 listItems and in the List for deeper levels of
 * listItems.
 */
export default class ListItem extends React.Component {
  static propTypes = {
    ...SITEMAP_PROPS,
    ...LIST_PROPS,
    ...LIST_ITEM_PROPS
  };

  constructor(props) {
    super(props);
    this.depth = props.depth + 1;
    this.toggle = this.toggle.bind(this);
    this.forceCollapseAll = this.forceCollapseAll.bind(this);
    if (this.hasChildren())
      this.state = { expanded: props.ixType == IX_TYPES[0] };
  }

  /**
   * Does this list item has any _children?
   * @return {Boolean}
   */
  hasChildren() {
    return (
      this.props._children &&
      Array.isArray(this.props._children) &&
      this.props._children.length > 0
    );
  }

  // If this list is expanded and is available in focus history,
  // we can retrieve its relationship to the currently open list.
  // Note that the last item is removed from the history.
  getParentLevel() {
    return this.props.focusHistory
      .filter((item, i) => i != this.props.focusHistory.length - 1)
      .indexOf(this.props.id);
  }

  // Changes 'expanded' state which triggers the lists to rerender
  toggle() {
    this.props.onFocusChange(this.props.id);
    this.setState({ expanded: !this.state.expanded });
  }

  // Disables the toggle state and force the list to collapse
  // Used in resize listener.
  forceCollapseAll() {
    window.removeEventListener('resize', this.forceCollapseAll);
    this.props.focusReset();
    this.setState({ expanded: false });
  }

  // Send message to the parent list to move the items a bit further...
  moveParentPage() {
    this.props.movePage(false, {
      index: this.props.keyNo,
      expanded: this.state.expanded
    });
  }

  // Only update visible, expanded and in the history chain components
  shouldComponentUpdate(newProps, newState) {
    return (
      newProps.visible != this.props.visible ||
      (this.hasChildren() && newState.expanded != this.state.expanded) ||
      this.props.focusHistory.includes(this.props.id)
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.hasChildren() && this.props.ixType == IX_TYPES[2]) {
      // In the horizontal menu if the list item is expanded
      // move other elements so that this item will be centered.
      if (prevState.expanded !== this.state.expanded) {
        this.moveParentPage();
      }

      // If menu is expanded close it on resize
      if (this.state.expanded) {
        window.addEventListener('resize', this.forceCollapseAll);
      }
    }
  }

  render() {
    const {
      namespace,
      title,
      visible,
      ixType,
      keyNo,
      _children,
      depth
    } = this.props;

    const parentLevel = this.getParentLevel();
    const classListItem = `${namespace}__item`;
    const classListItemParent = `${classListItem}--parent`;
    const classListItemExpanded = `${classListItem}--hasExpanded`;
    const componentClasses = [classListItem];
    if (parentLevel > -1) componentClasses.push(classListItemParent);
    if (this.hasChildren() && this.state.expanded)
      componentClasses.push(classListItemExpanded);
    const componentStyle = {
      transitionDelay: this.props.keyNo * LIST_ITEM_TRANSITION_DELAY + 'ms'
    };

    return (
      <li className={componentClasses.join(' ')} style={componentStyle}>
        {ixType == IX_TYPES[2] && <Image {...this.props} />}
        {title && (
          <Link
            {...this.props}
            onToggle={this.hasChildren() ? this.toggle : null}
            _children={_children}
            expanded={this.hasChildren() && this.state.expanded}
            visible={visible}
          />
        )}
        {this.hasChildren() && (
          <List
            {...this.props}
            _children={_children}
            expanded={this.state.expanded}
            visible={this.state.expanded}
            depth={this.depth}
          />
        )}
      </li>
    );
  }
}
