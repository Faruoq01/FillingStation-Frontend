import React from "react";
import "./individual_sale.scss";

export default function Button({ title, ...props }) {
  return <button className="i-top-btn" {...props} />;
}
