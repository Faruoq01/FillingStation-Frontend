import { Backdrop, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { MultiSelect } from "react-multi-select-component";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { searchIncoming } from "../../storage/incomingOrder";
import AddIcon from "@mui/icons-material/Add";
import hr8 from "../../assets/hr8.png";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "../../styles/supplystyle.scss";
import SupplyService from "../../services/supplyService";
import IncomingService from "../../services/IncomingService";
import OutletService from "../../services/outletService";
import { BallTriangle } from "react-loader-spinner";
import { getAllOutletTanks } from "../../storage/outlet";
import { useNavigate } from "react-router-dom";

const CreateSupply = (props) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [menus, setMenus] = useState(false);
  const dispatch = useDispatch();
  const tankList = useSelector((state) => state.outlet.tankList);
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const [selectedIncomingOrders, setSelectedIncomingOrder] = useState("");
  const [supplyList, setSupplyList] = useState([]);
  const user = useSelector((state) => state.auth.user);
  const [incomingList, setIncomingList] = useState([]);

  // payload data
  const [transporter, setTransporter] = useState("");
  const [waybillNo, setWaybillNo] = useState("Select waybill no");
  const [truckNo, setTruckNo] = useState("");
  const [productSupply, setProductSupply] = useState("");
  const [quantityLoaded, setQuantityLoaded] = useState("");
  const [overage, setOverage] = useState(0);
  const [shortage, setShortage] = useState(0);
  const [supplyDate, setSupplyDate] = useState("");
  const [stop, setStop] = useState(false);

  const selectedIncomingOrder = (data) => {
    setTransporter(data.transporter);
    setWaybillNo(data.wayBillNo);
    setProductSupply(data.product);
    setQuantityLoaded(data.quantity);
    setTruckNo(data.truckNo);

    setMenus(!menus);
    setSelectedIncomingOrder(data);
  };

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getAllIncoming = () => {
    const income = {
      outletID: oneStationData._id,
      organisationID: resolveUserID().id,
    };

    IncomingService.getAllIncoming3(income).then((data) => {
      setIncomingList(data.incoming.incoming);
    });

    OutletService.getAllOutletTanks(income).then((data) => {
      dispatch(getAllOutletTanks(data.stations));
    });
  };

  useEffect(() => {
    if (oneStationData === null) {
      navigate("supply");
    } else {
      getAllIncoming();
    }

    return () => {
      props.refresh();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const incomingTanks = (e, data) => {
    const room = Number(data.tankCapacity) - Number(data.currentLevel);
    let addedQuantity = Number(removeSpecialCharacters(e.target.value));

    if (addedQuantity > room) {
      return swal(
        "Warning!",
        `This tank doesn't have the capacity, can only accommodate ${room} litres extra. `,
        "info"
      );
    } else {
      const cloneSelectedTanks = JSON.parse(JSON.stringify(selected));
      const findID = cloneSelectedTanks.findIndex(
        (item) => item._id === data._id
      );

      const total = String(
        Number(cloneSelectedTanks[findID].currentLevel) + addedQuantity
      );

      cloneSelectedTanks[findID].newLevel = total;
      cloneSelectedTanks[findID].addedQuantity = addedQuantity;
      setSelected(cloneSelectedTanks);

      const sumOfQuantity = cloneSelectedTanks.reduce((accum, current) => {
        return Number(accum) + Number(current.addedQuantity);
      }, 0);

      if (sumOfQuantity > Number(quantityLoaded)) {
        const shortage = sumOfQuantity - Number(quantityLoaded);
        setShortage(0);
        setOverage(shortage);
      } else if (sumOfQuantity < Number(quantityLoaded)) {
        const overage = Number(quantityLoaded) - sumOfQuantity;
        setOverage(0);
        setShortage(overage);
      } else if (Number(quantityLoaded) === sumOfQuantity) {
        setOverage(0);
        setShortage(0);
      }
    }
  };

  const addDetailsToList = () => {
    if (transporter === "")
      return swal("Warning!", "Transporter field cannot be empty", "info");
    if (waybillNo === "")
      return swal("Warning!", "waybill no field cannot be empty", "info");
    if (truckNo === "")
      return swal("Warning!", "Truck no field cannot be empty", "info");
    if (supplyDate === "")
      return swal("Warning!", "Supply date field cannot be empty", "info");
    if (oneStationData === null)
      return swal("Warning!", "Outlet field cannot be empty", "info");
    if (productSupply === "")
      return swal("Warning!", "Product type field cannot be empty", "info");
    if (selectedIncomingOrders === "")
      return swal("Warning!", "Incoming order field cannot be empty", "info");

    const discharged = selected.reduce((accum, current) => {
      return Number(accum) + Number(current.addedQuantity);
    }, 0);

    const listTanks = selected.map((data) => {
      return {
        id: data._id,
        tankName: data.tankName,
        quantity: data.addedQuantity,
      };
    });

    const tanks = listTanks.reduce((result, item) => {
      const { id } = item;
      if (!result[id]) {
        result[id] = {};
      }
      result[id] = item;
      return result;
    }, {});

    if (typeof discharged === "number" && discharged !== 0) {
      const payload = {
        transportationName: transporter,
        wayBillNo: waybillNo,
        truckNo: truckNo,
        quantity: String(discharged),
        outletName: oneStationData?.outletName,
        productType: productSupply,
        shortage: shortage,
        overage: overage,
        recipientTanks: tanks,
        incomingID: selectedIncomingOrders._id,
        date: supplyDate,
        tankUpdate: selected,
        outletID: oneStationData?._id,
        organizationID: oneStationData?.organisation,
      };

      const findID = supplyList.indexOf(payload);
      if (findID === -1) {
        setSupplyList((prev) => [...prev, payload]);
      } else {
        const clone = [...supplyList];
        clone[findID] = payload;
        setSupplyList(clone);
      }

      setTransporter("");
      setWaybillNo("");
      setTruckNo("");
      setQuantityLoaded("");
      setProductSupply("");
      setSupplyDate("");
      setSelected([]);

      const incomingLeft = incomingList.filter(
        (data) => data._id !== selectedIncomingOrders._id
      );
      setIncomingList(incomingLeft);
    } else {
      swal("Warning!", `Please add quantity to each tank. `, "info");
    }
  };

  const deleteFromList = (index) => {
    const clone = [...supplyList];
    clone.pop(index);
    setSupplyList(clone);
  };

  const searchWayBill = (e) => {
    dispatch(searchIncoming(e.target.value));
  };

  const getFilteredTanks = () => {
    const clonedTanks = JSON.parse(JSON.stringify(tankList));

    const PMS = clonedTanks?.filter(
      (data) => data.productType === productSupply
    );
    const AGO = clonedTanks?.filter(
      (data) => data.productType === productSupply
    );
    const DPK = clonedTanks?.filter(
      (data) => data.productType === productSupply
    );

    switch (productSupply) {
      case "PMS": {
        return PMS?.map((data, index) => {
          return {
            ...data,
            label: data.tankName,
            value: index,
            newLevel: 0,
            addedQuantity: 0,
          };
        });
      }

      case "AGO": {
        return AGO?.map((data, index) => {
          return {
            ...data,
            label: data.tankName,
            value: index,
            newLevel: 0,
            addedQuantity: 0,
          };
        });
      }

      case "DPK": {
        return DPK?.map((data, index) => {
          return {
            ...data,
            label: data.tankName,
            value: index,
            newLevel: 0,
            addedQuantity: 0,
          };
        });
      }

      default: {
        return [];
      }
    }
  };

  function removeSpecialCharacters(str) {
    return str.replace(/[^0-9.]/g, "");
  }

  const updatedTankSupply = (e) => {
    setQuantityLoaded(removeSpecialCharacters(e.target.value));
  };

  const saveSupply = () => {
    swal({
      title: "Alert!",
      text: `Are you sure you want to save this supply?`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        if (supplyList.length !== 0) {
          setStop(true);
          const payload = {
            load: supplyList,
          };

          SupplyService.createSupply(payload)
            .then((data) => {
              if (data.status === "failed") {
                setSupplyList([]);
                swal(
                  "Succes!",
                  "Supply can only be recorded for today or less.",
                  "success"
                );
              } else {
                setSupplyList([]);
                swal(
                  "Succes!",
                  "Supply has been recorded successfully!",
                  "success"
                );
              }
            })
            .then(() => {
              setStop(false);
              navigate("supply");
            });
        } else {
          swal("Warning!", `You can not submit an empty supply list. `, "info");
        }
      }
    });
  };

  return (
    <div className="inner-body">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={stop}
        // onClick={handleClose}
      >
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#fff"
          ariaLabel="ball-triangle-loading"
          wrapperClass={{}}
          wrapperStyle=""
          visible={true}
        />
      </Backdrop>
      <div className="left-supply">
        <div className="double-form">
          <div className="input-d">
            <span style={{ color: "green" }}>Waybill No</span>
            <div style={{ width: "100%", position: "relative" }}>
              <div onClick={() => setMenus(!menus)} className="text-field2">
                <span style={{ marginLeft: "10px" }}>{waybillNo}</span>
                <KeyboardArrowDownIcon />
              </div>
              {menus && (
                <div className="drop">
                  <input
                    onChange={(e) => searchWayBill(e)}
                    className="searches"
                    type={"text"}
                    placeholder="Search"
                  />
                  <div className="cons">
                    {incomingList.map((data, index) => {
                      return (
                        <span
                          key={index}
                          onClick={() => {
                            selectedIncomingOrder(data);
                          }}
                          className="ids">
                          &nbsp;&nbsp;&nbsp;{`${data.wayBillNo}`}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="input-d">
            <span style={{ color: "green" }}>Transporter</span>
            <input
              disabled
              value={transporter}
              onChange={(e) => setTransporter(e.target.value)}
              className="text-field"
              type={"text"}
            />
          </div>
        </div>

        <div className="single-form">
          <div className="input-d">
            <span style={{ color: "green" }}>Truck No</span>
            <input
              style={{ width: "96%" }}
              disabled
              value={truckNo}
              onChange={(e) => setTruckNo(e.target.value)}
              className="text-field"
              type={"text"}
            />
          </div>
        </div>

        <div className="double-form">
          <div className="input-d">
            <span style={{ color: "green" }}>Product Supply</span>
            <input
              disabled
              value={productSupply}
              onChange={(e) => setProductSupply(e.target.value)}
              className="text-field"
              type={"text"}
            />
          </div>

          <div className="input-d">
            <span style={{ color: "green" }}>Quantity Loaded</span>
            <input
              disabled
              value={quantityLoaded}
              onChange={(e) => {
                updatedTankSupply(e);
              }}
              className="text-field"
              type={"text"}
            />
          </div>
        </div>

        <div style={{ width: "100%" }} className="single-form">
          <div className="input-d">
            <span style={{ color: "green" }}>Date of supply</span>
            <input
              style={{ width: "96%" }}
              value={supplyDate}
              onChange={(e) => setSupplyDate(e.target.value)}
              className="text-field"
              type="date"
            />
          </div>
        </div>

        <div className="single-form">
          <div style={{ width: "98%" }} className="input-d">
            <span style={{ color: "green" }}>Select tanks</span>
            <MultiSelect
              options={getFilteredTanks()}
              value={selected}
              onChange={setSelected}
              className="multiple"
            />
          </div>
        </div>

        <div className="tanks">
          {selected.map((data, index) => {
            return (
              <div key={index} className="items">
                <span>
                  {data.label}
                  <span style={label}>(capacity: {data.tankCapacity})</span>
                </span>
                <input
                  onChange={(e) => {
                    incomingTanks(e, data);
                  }}
                  className="tank-input"
                  type={"text"}
                  style={{ width: "98%" }}
                  placeholder={`Current level: ${data.currentLevel}`}
                />
              </div>
            );
          })}
        </div>

        <div className="double-form">
          <div className="input-d">
            <span style={{ color: "green" }}>Shortage</span>
            <input
              value={shortage}
              disabled
              className="text-field"
              type={"text"}
            />
          </div>

          <div className="input-d">
            <span style={{ color: "green" }}>Overage</span>
            <input
              value={overage}
              disabled
              className="text-field"
              type={"text"}
            />
          </div>
        </div>

        <div style={add}>
          <Button
            sx={{
              width: "140px",
              height: "30px",
              background: "#427BBE",
              borderRadius: "3px",
              fontSize: "11px",
              "&:hover": {
                backgroundColor: "#427BBE",
              },
            }}
            onClick={addDetailsToList}
            variant="contained">
            <AddIcon sx={{ marginRight: "10px" }} /> Add to List
          </Button>
        </div>
      </div>

      <div className="right-supply">
        <div className="table-head">
          <div className="col">S/N</div>
          <div className="col">Transporter</div>
          <div className="col">Product</div>
          <div className="col">Quantity</div>
          <div className="col">Action</div>
        </div>

        {supplyList.length === 0 ? (
          <div style={{ marginTop: "10px" }}>No data</div>
        ) : (
          supplyList.map((data, index) => {
            return (
              <div
                key={index}
                style={{ background: "#fff", marginTop: "5px" }}
                className="table-head">
                <div style={{ color: "#000" }} className="col">
                  {index + 1}
                </div>
                <div style={{ color: "#000" }} className="col">
                  {data?.transportationName}
                </div>
                <div style={{ color: "#000" }} className="col">
                  {data?.productType}
                </div>
                <div style={{ color: "#000" }} className="col">
                  {data?.quantity}
                </div>
                <div style={{ color: "#000" }} className="col">
                  <img
                    onClick={() => {
                      deleteFromList(index);
                    }}
                    style={{ width: "22px", height: "22px" }}
                    src={hr8}
                    alt="icon"
                  />
                </div>
              </div>
            );
          })
        )}

        <div style={{ ...add, justifyContent: "flex-end" }}>
          <Button
            sx={{
              width: "100px",
              height: "30px",
              background: "#427BBE",
              borderRadius: "3px",
              fontSize: "11px",
              "&:hover": {
                backgroundColor: "#427BBE",
              },
            }}
            onClick={saveSupply}
            variant="contained">
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const label = {
  fontSize: "12px",
  marginLeft: "5px",
  fontWeight: "500",
  color: "red",
};

const add = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  marginTop: "30px",
};

export default CreateSupply;
