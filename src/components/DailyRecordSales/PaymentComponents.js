import React from "react";
import BankPayment from "./bankPayments";
import PosPayments from "./posPayments";
import Navigation from "./navigation";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { useSelector } from "react-redux";


const PaymentsComponents = (props) => {
    const user = useSelector((state) => state.auth.user);
    const oneStationData = useSelector((state) => state.outlet.adminOutlet);
    const navigate = useNavigate()

    const getPerm = (e) => {
        if (user.userType === "superAdmin") {
          return true;
        }
        return user.permission?.recordSales[e];
    };

    const next = () => {
        if (oneStationData === null)
          return swal("Warning!", "Please select a station first", "info");
        if (!getPerm("4"))
          return swal("Warning!", "Permission denied", "info");
    
        navigate("/home/recordsales/dipping");
    }

    return(
        <React.Fragment>
            <div className="form-body">
                <div className="mainContainerPays">
                    <BankPayment />
                    <div className="linesPay"></div>
                    <PosPayments />
                </div>
            </div>
            <Navigation next={next} />
        </React.Fragment>
    )
}

export default PaymentsComponents;