import "../../styles/estation/sales.scss";
import Card from "../sales/Card";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const EStationIncomingOrdersIndex = ({}) => {
  const navigation = useHistory();
  const goToIndividualOrder = () => {
    navigation.push("/home/estation/orders/incoming-individual");
  };
  const goToCorporateOrder = () => {
    navigation.push("/home/estation/orders/incoming-corporate");
  };
  return (
    <div className="e-station-sales">
      <div className="card-wrap-sales">
        <Card
          onClick={goToIndividualOrder}
          uri={require("../../assets/estation/cop.svg").default}
          style={{ marginRight: 10 }}
          title="NGN 16200.00"
          subText=" Individual Incoming Order"
        />
        <Card
          onClick={goToCorporateOrder}
          uri={require("../../assets/estation/ind.svg").default}
          title="NGN 13200.00"
          subText="Corporate Incoming Order"
        />
      </div>
    </div>
  );
};
export default EStationIncomingOrdersIndex;
