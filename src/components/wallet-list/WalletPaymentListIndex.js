import React, { Fragment, useState } from "react";

import "../../styles/estation/payment.scss";
import { useMediaQuery } from "@mui/material";
import WalletPaymentTable from "./WalletPaymentTable";
import Button from "./Button";
import EStationPaymentReceiptModal from "../Modals/EStationPaymentReceiptModal";
import { useDispatch } from "react-redux";
import { eStationSinglePaymentAction } from "../../store/actions/payment";
import EStationCreatePaymentModal from "../Modals/EStationCreatePaymentModal";
import EStationPayments from "../Home/e-station/EStationPayments";

export default function WalletPaymentListIndex({ ...props }) {
  const mobile = useMediaQuery("(max-width:1000px)");
  const [receiptModal, setReceiptModal] = useState(false);
  const [createPaymentModal, setCreatePaymentModal] = useState(false);
  const dispatch = useDispatch();
  const handleViewReciept = (data) => {
    dispatch(eStationSinglePaymentAction(data));
    setReceiptModal(true);
  };
  const openCreatePaymentModal = () => {
    setCreatePaymentModal(true);
  };
  return (
    <Fragment>
      <div className="individual-sale-container-">
        <div className="tb-inner-payment">
          <div className="wrap-btn-wrap">
            <div className="btn-wrap-">
              <Button>Individual</Button>
              <Button style={{ marginLeft: 5 }}>Corporate</Button>
            </div>
            <div className="input-wrapp-payment">
              <input
                className="search-"
                type="text"
                id="fname"
                placeholder="Search"
                style={{}}
              />
              <Button onClick={openCreatePaymentModal}>Register Payment</Button>
            </div>
          </div>
          <WalletPaymentTable handleViewReciept={handleViewReciept} />
        </div>
      </div>

      <EStationPaymentReceiptModal
        open={receiptModal}
        close={setReceiptModal}
      />
      <EStationCreatePaymentModal
        open={createPaymentModal}
        close={setCreatePaymentModal}
      />
    </Fragment>
  );
}
