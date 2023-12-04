import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveSelectedUsers, storeSingleUser } from "../../../storage/settings";
import ListCards from "./permlistCards";
import Android12Switch from "./switch";
import swal from "sweetalert";

const mapToPerm = {
    "Dashboard": 'dashboard',
    "Daily Sales": 'dailySales',
    "My Station": 'myStation',
    "Record Sales": 'recordSales',
    "Analysis": 'analysis',
    "Payments": 'payments',
    "Expenses": 'expenses',
    "Corporate Sales": 'corporateSales',
    "Product Order": 'productOrder',
    "Incoming Order": 'incomingOrder',
    "Supply": 'supply',
    "Regulatory": "regPay",
    "Tank Update": 'tankUpdate',
    "Human Resources": 'hr',
    "Settings": 'settings'
}

const PermissionListItems = ({id, name, data}) => {
    const dispatch = useDispatch();
    const keys = Object.keys(data.permissions);
    const singleUser = useSelector((state) => state.settings.singleUser);
    const selectedUsers = useSelector((state) => state.settings.selectedUsers);
    const [groupCheck, setGroupCheck] = useState(false);
  
    const groupedPermissions = (e) => {
        if(selectedUsers.length === 0) return swal("Error!", "Please select at least one user", "error");
        const payload = e.target.checked;
        setGroupCheck(payload);
        let copyOfUsers = JSON.parse(JSON.stringify(selectedUsers));

        copyOfUsers = copyOfUsers.map(data => {
            const permObject = {...data};
            let permField = permObject.permission[mapToPerm[name]];
            const keys = Object.keys(permField);
            for(const key of keys){
                permField[key] = payload;
            }
            return permObject;
        });

        const currentUser = copyOfUsers.find(data => data._id === singleUser._id);
        if(currentUser){
            dispatch(storeSingleUser(currentUser));
            dispatch(saveSelectedUsers(copyOfUsers));
        }else{
            swal("Error!", "Please select the current user to change permission", "error");
        }
    }
  
    return (
      <div className="perm_list_items">
        <div className="perm_list_title">
          <div className="perm_group">
            <div className="perm_list_num">{id}</div>
            <div className="perm_list_name">{name}</div>
          </div>
          <Android12Switch
            onChange={(e) => groupedPermissions(e)}
            checked={groupCheck}
          />
        </div>
  
        <ol type="a" className="perm_list_content">
          {keys?.map((item, index) => {
            return (
              <ListCards
                key={index}
                item={item}
                section={name}
                data={data.permissions[item]}
              />
            );
          })}
        </ol>
      </div>
    );
};

  export default PermissionListItems