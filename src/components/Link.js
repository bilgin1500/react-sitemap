import React from 'react';
import { IX_TYPES } from '../assets/settings';
import {
  SITEMAP_PROPS,
  LIST_PROPS,
  LIST_ITEM_PROPS,
  LINK_PROPS
} from '../assets/props';

/**
 * The most small (atomic) part of the navigation: a single link unit. A
 * stateles functional component. The props are the default props extended
 * with the listItem and link props. Used in the ListItem component.
 */
const Link = props => {
  const isHeading = props.depth == 0;
  const hasChildren = props._children.length > 0;
  const baseClass = `${props.namespace}__link`;
  const textClass = `${props.namespace}__triggerText`;
  const componentClasses = [baseClass];
  const textClasses = [textClass];
  if (hasChildren) componentClasses.push(`${baseClass}--hasSubmenu`);
  if (isHeading) componentClasses.push(`${baseClass}--heading`);
  if (props.ixType != IX_TYPES[2])
    textClasses.push(props.namespace + '-screen-reader-text');

  return (
    <div className={`${baseClass}Wrapper`}>
      <a
        href="#"
        id={props.id && `${props.id}-title`}
        className={componentClasses.join(' ')}
        role={hasChildren ? 'heading' : null}
        aria-level={
          hasChildren ? props.headingStartLevel + props.depth + 1 : null
        }
        tabIndex={isHeading || props.visible ? 0 : 1}
        title={`${props.i18n.linkTitle} "${props.title}"`}
      >
        {props.title}
      </a>
      {hasChildren &&
        props.ixType != IX_TYPES[0] && (
          <button
            className={`${props.namespace}__trigger`}
            onClick={props.onToggle}
            aria-haspopup={hasChildren}
            aria-expanded={props.expanded}
            aria-controls={hasChildren && props.id ? `${props.id}-list` : null}
            tabIndex={isHeading || props.visible ? 0 : 1}
          >
            <span className={textClasses.join(' ')}>
              {props.expanded
                ? props.i18n.triggerCollapseTitle
                : props.i18n.triggerExpandTitle}
            </span>
          </button>
        )}
    </div>
  );
};

Link.propTypes = {
  ...SITEMAP_PROPS,
  ...LIST_PROPS,
  ...LIST_ITEM_PROPS,
  ...LINK_PROPS
};

export default Link;
