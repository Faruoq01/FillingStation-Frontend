import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { closeModal, openModal, newOutlet } from "../../../storage/outlet";
import { useSelector } from "react-redux";
import close from "../../../assets/close.png";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import Modal from "@mui/material/Modal";
import { ThreeDots } from "react-loader-spinner";
import states from "../../../modules/states";
import swal from "sweetalert";
import "../../../styles/payments.scss";
import AddStationLocationMap from "../../common/AddStationLocationMap";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { GoogleApiWrapper } from "google-maps-react";
import upload from "../../../assets/upload.png";
import axios from "axios";
import config from "../../../constants";
import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton } from "@mui/material";
import OutletService from "../../../services/360station/outletService";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const CreateStation = (props) => {
  const dispatch = useDispatch();
  const attach = useRef();
  const open = useSelector((state) => state.outlet.openModal);
  const user = useSelector((state) => state.auth.user);

  const handleClose = () => dispatch(closeModal(0));
  const [defaultState, setDefaultState] = useState(0);
  const [local, setLocal] = useState(0);
  const [loading2, setLoading2] = useState(0);
  const [uploadFile, setUpload] = useState("");

  const [outletName, setOutletName] = useState("");
  const [state, setState] = useState(states.listOfStates[0].state);
  const [city, setCity] = useState("");
  const [lga, setLga] = useState(states.listOfStates[0].lgas[0]);
  const [alias, setAlias] = useState("");
  const [pmsCost, setPMSCost] = useState("");
  const [pmsPrice, setPMSPrice] = useState("");
  const [agoCost, setAGOCost] = useState("");
  const [agoPrice, setAGOPrice] = useState("");
  const [dpkCost, setDPKCost] = useState("");
  const [dpkPrice, setDPKPrice] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [openingHour, setOpeningHour] = useState("");
  const [closingHour, setClosingHour] = useState("");
  const [startWeekDay, setStartWeekday] = useState(0);
  const [endWeekday, setEndWeekday] = useState(4);
  const [amenities, setAmenities] = useState([]);
  const [phone, setPhone] = useState([]);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const handleTankModal = async () => {
    if (outletName === "")
      return swal("Warning!", "Outlet name field cannot be empty", "info");
    if (state === "")
      return swal("Warning!", "State field cannot be empty", "info");
    if (city === "")
      return swal("Warning!", "City field cannot be empty", "info");
    if (lga === "")
      return swal("Warning!", "LGA field cannot be empty", "info");
    if (pmsCost === "")
      return swal("Warning!", "PMS Cost field cannot be empty", "info");
    if (pmsPrice === "")
      return swal("Warning!", "PMS Price field cannot be empty", "info");
    if (agoCost === "")
      return swal("Warning!", "AGO Cost field cannot be empty", "info");
    if (agoPrice === "")
      return swal("Warning!", "AGO Price field cannot be empty", "info");
    if (dpkCost === "")
      return swal("Warning!", "DPK Cost field cannot be empty", "info");
    if (dpkPrice === "")
      return swal("Warning!", "DPK Price field cannot be empty", "info");
    if (alias === "")
      return swal("Warning!", "Alias field cannot be empty", "info");
    if (longitude === "")
      return swal("Warning!", "Longitude field cannot be empty", "info");
    if (latitude === "")
      return swal("Warning!", "latitude field cannot be empty", "info");
    if (openingHour === "")
      return swal("Warning!", "Opening hour field cannot be empty", "info");
    if (closingHour === "")
      return swal("Warning!", "Closing hour field cannot be empty", "info");
    if (startWeekDay === "")
      return swal("Warning!", "Start week day field cannot be empty", "info");
    if (endWeekday === "")
      return swal("Warning!", "End week day field cannot be empty", "info");
    if (amenities.length === 0)
      return swal("Warning!", "Amenities field cannot be empty", "info");
    if (phone.length === 0)
      return swal("Warning!", "Phone contact field cannot be empty", "info");
    if (uploadFile === "")
      return swal("Warning!", "File upload cannot be empty", "info");
    setLoadingSpinner(true);

    const data = {
      outletName: outletName,
      state: state,
      city: city,
      lga: lga,
      alias: alias,
      noOfTanks: "",
      noOfPumps: "",
      image: uploadFile,
      PMSCost: removeSpecialCharacters(pmsCost),
      PMSPrice: removeSpecialCharacters(pmsPrice),
      AGOCost: removeSpecialCharacters(agoCost),
      AGOPrice: removeSpecialCharacters(agoPrice),
      DPKCost: removeSpecialCharacters(dpkCost),
      DPKPrice: removeSpecialCharacters(dpkPrice),
      organisation: resolveUserID().id,
      longitude: removeSpecialCharacters(String(longitude)),
      latitude: removeSpecialCharacters(String(latitude)),
      openingHour: openingHour,
      closingHour: closingHour,
      startWeekday: days[startWeekDay],
      endWeekday: days[endWeekday],
      amenities: amenities,
      phone: phone,
    };

    OutletService.registerFillingStation(data)
      .then((data) => {
        dispatch(newOutlet(data));
      })
      .then(() => {
        setLoadingSpinner(false);
        dispatch(closeModal(0));
        props.getStations();
        dispatch(openModal(2));
      })
      .catch((err) => {});
  };

  const handleMenuSelection = (item) => {
    setDefaultState(item.target.dataset.value);
    setState(states.listOfStates[item.target.dataset.value].state);
  };

  const handleLgaSelection = (item) => {
    setLocal(item.target.dataset.value);
    setLga(states.listOfStates[defaultState].lgas[item.target.dataset.value]);
  };

  const handleChange = (address) => {
    setCity(address);
  };

  const handleSelect = (address) => {
    setCity(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]))
      .then((latLng) => {
        setLongitude(latLng.lng);
        setLatitude(latLng.lat);
      })
      .catch((error) => console.error("Error", error));
  };

  function removeSpecialCharacters(str) {
    return str.replace(/[^0-9.]/g, "");
  }

  const uploadProductOrders = () => {
    attach.current.click();
  };

  const selectedFile = (e) => {
    let file = e.target.files[0];
    setLoading2(1);
    const formData = new FormData();
    formData.append("file", file);
    const httpConfig = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    };
    const url = `${config.BASE_URL}/360-station/api/upload`;
    axios
      .post(url, formData, httpConfig)
      .then((data) => {
        setUpload(data.data.path);
      })
      .then(() => {
        setLoading2(2);
      });
  };

  const createAmenities = () => {
    setAmenities((prev) => [...prev, { name: "" }]);
  };

  const removeAmenities = (pos) => {
    const copy = amenities.filter((data, index) => index !== pos);
    setAmenities(copy);
  };

  const amenitiesInput = (e, index) => {
    const copy = [...amenities];
    copy[index].name = e.target.value;
    setAmenities(copy);
  };

  const createContact = () => {
    setPhone((prev) => [...prev, { phone: "" }]);
  };

  const removeContact = (pos) => {
    const copy = phone.filter((data, index) => index !== pos);
    setPhone(copy);
  };

  const contactInput = (e, index) => {
    const copy = [...phone];
    copy[index].phone = e.target.value;
    setPhone(copy);
  };

  return (
    <Modal
      open={open === 1}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div className="modalContainer2">
        <div className="inner">
          <div className="head">
            <div className="head-text">Create Filling Station</div>
            <img
              onClick={handleClose}
              style={{ width: "18px", height: "18px" }}
              src={close}
              alt={"icon"}
            />
          </div>

          <div
            style={{
              width: "100%",
              height: "480px",
              paddingRight: "5px",
              overflowX: "hidden",
              overflowY: "scroll",
            }}>
            <div className="inputs">
              <div className="head-text2">Outlet Name</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                onChange={(e) => setOutletName(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Choose state</div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={defaultState}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}>
                {states.listOfStates.map((item, index) => {
                  return (
                    <MenuItem
                      style={menu}
                      key={index}
                      onClick={handleMenuSelection}
                      value={index}>
                      {item.state}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">LGA</div>
              <Select
                labelId="demo-select-small"
                id="demo-select-small"
                value={local}
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}>
                {states.listOfStates[defaultState].lgas.map((item, index) => {
                  return (
                    <MenuItem
                      style={menu}
                      key={index}
                      onClick={handleLgaSelection}
                      value={index}>
                      {item}
                    </MenuItem>
                  );
                })}
              </Select>
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Address (Full address)</div>
              <PlacesAutocomplete
                value={city}
                onChange={handleChange}
                onSelect={handleSelect}>
                {({
                  getInputProps,
                  suggestions,
                  getSuggestionItemProps,
                  loading,
                }) => (
                  <div style={{ width: "100%" }}>
                    <input
                      style={{
                        width: "96%",
                        height: "35px",
                        marginTop: "5px",
                        background: "#EEF2F1",
                        fontSize: "12px",
                        borderRadius: "0px",
                        paddingLeft: "10px",
                        border: "1px solid #777777",
                        outline: "none",
                      }}
                      {...getInputProps({
                        placeholder: "",
                        className: "location-search-input",
                      })}
                    />
                    <div className="autocomplete-dropdown-container">
                      {loading && <div>Loading...</div>}
                      {suggestions.map((suggestion) => {
                        const className = suggestion.active
                          ? "suggestion-item--active"
                          : "suggestion-item";
                        // inline style for demonstration purpose
                        const style = suggestion.active
                          ? { backgroundColor: "#fafafa", cursor: "pointer" }
                          : { backgroundColor: "#ffffff", cursor: "pointer" };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              style,
                            })}>
                            <span style={mens}>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </PlacesAutocomplete>
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Alias</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                onChange={(e) => setAlias(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">PMS Cost Price</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type={"text"}
                value={pmsCost}
                onChange={(e) => setPMSCost(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">PMS Selling Price</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type={"text"}
                value={pmsPrice}
                onChange={(e) => setPMSPrice(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">AGO Cost Price</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type={"text"}
                value={agoCost}
                onChange={(e) => setAGOCost(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">AGO Selling Price</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type={"text"}
                value={agoPrice}
                onChange={(e) => setAGOPrice(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">DPK Cost Price</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type={"text"}
                value={dpkCost}
                onChange={(e) => setDPKCost(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">DPK Selling Price</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                type={"text"}
                value={dpkPrice}
                onChange={(e) => setDPKPrice(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Longitude</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>

            <div style={{ marginTop: "15px" }} className="inputs">
              <div className="head-text2">Latitude</div>
              <OutlinedInput
                sx={{
                  width: "100%",
                  height: "35px",
                  marginTop: "5px",
                  background: "#EEF2F1",
                  fontSize: "12px",
                  borderRadius: "0px",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    border: "1px solid #777777",
                  },
                }}
                placeholder=""
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>

            <AddStationLocationMap
              city={city}
              long={setLongitude}
              lat={setLatitude}
              lt={latitude}
              ln={longitude}
            />

            <div style={{ marginTop: "25px" }} className="inputs">
              <div className="head-text2">Working Hours</div>
              <div style={flat}>
                <OutlinedInput
                  sx={{
                    width: "48%",
                    height: "35px",
                    background: "#EEF2F1",
                    fontSize: "12px",
                    borderRadius: "0px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder="opening"
                  type={"time"}
                  value={openingHour}
                  onChange={(e) => setOpeningHour(e.target.value)}
                />
                <OutlinedInput
                  sx={{
                    width: "48%",
                    height: "35px",
                    background: "#EEF2F1",
                    fontSize: "12px",
                    borderRadius: "0px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder="closing"
                  type={"time"}
                  value={closingHour}
                  onChange={(e) => setClosingHour(e.target.value)}
                />
              </div>

              <div style={{ ...flat, marginTop: "10px" }}>
                <Select
                  sx={{
                    width: "48.5%",
                    height: "35px",
                    background: "#EEF2F1",
                    fontSize: "12px",
                    borderRadius: "0px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder="opening"
                  value={startWeekDay}
                  // onChange={e => setOpeningHour(e.target.value)}
                >
                  {days.map((item, index) => {
                    return (
                      <MenuItem
                        onClick={(e) => {
                          setStartWeekday(index);
                        }}
                        key={index}
                        style={menu}
                        value={index}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </Select>
                <Select
                  sx={{
                    width: "48.5%",
                    height: "35px",
                    background: "#EEF2F1",
                    fontSize: "12px",
                    borderRadius: "0px",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      border: "1px solid #777777",
                    },
                  }}
                  placeholder="opening"
                  value={endWeekday}>
                  {days.map((item, index) => {
                    return (
                      <MenuItem
                        onClick={(e) => {
                          setEndWeekday(index);
                        }}
                        key={index}
                        style={menu}
                        value={index}>
                        {item}
                      </MenuItem>
                    );
                  })}
                </Select>
              </div>
            </div>

            <div style={{ marginTop: "25px" }} className="inputs">
              <div className="head-text2">Amenities</div>
              <Button onClick={createAmenities} sx={amenitiesButton}>
                <AddIcon />
                <div>Click here to add amenities</div>
              </Button>

              {amenities.map((item, index) => {
                return (
                  <div style={ops}>
                    <OutlinedInput
                      key={index}
                      sx={{
                        width: "100%",
                        height: "35px",
                        background: "#EEF2F1",
                        fontSize: "12px",
                        borderRadius: "0px",
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "1px solid #777777",
                        },
                      }}
                      placeholder="Enter amenities e.g lubricants, bars, spare parts etc"
                      value={item.name}
                      onChange={(e) => {
                        amenitiesInput(e, index);
                      }}
                    />
                    <div>
                      <IconButton>
                        <CancelIcon
                          onClick={() => {
                            removeAmenities(index);
                          }}
                          sx={{ color: "red" }}
                        />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: "25px" }} className="inputs">
              <div className="head-text2">Phone Contact Numbers</div>
              <Button onClick={createContact} sx={amenitiesButton}>
                <AddIcon />
                <div>Click here to add phone contacts</div>
              </Button>

              {phone.map((item, index) => {
                return (
                  <div style={ops}>
                    <OutlinedInput
                      key={index}
                      sx={{
                        width: "100%",
                        height: "35px",
                        background: "#EEF2F1",
                        fontSize: "12px",
                        borderRadius: "0px",
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          border: "1px solid #777777",
                        },
                      }}
                      placeholder="Enter phone number"
                      value={item.phone}
                      onChange={(e) => {
                        contactInput(e, index);
                      }}
                    />
                    <div>
                      <IconButton>
                        <CancelIcon
                          onClick={() => {
                            removeContact(index);
                          }}
                          sx={{ color: "red" }}
                        />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
            </div>

            <Button
              sx={{
                width: "100%",
                height: "35px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "30px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={uploadProductOrders}
              variant="contained">
              <img
                style={{ width: "25px", height: "20px", marginRight: "10px" }}
                src={upload}
                alt={"icon"}
              />
              {loading2 === 0 && <div>Attachment</div>}
              {loading2 === 1 && (
                <ThreeDots
                  height="60"
                  width="50"
                  radius="9"
                  color="#076146"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              )}
              {loading2 === 2 && (
                <div style={{ color: "#fff", fontSize: "12px" }}>Success</div>
              )}
            </Button>
            <input
              onChange={selectedFile}
              ref={attach}
              type="file"
              style={{ visibility: "hidden" }}
            />
          </div>

          <div style={{ height: "30px" }} className="butt">
            <Button
              disabled={loadingSpinner}
              sx={{
                width: "100px",
                height: "30px",
                background: "#427BBE",
                borderRadius: "3px",
                fontSize: "10px",
                marginTop: "00px",
                "&:hover": {
                  backgroundColor: "#427BBE",
                },
              }}
              onClick={handleTankModal}
              variant="contained">
              {" "}
              Save
            </Button>

            {loadingSpinner ? (
              <ThreeDots
                height="60"
                width="50"
                radius="9"
                color="#076146"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClassName=""
                visible={true}
              />
            ) : null}
          </div>
        </div>
      </div>
    </Modal>
  );
};

const ops = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginTop: "8px",
};

const amenitiesButton = {
  width: "100%",
  height: "35px",
  marginTop: "10px",
  background: "#f7f7f7",
  border: "1px dashed #888888",
  color: "#888888",
  textTransform: "capitalize",
  fontSize: "12px",
  "&hover": {
    background: "#f7f7f7",
  },
};

const flat = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: "5px",
};

const menu = {
  fontSize: "14px",
};

const mens = {
  width: "100%",
  height: "auto",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "flex-start",
  marginTop: "5px",
  border: "1px solid #ccc",
  borderTopColor: "transparent",
  borderLeft: "none",
  borderRight: "none",
  paddingBottom: "5px",
  fontSize: "12px",
  fontFamily: "Poppins",
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyDZnZ15rSQS_2CluQE47CY5MRqAHGdUYZY",
  libraries: ["places"],
})(CreateStation);
