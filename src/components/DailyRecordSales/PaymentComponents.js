import BankPayment from "./bankPayments";
import PosPayments from "./posPayments";


const PaymentsComponents = (props) => {

    return(
        <div className="mainContainerPays">
            <BankPayment />
            <div className="linesPay"></div>
            <PosPayments />
        </div>
    )
}

export default PaymentsComponents;