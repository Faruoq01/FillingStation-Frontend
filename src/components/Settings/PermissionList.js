import "../../styles/permList.scss";
import { Button } from "@mui/material";
import data from "./permissionsHelper";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import DashboardService from "../../services/360station/dashboard";
import PermissionListItems from "./components.js/permlistItems";
import React from "react";
import { setLoader } from "../../storage/settings";

const PermissionList = (props) => {
  const dispatch = useDispatch();
  const allUsers = useSelector((state) => state.settings.selectedUsers);
  const dataCopy = JSON.parse(JSON.stringify(data));

  const goBack = () => {
    props.nav(1);
  };

  const submit = () => {
    dispatch(setLoader(true));
    const payload = {
      permissions: allUsers,
    };

    DashboardService.updateUserPermission(payload).then(() => {
      swal("Success", "Records updated successfully!", "success");
    }).then(()=>{
      dispatch(setLoader(false));
    })
  };

  return (
    <React.Fragment>
      <div className="perm_list_container">
        <div className="header_text_perm">
          <div onClick={goBack}>
            <span style={{ fontSize: "20px" }}>&#8592;</span> Allow/Disallow
            Permission
          </div>
          <Button
            sx={{
              width: "100px",
              height: "30px",
              background: "#427BBE",
              borderRadius: "3px",
              fontSize: "10px",
              marginTop: "10px",
              "&:hover": {
                backgroundColor: "#427BBE",
              },
            }}
            onClick={submit}
            variant="contained">
            {" "}
            Submit
          </Button>
        </div>

        <div className="perm_list">
          <PermissionListItems 
            id = {1}
            name={'Dashboard'} 
            data={dataCopy.dashboard} 
          />
          <PermissionListItems 
            id = {2}
            name={'Daily Sales'} 
            data={dataCopy.dailySales} 
          />
          <PermissionListItems 
            id = {3}
            name={'My Station'} 
            data={dataCopy.station} 
          />
          <PermissionListItems 
            id = {4}
            name={'Record Sales'} 
            data={dataCopy.recordsales} 
          />
          <PermissionListItems 
            id = {5}
            name={'Analysis'} 
            data={dataCopy.analysis} 
          />
          <PermissionListItems 
            id = {6}
            name={'Payments'} 
            data={dataCopy.payments} 
          />
          <PermissionListItems 
            id = {7}
            name={'Expenses'} 
            data={dataCopy.expenses} 
          />
          <PermissionListItems 
            id = {8}
            name={'Corporate Sales'} 
            data={dataCopy.lpo} 
          />
          <PermissionListItems 
            id = {9}
            name={'Product Order'} 
            data={dataCopy.productorder} 
          />
          <PermissionListItems 
            id = {10}
            name={'Incoming Order'} 
            data={dataCopy.incomingorder} 
          />
          <PermissionListItems 
            id = {11}
            name={'Supply'} 
            data={dataCopy.supply} 
          />
          <PermissionListItems 
            id = {12}
            name={'Regulatory'} 
            data={dataCopy.regulatory} 
          />
          <PermissionListItems 
            id = {13}
            name={'Tank Update'} 
            data={dataCopy.tankupdate} 
          />
          <PermissionListItems 
            id = {14}
            name={'Human Resources'} 
            data={dataCopy.hr} 
          />
          <PermissionListItems 
            id = {15}
            name={'Settings'} 
            data={dataCopy.settings} 
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default PermissionList;
