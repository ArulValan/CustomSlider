import React from "react";
import "./styles.css";
// import styled from "styled-components";
import App from "./App";
class RangeElement extends React.Component {
  constructor(props) {
    super(props);
    this.header = props.filterConfig.header;
    this.state = {
      min: props.filterConfig.min,
      max: props.filterConfig.max,
      lowerValue: props.filterConfig.lowerValue,
      higherValue: props.filterConfig.higherValue
    };
  }
  onChange = (lowerValue, higherValue) => {
    if (lowerValue) this.setState({ lowerValue });
    if (higherValue) this.setState({ higherValue });
  };
  onClear = () => {
    this.setState({ lowerValue: null, higherValue: null });
  };
  render() {
    debugger;
    let lowerValue = this.state.lowerValue || this.state.min,
      higherValue = this.state.higherValue || this.state.max;
    return (
      <div className="row">
        <div className="header">
          <span>{this.header}</span>
          <button className="button" onClick={this.onClear}>
            Clear
          </button>
        </div>
        <div>
          <App
            min={this.state.min}
            max={this.state.max}
            lowerThumb={lowerValue}
            higherThumb={higherValue}
            onChange={this.onChange}
          />
        </div>
        <div className="inputs">
          <input
            type="text"
            value={lowerValue}
            onChange={e => this.onChange(e.target.value)}
          />
          <input
            type="text"
            value={higherValue}
            style={{ float: "right" }}
            onChange={e => this.onChange(undefined, e.target.value)}
          />
        </div>
      </div>
    );
  }
}

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.config = this.props.config;
    this.state = {
      config: this.props.config
    };
  }

  render() {
    return (
      <div className="rangeSlider">
        {this.props.config.map(config => {
          return <RangeElement filterConfig={config} />;
        })}
      </div>
    );
  }
}
