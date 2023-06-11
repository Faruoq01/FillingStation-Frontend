import React from "react";
import LeftWrapper from "../left/LeftWrapper";
import RightWrapper from "../right/RightWrapper";
import "./wrapper.scss";

export default function Wrapper() {
  return (
    <div className="wrapper">
      <LeftWrapper />
      <RightWrapper />
    </div>
  );
}
