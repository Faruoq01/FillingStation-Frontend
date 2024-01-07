import React, { useCallback, useEffect, useState } from "react";
import BankPayment from "./bankPayments";
import PosPayments from "./posPayments";
import Navigation from "./navigation";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import APIs from "../../services/connections/api";
import { bankPayload, expensesPayload, lpoPayload, posPayload, setSalesList } from "../../storage/recordsales";
import SalesService from "../../services/360station/sales";


const PaymentsComponents = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const oneStationData = useSelector((state) => state.outlet.adminOutlet);
    const currentShift = useSelector((state) => state.recordsales.currentShift);
    const currentDate = useSelector((state) => state.recordsales.currentDate);
    const bankPayloadData = useSelector((state) => state.recordsales.bankPayload);
    const posPayloadData = useSelector((state) => state.recordsales.posPayload);
    const [refreshIt, setRefresh] = useState(false);
    const [saved, setSaved] = useState(true);

    const getPerm = (e) => {
        if (user.userType === "superAdmin") {
          return true;
        }
        return user.permission?.recordSales[e];
    };

    const getRecords = useCallback(async (station, date) => {
        const today = moment().format("YYYY-MM-DD").split(" ")[0];
        const getDate = date === "" ? today : date;

        const payload = {
            organizationID:station.organisation,
            outletID: station._id,
            date: getDate,
            shift: currentShift
        }

        const {data} = await APIs.post("/sales/payment-data", payload);
        dispatch(setSalesList(data.sales));
        dispatch(lpoPayload(data.lposales));
        dispatch(bankPayload(data.bank));
        dispatch(posPayload(data.pos));
        dispatch(expensesPayload(data.expenses));
    }, [])

    useEffect(() => {
        getRecords(oneStationData, currentDate);
    }, [oneStationData, currentDate, refreshIt]);

    const refresh = () => {
        getRecords(oneStationData, currentDate);
    }

    const next = () => {
        if (oneStationData === null)
          return swal("Warning!", "Please select a station first", "info");
        if (!getPerm("4"))
          return swal("Warning!", "Permission denied", "info");

        if(saved){
            navigate("/home/recordsales/dipping");
        }else{
            swal({
                title: "Alert!",
                text: "Are you sure you want to save current changes?",
                icon: "warning",
                buttons: true,
            }).then(async (willSave) => {
                if(willSave){
                    const bank = bankPayloadData.filter(data => !("_id" in data));
                    const pos = posPayloadData.filter(data => !("_id" in data));
                    try{
                        const status = await SalesService.payments({
                            bank: bank,
                            pos: pos
                        });
                    if(status){
                        setSaved(true);
                        swal("Success!", "LPO records saved successfully!", "success");
                    }
                    }catch(e){
                        console.log(e)
                    }
                }
            });
        }
    }

    return(
        <React.Fragment>
            <div className="form-body">
                <div className="mainContainerPays">
                    <BankPayment setSaved={setSaved} />
                    <div className="linesPay"></div>
                    <PosPayments setSaved={setSaved} />
                </div>
            </div>
            <Navigation next={next} />
        </React.Fragment>
    )
}

export default PaymentsComponents;