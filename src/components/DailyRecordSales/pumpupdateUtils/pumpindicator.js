import { useSelector } from "react-redux";
import cross from "../../../assets/cross.png";
import PumpSelector from "./pumpselector";

const PumpIndicators = () => {
  const productType = useSelector((state) => state.recordsales.productType);
  const PMS = useSelector((state) => state.recordsales.PMS);
  const AGO = useSelector((state) => state.recordsales.AGO);
  const DPK = useSelector((state) => state.recordsales.DPK);

  const NoPumpsError = () => {
    return (
      <div style={{ ...box, width: "170px" }}>
        <div style={{ marginRight: "10px", fontWeight: "500" }}>
          No pump Created
        </div>
        <img style={{ width: "20px", height: "20px" }} src={cross} alt="icon" />
      </div>
    );
  };

  return (
    <div
      className="pump-list">
      {productType === "PMS" &&
        (PMS.length === 0 ? (
          <NoPumpsError />
        ) : (
          PMS?.map((data, index) => {
            return <PumpSelector data={data} index={index} />;
          })
        ))}
      {productType === "AGO" &&
        (AGO.length === 0 ? (
          <NoPumpsError />
        ) : (
          AGO?.map((data, index) => {
            return <PumpSelector data={data} index={index} />;
          })
        ))}
      {productType === "DPK" &&
        (DPK.length === 0 ? (
          <NoPumpsError />
        ) : (
          DPK?.map((data, index) => {
            return <PumpSelector data={data} index={index} />;
          })
        ))}
    </div>
  );
};

const box = {
  width: "100px",
  height: "35px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#06805B",
  borderRadius: "30px",
  color: "#fff",
};

export default PumpIndicators;
