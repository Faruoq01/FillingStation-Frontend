import React from "react";
import { useSelector } from "react-redux";
import "../../../styles/summary.scss";
import ApproximateDecimal from "../../common/approx";
import ModalBackground from "../../controls/Modal/ModalBackground";

const SalesSummary = (props) => {
  const handleClose = () => props.close(false);
  const [updatedPumps, updatedTanks] = useSelector((state) => state.recordsales.pumpAndTank);

  return (
    <React.Fragment>
        <ModalBackground
            openModal={props.open}
            closeModal={handleClose}
            submit={handleClose}
            ht={'500px'}
            label={"Updated Sales Report"}>
                
                <div className="tank_label">
                <div style={conts}>
                <div style={nums}>1</div>
                <div style={texts}>Updated Meter Readings</div>
                </div>

                {updatedPumps?.length === 0 ? (
                <div style={men}>No records</div>
                ) : (
                    updatedPumps?.map((data, index) => {
                    return (
                    <div key={index} className="other_label">
                        <div className="other_inner">
                        <div className="fuel_card_items">
                            <div className="fuel_card_items_left">
                            <div className="volum">
                                {`${data.productType} ${data.pumpName} (${data.hostTankName})`}
                            </div>
                            <div className="vol_label">Dispensed pump</div>
                            </div>
                            <div className="fuel_card_items_right">
                            <div className="volum">
                                {ApproximateDecimal(data.totalizerReading)} 
                            </div>
                            <div className="vol_label">Closing Meter</div>
                            </div>
                        </div>
                        </div>
                    </div>
                    );
                })
                )}
            </div>

            <div className="tank_label">
                <div style={conts}>
                <div style={nums}>2</div>
                <div style={texts}>Balance Carried Forward</div>
                </div>

                {updatedTanks?.length === 0 ? (
                <div style={men}>No records</div>
                ) : (
                    updatedTanks?.map((data, index) => {
                    return (
                    <div key={index} className="other_label">
                        <div className="other_inner">
                        <div className="fuel_card_items">
                            <div className="fuel_card_items_left">
                            <div className="volum">
                                {`${data.tankName} (${data.productType})`}
                            </div>
                            <div className="vol_label">Tank Name</div>
                            </div>
                            <div className="fuel_card_items_right">
                            <div className="volum">
                                {ApproximateDecimal(data.afterSales)} Ltrs
                            </div>
                            <div className="vol_label">Stock levels</div>
                            </div>
                        </div>
                        </div>
                    </div>
                    );
                })
                )}
            </div>
      </ModalBackground>
    </React.Fragment>
  );
};

const men = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "bold",
  marginBottom: "20px",
};

const texts = {
  fontSize: "14px",
  color: "#000",
  fontWeight: "bold",
};

const nums = {
  width: "20px",
  height: "20px",
  display: "flex",
  justifyContent: "center",
  alightItems: "center",
  background: "#454343",
  borderRadius: "20px",
  color: "#fff",
  fontSize: "12px",
  marginRight: "10px",
};

const conts = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alightItems: "center",
  marginTop: "30px",
  marginBottom: "5px",
  justifyContent: "flex-start",
  color: "#000",
};

export default SalesSummary;
