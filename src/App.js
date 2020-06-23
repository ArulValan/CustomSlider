import React from "react";
import "./styles.css";
import * as d3 from "d3";
import styled from "styled-components";
export default class App extends React.Component {
  scale;
  rangeScale;
  dragged;
  constructor(props) {
    super(props);
    this.scale = d3
      .scaleLinear()
      .domain([this.props.min, this.props.max])
      .nice()
      .range([0, 100]);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.lowerThumbRef = null;
    this.higherThumbRef = null;
    this.rangeRef = React.createRef();
    this.progressRef = React.createRef();
    this.dragged = null;
  }
  updateHandler = ({ lowerValue, higherValue }) => {
    if (lowerValue && this.higherThumbRef) {
      higherValue = this.getValue(this.higherThumbRef);
      this.validateAndUpdate(lowerValue, higherValue) &&
        this.props.onChange(lowerValue, null);
    } else if (higherValue && this.lowerThumbRef) {
      lowerValue = this.getValue(this.lowerThumbRef);
      this.validateAndUpdate(lowerValue, higherValue) &&
        this.props.onChange(null, higherValue);
    }
  };
  validateAndUpdate = (lowerValue, higherValue) => {
    let progressRef = this.progressRef;
    if (
      lowerValue < higherValue &&
      higherValue <= this.props.max &&
      lowerValue >= this.props.min
    ) {
      let lowerPercentage = this.scale(lowerValue),
        higherPercentage = this.scale(higherValue);
      this.lowerThumbRef.style.left = `${lowerPercentage}%`;
      this.higherThumbRef.style.left = `${higherPercentage}%`;
      progressRef.current.style.left = `${lowerPercentage}%`;
      progressRef.current.style.width = `${higherPercentage -
        lowerPercentage}%`;
      return true;
    } else {
      return false;
    }
  };
  getValue = thumbRef => {
    let bounds = thumbRef.getBoundingClientRect();
    return this.rangeScale((bounds.right + bounds.left) / 2);
  };
  handleMouseMove = event => {
    debugger;
    if (this.dragged === "lowerThumb") {
      let lowerValue = this.rangeScale(event.clientX);
      this.updateHandler({ lowerValue });
    } else if (this.dragged === "higherThumb") {
      let higherValue = this.rangeScale(event.clientX);
      this.updateHandler({ higherValue });
    }
  };
  handleMouseUp = event => {
    document.removeEventListener("mouseup", this.handleMouseUp);
    document.removeEventListener("mousemove", this.handleMouseMove);
    this.dragged = null;
  };

  handleMouseDown = (event, cursorIdentifier) => {
    let bound = event.currentTarget.getBoundingClientRect();
    this.dragstart = event.clientX - (bound.left + bound.right) / 2;
    this.dragged = cursorIdentifier;
    document.addEventListener("mousemove", this.handleMouseMove);
    document.addEventListener("mouseup", this.handleMouseUp);
  };
  getThumb = identifier => {
    let value, mouseDownHandler, ref;
    if (identifier === "lowerThumb") {
      value = this.props.lowerThumb;
      ref = ref => (this.lowerThumbRef = ref);
    } else {
      value = this.props.higherThumb;
      ref = ref => (this.higherThumbRef = ref);
    }
    mouseDownHandler = event => this.handleMouseDown(event, identifier);
    let position = this.scale(value);
    return (
      <div
        ref={ref}
        style={{ left: position + "%" }}
        className="thumb"
        onMouseDown={mouseDownHandler}
      />
    );
  };
  getProgress(lowerVal, higherVal) {
    const Progress = styled.div`
      left: ${this.scale(lowerVal)}%;
      width: ${this.scale(higherVal) - this.scale(lowerVal)}%;
    `;
    return <Progress ref={this.progressRef} className="progress" />;
  }
  componentDidMount() {
    this.calculateRange();
    window.addEventListener("resize", this.calculateRange);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.calculateRange);
  }
  calculateRange = () => {
    if (this.rangeRef) {
      let bounds = this.rangeRef.current.getBoundingClientRect();
      this.rangeScale = d3
        .scaleLinear()
        .domain([bounds.left, bounds.right])
        .range([this.props.min, this.props.max]);
    }
  };
  render() {
    let progress = this.getProgress(
      this.props.lowerThumb,
      this.props.higherThumb
    );
    let progressTrack = <div className="progress track"> </div>;
    let lowerThumb = this.getThumb("lowerThumb");
    let higherThumb = this.getThumb("higherThumb");
    return (
      <div ref={this.rangeRef} className="progressContainer">
        {progressTrack}
        {progress}
        {lowerThumb}
        {higherThumb}
      </div>
    );
  }
}
