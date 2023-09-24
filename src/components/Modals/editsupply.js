import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import "../../styles/lpo.scss";
import ModalBackground from "../controls/Modal/ModalBackground";
import ModalInputField from "../controls/Modal/ModalInputField";
import { singleSupply } from "../../storage/supply";
import APIs from "../../services/connections/api";

const EditSupply = ({ open, close, skip, refresh }) => {
  const dispatch = useDispatch();
  const oneSupply = useSelector((state) => state.supply.singleSupply);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");

  const submit = async () => {
    const copy = JSON.parse(JSON.stringify(oneSupply));
    if (date === "")
      return swal("Error", "Supply date cannot be empty!", "error");

    setLoading(true);
    copy.date = date;
    copy.createdAt = date;
    copy.updatedAt = date;

    const result = await APIs.post("/sales/validateSales", {
      date: date,
      organizationID: oneSupply.organizationID,
      outletID: oneSupply.outletID,
      shift: "All shifts",
    }).then((data) => {
      return data.data.data;
    });

    if (result) {
      setLoading(false);
      return swal(
        "Error!",
        "Record has been saved for this day already, you have to remove all records made beyond this date to update this record!",
        "error"
      );
    } else {
      const payload = {
        id: copy._id,
        supply: copy,
      };

      APIs.post("/supply/update", payload)
        .then((data) => {
          refresh(copy.outletID, "None", skip);
        })
        .then(() => {
          setLoading(false);
          swal("Success!", "Record has been updated successfully!", "success");
          close(false);
        });
    }
  };

  const getAllTanks = () => {
    const tanks = Object.values(oneSupply.recipientTanks);
    return tanks;
  };

  const getInputValue = (value, data) => {
    const copy = JSON.parse(JSON.stringify(oneSupply));
    copy.recipientTanks[data.id].quantity = value;
    const totalQuantity = suppliedQuantity(copy);
    const totalSupply = Number(copy.quantity);

    const diff = totalSupply - totalQuantity;
    copy.shortage = diff > 0 ? diff : 0;
    copy.overage = diff < 0 ? -diff : 0;
    dispatch(singleSupply(copy));
  };

  const suppliedQuantity = (copy) => {
    const tanks = Object.values(copy.recipientTanks);
    const totalQuantity = tanks.reduce((accum, current) => {
      return Number(accum) + Number(current.quantity);
    }, 0);
    return totalQuantity;
  };

  return (
    <ModalBackground
      openModal={open}
      closeModal={close}
      submit={submit}
      loading={loading}
      ht="480px"
      label={"Edit Supply"}>
      <ModalInputField
        value={date}
        setValue={setDate}
        type={"date"}
        label={"Supply Date"}
      />
      <ModalInputField
        value={oneSupply?.quantity}
        type={"number"}
        label={"Quantity Loaded"}
        disabled={true}
      />
      <ModalInputField
        value={suppliedQuantity(oneSupply)}
        type={"number"}
        label={"Quantity Supplied"}
        disabled={true}
      />
      <ModalInputField
        value={oneSupply?.shortage}
        type={"number"}
        label={"Shortage"}
        disabled={true}
      />
      <ModalInputField
        value={oneSupply?.overage}
        type={"number"}
        label={"Overage"}
        disabled={true}
      />
      {getAllTanks().map((item, index) => {
        return (
          <ModalInputField
            key={index}
            value={item.quantity}
            setValue={getInputValue}
            type={"number"}
            label={item.tankName}
            data={item}
          />
        );
      })}
    </ModalBackground>
  );
};

export default EditSupply;
