import React from "react";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import "../../../styles/summary.scss";
import { useState } from "react";
import ApproximateDecimal from "../../common/approx";
import SalesService from "../../../services/360station/sales";
import ModalBackground from "../../controls/Modal/ModalBackground";

const RTDetails = ({data, open, close, refresh}) => {
  const [loading, setLoading] = useState(false);
  const handleClose = () => close(false);
  const currentDate = useSelector((state) => state.recordsales.currentDate);
  const {sales, rt} = data;

  const submit = async () => {
    if (currentDate === null)
      return swal("Warning!", "Please select date!", "info");
    setLoading(true);
    
    try{
        await SalesService.returnToTank({
            sales: sales,
            rt: rt,
        });
        refresh();
        handleClose();
        swal("Success!", "Record saved successfully!", "success");
    }catch(e){
        console.log(e)
    }
  };

  return (
    <React.Fragment>
        <ModalBackground
            openModal={open}
            closeModal={handleClose}
            submit={submit}
            loading={loading}
            ht={'400px'}
            label={"Return to tank"}>

            <div className="tank_label">
                <div style={conts}>
                <div style={nums}>1</div>
                <div style={texts}>Return to tank</div>
                </div>

                {rt?.length === 0 ? (
                <div style={men}>No records</div>
                ) : (
                    rt?.map((data, index) => {
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
                                {ApproximateDecimal(data.rtLitre)} Ltrs
                            </div>
                            <div className="vol_label">Litres returned</div>
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

export default RTDetails;
