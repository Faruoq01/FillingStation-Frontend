import "../../styles/estation/sales.scss";
import Card from "../sales/Card";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const EStationIncomingOrdersIndex = ({}) => {
  const navigation = useHistory();
  const goToIndividualSales = () => {
    // navigation.push("/home/estation-individual-sales");
  };
  const goToCorporateSales = () => {
    // navigation.push("/home/estation-corporate-sales");
  };
  return (
    <div className="e-station-sales">
      <div className="card-wrap-sales">
        <Card
          onClick={goToIndividualSales}
          uri={require("../../assets/estation/cop.svg").default}
          style={{ marginRight: 10 }}
          title="NGN 16200.00"
          subText=" Individual Incoming Order"
        />
        <Card
          onClick={goToCorporateSales}
          uri={require("../../assets/estation/ind.svg").default}
          title="NGN 13200.00"
          subText="Corporate Incoming Order"
        />
      </div>
    </div>
  );
};
export default EStationIncomingOrdersIndex;
