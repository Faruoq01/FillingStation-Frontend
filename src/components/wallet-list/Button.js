import React from "react";
import "../../styles/estation/payment.scss";

export default function Button({ title, ...props }) {
  return (
    <button
      style={{ height: 30, ...props.styles }}
      className="i-top-btn"
      {...props}
    />
  );
}
