import { useDispatch, useSelector } from "react-redux";
import { saveSelectedUsers, storeSingleUser } from "../../../storage/settings";
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

const ListCards = ({key, item, section, data }) => {
    const dispatch = useDispatch();
    const singleUser = useSelector((state) => state.settings.singleUser);
    const selectedUsers = useSelector((state) => state.settings.selectedUsers);
    
    const getPerm = () => {
        const permObject = singleUser?.permission;
        const permField = permObject[mapToPerm[section]];
        return permField[item];
    }
  
    const changePermission = (e) => {
        if(selectedUsers.length === 0) return swal("Error!", "Please select at least one user", "error");
        const payload = e.target.checked;
        let copyOfUsers = JSON.parse(JSON.stringify(selectedUsers));

        copyOfUsers = copyOfUsers.map(data => {
            const permObject = {...data};
            let permField = permObject.permission[mapToPerm[section]];
            permField[item] = payload;
            return permObject;
        });

        const currentUser = copyOfUsers.find(data => data._id === singleUser._id);
        if(currentUser){
            dispatch(storeSingleUser(currentUser));
            dispatch(saveSelectedUsers(copyOfUsers));
        }else{
            swal("Error!", "Please select the current user to change permission", "error");
        }
    };
  
    return (
      <li key={key} className="content_cell">
        <div className="cell_final">
          <div className="perm_name_list">{data}</div>
          <div className="perm_check">
            <Android12Switch
              onChange={(e) => changePermission(e)}
              checked={getPerm()}
            />
          </div>
        </div>
      </li>
    );
};

export default ListCards;