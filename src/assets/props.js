import PropTypes from 'prop-types';
import { createUID } from './helpers';
import {
  IX_TYPES,
  IX_TYPE_DEFAULT,
  THEMES,
  HEADING_STARTING_LEVEL,
  NAMESPACE,
  SHOW_TITLE,
  THEME_DEFAULT,
  TITLE,
  I18N
} from './settings';

/**
 * Below are the customization options of our main component.
 */

export const SITEMAP_PROPS = Object.freeze({
  // Menu data.
  // The one and only required property for the component to work.
  data: PropTypes.array.isRequired,

  // Starting heading level for proper markups.
  // The first <h> tag will begin with this number. (like <h2>)
  // And all the sub menu headings will follow this.
  headingStartLevel: PropTypes.number,

  // UI wordings used in the component. Ready for translation.
  i18n: PropTypes.object,

  // The main ID of the nav container which will be used as a prefix
  // for all the IDs in the markup
  id: PropTypes.string,

  // Interaction types for the component.
  ixType: PropTypes.oneOf(IX_TYPES),

  // This should match the namespace set on the CSS file
  // and will be used on all the classNames:
  // {namespace}__item, {namespace}__link etc.
  namespace: PropTypes.string,

  // If set to false, the sitemap's title will be
  // only visible to the screen-readers.
  showTitle: PropTypes.bool,

  // Theme of the component
  theme: PropTypes.oneOf(Object.keys(THEMES)),

  // The visible name of the sitemap.
  title: PropTypes.string
});

/**
 * Below are the properties of the atomic components.
 * Every atomic component also receives its parent's props.
 * The hierarchy is as:
 * SITEMAP_PROPS > LIST_PROPS > LIST_ITEM_PROPS > LINK_PROPS
 * Note: SITEMAP_PROPS is the default base for all components.
 * These properties are passed along to the lowest level of component.
 */

export const LIST_PROPS = Object.freeze({
  // Note: This '_children' prop is not native React elements,
  // these are the children property coming from the data source.
  _children: PropTypes.array,

  // The depth level will increase by going deeper in the lists.
  // Note: Only __listWrappers have depth levels as a modifier class.
  depth: PropTypes.number.isRequired,
  expanded: PropTypes.bool,
  focusHistory: PropTypes.array,
  focusOn: PropTypes.string,
  focusReset: PropTypes.func.isRequired,
  onFocusChange: PropTypes.func.isRequired,
  visible: PropTypes.bool
});

export const LIST_ITEM_PROPS = Object.freeze({
  image: PropTypes.string,
  keyNo: PropTypes.number,
  movePage: PropTypes.func.isRequired
});

export const LINK_PROPS = Object.freeze({
  onToggle: PropTypes.func
});

// The default values for SITEMAP_PROPS.
// This is only used in the Sitemap container.
export const DEFAULT_PROPS = Object.freeze({
  data: [],
  headingStartLevel: HEADING_STARTING_LEVEL,
  ixType: IX_TYPE_DEFAULT,
  id: createUID(),
  namespace: NAMESPACE,
  showTitle: SHOW_TITLE,
  theme: THEME_DEFAULT,
  title: TITLE,
  i18n: I18N
});
