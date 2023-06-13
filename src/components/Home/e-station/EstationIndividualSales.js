import React from "react";
import { useMediaQuery } from "@mui/material";
import IndividualSaleindex from "../../indevidual-sales/IndividualSaleindex";

function EstationIndividualSales(props) {
  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(min-width:800px)");
  return <IndividualSaleindex />;
}
export default EstationIndividualSales;
