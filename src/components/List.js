import React from 'react';
import ListItem from './ListItem';
import { throttle, slugify } from '../assets/helpers.js';
import { SITEMAP_PROPS, LIST_PROPS } from '../assets/props';
import { IX_TYPES, LIST_ITEM_GUTTER } from '../assets/settings';

/**
 * Unordered list container for the menus. A stateles functional component.
 * The props are the default props extended with the listItem and list props.
 * Used in the ListItem component.
 */
export default class List extends React.Component {
  static propTypes = {
    ...SITEMAP_PROPS,
    ...LIST_PROPS
  };

  constructor(props) {
    super(props);
    this.listWrapperEl = React.createRef();
    this.listEl = React.createRef();

    // DOM manipulation methods
    this.autoHeight = this.autoHeight.bind(this);
    this.movePage = this.movePage.bind(this);
    this.resetPage = this.resetPage.bind(this);
    this.resetPageThrottled = throttle(300, this.resetPage);

    if (this.props.ixType == IX_TYPES[2]) this.state = { currentPage: 1 };
  }

  cacheElements() {
    this.elements = {
      wrapper: this.listWrapperEl.current,
      list: this.listEl.current,
      items: this.listEl.current.childNodes,
      item: this.listEl.current.firstChild
    };
  }

  // This function will be added to the 'transitionend' event listener
  // so that we can clear the height style at the end of the css animation.
  // This is useful for from-auto-to-fixed-size height animation.
  // Used by fold menu type.
  autoHeight() {
    this.elements.wrapper.style.height = 'auto';
  }

  // Toggles the list's height. Used by fold menu type.
  toggleHeight() {
    const syncHeight = () => {
      this.elements.wrapper.style.height =
        this.elements.list.clientHeight + 'px';
    };

    if (this.props.expanded) {
      this.elements.wrapper.addEventListener('transitionend', this.autoHeight);
      syncHeight();
    } else {
      this.elements.wrapper.removeEventListener(
        'transitionend',
        this.autoHeight
      );
      syncHeight();
      setTimeout(() => {
        this.elements.wrapper.style.height = '0';
      }, 10); // Clearing only the stack with 0 didn't help. Might be a V8 optimization issue.
    }
  }

  // Based on the items' current responsive size divided by the full width
  // of the list we can find the current page count.
  // Used by horizontal menu.
  getPageCount() {
    const singleWidth = this.elements.item.clientWidth;
    const totalWidth = singleWidth * this.props._children.length;
    const wrapperWidth = this.elements.wrapper.clientWidth;
    const hasLeftOver = totalWidth % wrapperWidth > singleWidth;
    return Math.floor(totalWidth / wrapperWidth) + (hasLeftOver ? 1 : 0);
  }

  // How many list items are visible on one page?
  getVisibleElemenstCount() {
    return Math.ceil(
      this.elements.wrapper.clientWidth / this.elements.item.clientWidth
    );
  }

  // Get all the currently visible items' index number
  // This will be updated on every component's update
  getVisibleElements() {
    const currPage = this.state.currentPage;
    const visElCount = this.getVisibleElemenstCount();

    const firstItemVisIndex = (currPage - 1) * visElCount;
    let lastItemVisIndex = firstItemVisIndex + visElCount - 1;
    lastItemVisIndex =
      lastItemVisIndex > this.props._children.length - 1
        ? this.props._children.length - 1
        : lastItemVisIndex;

    const visIndex = [];
    for (let i = firstItemVisIndex; i <= lastItemVisIndex; i++) {
      visIndex.push(i);
    }

    return visIndex.map(i => this.elements.items[i]);
  }

  // Change the current page state. Used by horizontal menu.
  // @param {string|boolean} where - It can be 'next', 'prev' or true. True means forceReset.
  setPage(where) {
    let currPage = this.state.currentPage;
    const pageCount = this.getPageCount();

    // This is necessary if after resizing we'd get a menu
    // with less pages but the currentPage is set to a bigger number.
    if (currPage > pageCount) {
      currPage = 1;
    }

    this.setState({
      currentPage:
        where == true
          ? 1
          : where == 'next'
            ? currPage == pageCount ? 1 : currPage + 1
            : currPage == 1 ? pageCount : currPage - 1
    });
  }

  // "forceReset" menu and go to first page
  // When horz. menu is resized it will scroll to page 1
  resetPage() {
    this.setPage(true);
    this.movePage(true);
  }

  // Translate helpers
  translate(x = 0, y = 0) {
    return 'translate(' + x + 'px,' + y + 'px)';
  }
  moveAllElements(x, y) {
    for (let i = 0; i < this.elements.items.length; i++) {
      this.elements.items[i].style.transitionDelay = 0 + 'ms';
      this.elements.items[i].style.transform = this.translate(x, y);
    }
  }

  // On the first and last page dont show the navigations
  toggleNavButtons() {
    const navLeft = this.elements.wrapper.firstChild.firstChild;
    const navRight = this.elements.wrapper.firstChild.lastChild;

    navLeft.disabled = false;
    navRight.disabled = false;

    if (this.state.currentPage == 1) {
      navLeft.disabled = true;
    }

    if (this.state.currentPage == this.getPageCount()) {
      navRight.disabled = true;
    }
  }

  // Moves items one by one with translate. This function is the only source
  // to move the items and used by list and list item components.
  //
  // @param {boolean} forceReset - Force the menu to reset its position to the first page. Used with setPage(true) which forces the currentPage state to be 1.
  // @param {object} listItem:
  //        {number} index - When called from the container list
  //        this index is the number of the expanded list item.
  //        {boolean} expanded - Is the menu expanded or collapsed?
  movePage(forceReset = false, listItem) {
    const pageNo = forceReset ? 0 : this.state.currentPage - 1;

    let newX = -(
      this.elements.wrapper.clientWidth * pageNo +
      LIST_ITEM_GUTTER * pageNo
    );

    // If the item is expanded center it to the viewport
    if (listItem && listItem.expanded) {
      const visElCount = this.getVisibleElemenstCount();
      newX -= this.elements.item.clientWidth * (listItem.index % visElCount);
    }

    this.moveAllElements(newX);
  }

  // Change a and button elements' tabIndex inside the lists
  // sitemap__linkWrapper
  setIndex(els, i) {
    const ns = this.props.namespace;
    els.forEach(el => {
      let titleLink = el.querySelector(`.${ns}__link`);
      let trigger = el.querySelector(`.${ns}__trigger`);
      if (titleLink != null) {
        titleLink.tabIndex = i;
      }
      if (trigger != null) trigger.tabIndex = i;
    });
  }

  // Tabs aren't that polite to the scrollable areas.
  // We better keep them away.
  setIndexForVisibles() {
    this.setIndex(this.getVisibleElements(), 0);
  }

  resetIndex() {
    this.setIndex(this.elements.items, -1);
  }

  // On mount cache the DOM elements and start the resize listener.
  componentDidMount() {
    this.cacheElements();

    if (this.props.ixType == IX_TYPES[2]) {
      if (this.props.expanded) {
        this.resetIndex();
        this.setIndexForVisibles();
        this.toggleNavButtons();
        window.addEventListener('resize', this.resetPageThrottled);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // In 'fold' menu, in every 'expanded' flag's change
    // we should toggle the height of the menu.
    if (
      this.props.ixType == IX_TYPES[1] &&
      prevProps.expanded != this.props.expanded
    ) {
      this.toggleHeight();
    }

    // Horizontal menu
    if (this.props.ixType == IX_TYPES[2]) {
      this.resetIndex();

      // On the first and last page toggle the nav buttons
      if (this.props.expanded) {
        this.toggleNavButtons();
      }

      // If the page has changed we should also
      // move the list items accordingly and toggle the buttons
      if (prevState.currentPage != this.state.currentPage) {
        this.movePage();
        this.setIndexForVisibles();
      }

      // Expand
      if (!prevProps.expanded && this.props.expanded) {
        this.setIndexForVisibles();
        window.addEventListener('resize', this.resetPageThrottled);
      }

      // Collapse
      if (prevProps.expanded && !this.props.expanded) {
        this.resetIndex();
        window.removeEventListener('resize', this.resetPageThrottled);
      }
    }
  }

  render() {
    const {
      namespace,
      id,
      _children,
      expanded,
      visible,
      depth,
      focusOn,
      ixType
    } = this.props;

    const classList = `${namespace}__list`;
    const classListW = `${namespace}__listWrapper`;
    const classListWDepth = `${classListW}--depth${depth}`;
    const classListExpanded = `${classListW}--expanded`;
    const classListFocused = `${classListW}--focused`;
    const pagingClass = `${namespace}__paging`;
    const pagingButClass = `${namespace}__pButton`;
    const wrapperClasses = [classListW];
    if (expanded) wrapperClasses.push(classListExpanded);
    if (id == focusOn) wrapperClasses.push(classListFocused);
    wrapperClasses.push(classListWDepth);

    return (
      <div className={wrapperClasses.join(' ')} ref={this.listWrapperEl}>
        {this.props.ixType == IX_TYPES[2] &&
          expanded && (
            <div className={pagingClass} role="presentation">
              <button
                className={`${pagingButClass} ${pagingButClass}Left`}
                onClick={() => {
                  this.setPage('prev');
                }}
              >
                &lsaquo;
              </button>
              <button
                className={`${pagingButClass} ${pagingButClass}Right`}
                onClick={() => {
                  this.setPage('next');
                }}
              >
                &rsaquo;
              </button>
            </div>
          )}
        <ul
          id={`${id}-list`}
          className={classList}
          role="menu"
          aria-labelledby={`${id}-title`}
          aria-hidden={!visible}
          ref={this.listEl}
        >
          {_children.map((item, i) => {
            const listItemId = `${id}-d${depth}i${i}-${slugify(item.title)}`;
            item._children = Array.isArray(item._children)
              ? item._children
              : [];
            return (
              <ListItem
                key={i}
                {...this.props}
                {...item}
                id={listItemId}
                keyNo={i}
                movePage={this.movePage}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}
