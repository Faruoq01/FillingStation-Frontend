import React from "react";
import { useMediaQuery } from "@mui/material";
import IndividualSaleindex from "./indevidual-sales/IndividualSaleindex";

function IndividualSales(props) {
  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(min-width:800px)");
  return <IndividualSaleindex />;
}
export default IndividualSales;

const styles = (mobile, tablet) => ({
  // root: { flex: 1 },
  btn: {},
});
