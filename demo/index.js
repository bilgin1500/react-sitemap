import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Sitemap from '../build/react-sitemap.min';
import '../build/react-sitemap.min.css';
import { DEFAULT_PROPS } from '../src/assets/props';
import DATA from './data';
import './style';

// A simple customizer form to showcase the flexibility
class Customizer extends React.Component {
  static propTypes = {
    children: PropTypes.element
  };

  constructor(props) {
    super(props);
    this.state = {
      // These are the customizable parts of our sitemap component
      // We're going to store them on the customizer state
      // and update the child sitemap component whenever needed
      data: DATA,
      headingStartLevel: DEFAULT_PROPS.headingStartLevel,
      id: DEFAULT_PROPS.id,
      ixType: DEFAULT_PROPS.ixType,
      namespace: DEFAULT_PROPS.namespace,
      showTitle: DEFAULT_PROPS.showTitle,
      theme: DEFAULT_PROPS.theme,
      title: DEFAULT_PROPS.title,

      // These are the customizer form properties
      changes: false,
      reload: true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleReload = this.handleReload.bind(this);
  }

  // All form inputs are using this function
  handleChange(event) {
    const stateKey = event.target.name.replace('form__', '');

    let value =
      event.target.type === 'checkbox'
        ? event.target.checked
        : event.target.value;

    if (stateKey == 'headingStartLevel') {
      value = parseInt(value);
    }

    this.setState({ ...this.state, changes: true, [stateKey]: value });
  }

  // Only reload with submit button.
  // The sitemap component will be reloaded via submit button
  // due to some internal limitations.
  handleReload(e) {
    if (this.state.changes) {
      this.setState({ ...this.state, changes: false, reload: true });
    }
    e.preventDefault();
  }

  shouldComponentUpdate(newProps, newState) {
    return newState.reload;
  }

  render() {
    const Children = React.Children.map(this.props.children, child =>
      React.cloneElement(child, { ...this.state })
    );

    const classHot = this.state.changes ? 'form--hot' : '';

    return (
      <React.Fragment>
        <form className={`form ${classHot}`}>
          <label className="form__label">
            Title:
            <input
              type="text"
              name="form__title"
              className="form__title"
              value={this.state.title}
              onChange={this.handleChange}
              placeholder="Component title"
            />
          </label>
          <label className="form__label">
            Show title:
            <input
              name="form__showTitle"
              className="form__showTitle"
              type="checkbox"
              checked={this.state.showTitle}
              onChange={this.handleChange}
            />
          </label>
          <label className="form__label">
            Theme:
            <select
              name="form__theme"
              className="form__theme"
              value={this.state.theme}
              onChange={this.handleChange}
            >
              <option value="none">None</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
          <label className="form__label">
            Interaction Type:
            <select
              name="form__ixType"
              className="form__ixType"
              value={this.state.ixType}
              onChange={this.handleChange}
            >
              <option value="none">None</option>
              <option value="fold">Fold</option>
              <option value="horizontal">Horizontal</option>
            </select>
          </label>
          <label className="form__label">
            Namespace:
            <input
              type="text"
              name="form__namespace"
              className="form__namespace"
              value={this.state.namespace}
              onChange={this.handleChange}
              placeholder="Namespace"
              disabled={true}
              title="Must be in sync with the CSS file"
            />
          </label>
          <label className="form__label">
            ID:
            <input
              type="text"
              name="form__id"
              className="form__id"
              value={this.state.id}
              onChange={this.handleChange}
              placeholder="ID"
            />
          </label>
          <label className="form__label">
            Data:
            <input
              type="text"
              name="form__data"
              className="form__data"
              value={this.state.data}
              onChange={this.handleChange}
              placeholder="Data"
              disabled={true}
            />
          </label>
          <label className="form__label">
            Heading start level:
            <input
              type="number"
              min="1"
              max="6"
              name="form__headingStartLevel"
              className="form__headingStartLevel"
              value={this.state.headingStartLevel}
              onChange={this.handleChange}
              placeholder="Heading start level"
            />
          </label>
          {this.state.changes && (
            <input
              type="submit"
              name="form__reload"
              className="form__reload"
              onClick={this.handleReload}
              value="Reload"
            />
          )}
        </form>
        {!this.state.changes && this.state.reload && Children}
      </React.Fragment>
    );
  }
}

// Creates a basic container app for demonstration
const app = document.createElement('div');
document.body.appendChild(app);

ReactDOM.render(
  <Customizer>
    <Sitemap />
  </Customizer>,
  app
);
