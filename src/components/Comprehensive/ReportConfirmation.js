import { Avatar, Button } from "@mui/material";
import "../../styles/confirmation_msg.scss";
import { useCallback, useEffect, useState } from "react";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import DailySalesService from "../../services/DailySales";
import { ThreeDots } from "react-loader-spinner";
import APIs from "../../services/api";
import { useHistory } from "react-router-dom";
import { setRemarkList } from "../../storage/comprehensive";

const months = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "October",
  11: "November",
  12: "December",
};

const RemarkCard = (props) => {
  const convertDate = (data) => {
    const date = data.split("-");
    const format = `${date[2]} ${months[date[1]]} ${date[0]}`;
    return format;
  };

  return (
    <div className="remark_card">
      <div className="name_avatar">
        {props.data.image === "null" ? (
          <Avatar
            sx={{ width: "35px", height: "35px", fontSize: "14px" }}
            alt="Remy Sharp">
            {props.data.name.substring(0, 2)}
          </Avatar>
        ) : (
          <Avatar alt="Remy Sharp" src={props.data.image} />
        )}
        <div className="rmk_content">
          <div className="user_rmk">{props.data.name}</div>
          <div className="content_rmk">{props.data.remark}</div>
          <div className="rmk_date">{convertDate(props.data.createdAt)}.</div>
        </div>
      </div>
    </div>
  );
};

const ReportConfirmation = () => {
  const history = useHistory();
  const [remark, setRemark] = useState("");
  const oneStationData = useSelector((state) => state.outlet.adminOutlet);
  const currentDate = useSelector((state) => state.dailysales.updatedDate);
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const dispatch = useDispatch();
  const remarkList = useSelector((state) => state.comprehensive.remarks);

  const resolveUserID = () => {
    if (user.userType === "superAdmin") {
      return { id: user._id };
    } else {
      return { id: user.organisationID };
    }
  };

  const getRemarkData = useCallback((updatedDate) => {
    if (oneStationData === null) return history.push("/home/daily-sales");
    setLoading(true);
    const payload = {
      organizationID: resolveUserID().id,
      outletID: oneStationData._id,
      date: updatedDate,
    };

    APIs.post("/comprehensive/remarks", payload)
      .then(({ data }) => {
        dispatch(setRemarkList(data.remarks));
      })
      .then(() => {
        setLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRemarkData(currentDate);
  }, [getRemarkData, currentDate]);

  const refresh = () => {
    setLoading(true);
    const payload = {
      organizationID: resolveUserID().id,
      outletID: oneStationData._id,
      date: currentDate,
    };

    APIs.post("/comprehensive/remarks", payload)
      .then(({ data }) => {
        dispatch(setRemarkList(data.remarks));
      })
      .then(() => {
        setLoading(false);
      });
  };

  const submitRemark = () => {
    if (remark === "")
      return swal(
        "Warning!",
        "Please add remark before you can submit",
        "info"
      );
    setLoading2(true);

    const payload = {
      name:
        user.userType === "superAdmin"
          ? user.firstname.concat(" ", user.lastname)
          : user.staffName,
      image: user.image,
      remark: remark,
      selectedDate: currentDate,
      outletID: oneStationData?._id,
      organisationID: oneStationData?.organisation,
    };

    APIs.post("/sales/remark", payload)
      .then((data) => {
        console.log(data);
        refresh();
      })
      .then(() => {
        setRemark("");
        setLoading2(false);
        swal("Success!", "Remark created successfullt!", "success");
      });
  };

  return (
    <div style={{ width: "100%" }}>
      <div className="initial_balance_container2">
        <div className="report_confirmation">
          <div className="left_confirmation">
            <div className="confirmation_header">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Reports confirmed by:
              &nbsp;&nbsp;&nbsp; Aminu Faruk Umar
            </div>
            <div className="confirmation_area">
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="remark"
                placeholder="Remark"
              />
            </div>
            <div className="conf_button">
              <Button
                variant="contained"
                sx={{
                  width: "80px",
                  height: "30px",
                  background: "tomato",
                  fontSize: "12px",
                  marginLeft: "10px",
                  borderRadius: "0px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "tomato",
                  },
                }}
                onClick={() => {
                  submitRemark();
                }}>
                {loading2 ? (
                  <ThreeDots
                    height="60"
                    width="50"
                    radius="9"
                    color="#fff"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClassName=""
                    visible={true}
                  />
                ) : (
                  <span>Post</span>
                )}
              </Button>
            </div>
          </div>
          <div className="right_confirmation">
            <div className="rmk">Remark History</div>

            {remarkList.length === 0 ? (
              loading ? (
                <ThreeDots
                  height="60"
                  width="50"
                  radius="9"
                  color="#054834"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              ) : (
                <div>No comments made </div>
              )
            ) : (
              remarkList.map((item, index) => {
                return <RemarkCard key={index} data={item} />;
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportConfirmation;
