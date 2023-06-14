import React, { Suspense, lazy } from "react";
import { useMediaQuery } from "@mui/material";
import IndividualSaleindex from "../../indevidual-sales/IndividualSaleindex";
const LazyLoaderScreen = lazy(() => import("../../LazyLoaderScreen"));

function EstationIndividualSales(props) {
  const mobile = useMediaQuery("(max-width:900px)");
  const tablet = useMediaQuery("(min-width:800px)");
  return (
    <Suspense fallback={<LazyLoaderScreen />}>
      <IndividualSaleindex />
    </Suspense>
  );
}
export default EstationIndividualSales;
