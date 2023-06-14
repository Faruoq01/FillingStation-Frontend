import "../../styles/estation/sales.scss";
import Card from "../sales/Card";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const EStationIncomingSalesIndex = ({}) => {
  const navigation = useHistory();
  const goToIndividualSales = () => {
    navigation.push("/home/estation-individual-sales");
  };
  const goToCorporateSales = () => {
    navigation.push("/home/estation-corporate-sales");
  };
  return (
    <div className="e-station-sales">
      <div className="card-wrap-sales">
        <Card
          onClick={goToIndividualSales}
          uri={require("../../assets/estation/cop.svg").default}
          style={{ marginRight: 10 }}
          title="NGN 220, 000"
          subText=" Individual Incoming Sales"
        />
        <Card
          onClick={goToCorporateSales}
          uri={require("../../assets/estation/ind.svg").default}
          title="NGN 130, 000"
          subText="Corporate Incoming Sales"
        />
      </div>
    </div>
  );
};
export default EStationIncomingSalesIndex;
