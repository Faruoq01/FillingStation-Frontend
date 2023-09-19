import { useState } from "react";
import ModalBackground from "../../controls/Modal/ModalBackground";
import ModalInputField from "../../controls/Modal/ModalInputField";
import { useDispatch, useSelector } from "react-redux";
import LPOService from "../../../services/360station/lpo";
import swal from "sweetalert";
import { singleLPORecord } from "../../../storage/lpo";

const EditCreditBalance = ({ open, close }) => {
  const dispatch = useDispatch();
  const singleLPO = useSelector((state) => state.lpo.singleLPO);
  const [loading, setLoading] = useState(false);
  const [creditBalance, setCreditBalance] = useState("");

  const submit = () => {
    setLoading(true);
    const payload = {
      id: singleLPO._id,
      creditBalance: creditBalance,
    };

    LPOService.updateCreditBalance(payload)
      .then((data) => {
        dispatch(singleLPORecord(data.lpo));
      })
      .then(() => {
        setLoading(false);
        close(false);
        swal(
          "Success!",
          "You have edited credit balance successfully!",
          "success"
        );
      });
  };

  return (
    <ModalBackground
      openModal={open}
      closeModal={close}
      submit={submit}
      loading={loading}
      label={"Edit Credit Balance"}
      ht={"170px"}>
      <ModalInputField
        value={singleLPO.creditBalance}
        type={"number"}
        label={"Current Credit Balance Amount"}
        disabled={true}
      />
      <ModalInputField
        value={creditBalance}
        setValue={setCreditBalance}
        type={"number"}
        label={"New Credit Balance Amount"}
      />
    </ModalBackground>
  );
};

export default EditCreditBalance;
