import React from "react";
import ReactDOM from "react-dom";

// import App from "./App";
import Form from "./Form";
const config = [
  {
    min: 0,
    max: 70,
    header: "AC"
  },
  {
    min: 0,
    max: 70,
    header: "PY"
  }
];
const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <Form config={config} />
  </React.StrictMode>,
  rootElement
);
