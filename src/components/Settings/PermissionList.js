import "../../styles/permList.scss";
import { styled } from '@mui/material/styles';
import { Switch } from "@mui/material";
import data from "./permissionsHelper";
import perm from "./perm_struct";
import { useSelector } from "react-redux";
import swal from 'sweetalert';
import DashboardService from "../../services/dashboard";

const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&:before, &:after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
      },
      '&:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&:after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
}));

const ListCards = ({item, section, data}) => {
    const employees = useSelector(state => state.dashboardReducer.employees);
    const selectedUsers = employees.filter(data => data.selected === "1");

    const changePermission = (e) => {
        if(selectedUsers.length === 0) return swal("Warning!", "Please select at least one user to update permission!", "info");

        let updatePerm = [];
        let keyData = section.toLowerCase().split(' ').join(",").replace(",", "");

        switch(keyData){
            case "dashboard":{
                updatePerm = [...selectedUsers].map(data => {
                    const copy = {...data};
                    copy.permission.dashboard[item] = e.target.checked;
                    return copy
                });
                break;
            }

            case "dailysales":{
                updatePerm = [...selectedUsers].map(data => {
                    const copy = {...data};
                    copy.permission.dailySales[item] = e.target.checked;
                    return copy
                });
                break;
            }

            case "mystations":{
                updatePerm = [...selectedUsers].map(data => {
                    const copy = {...data};
                    copy.permission.myStation[item] = e.target.checked;
                    return copy
                });
                break;
            }

            case "recordsales":{
                updatePerm = [...selectedUsers].map(data => {
                    const copy = {...data};
                    copy.permission.recordSales[item] = e.target.checked;
                    return copy
                });
                break;
            }

            case "analysis":{
                updatePerm = [...selectedUsers].map(data => {
                    const copy = {...data};
                    copy.permission.analysis[item] = e.target.checked;
                    return copy
                });
                break;
            }

            case "corporatesales":{
                updatePerm = [...selectedUsers].map(data => {
                    const copy = {...data};
                    copy.permission.corporateSales[item] = e.target.checked;
                    return copy
                });
                break;
            }

            case "productorders":{
                updatePerm = [...selectedUsers].map(data => {
                    const copy = {...data};
                    copy.permission.productOrder[item] = e.target.checked;
                    return copy
                });
                break;
            }

            case "incomingorders":{
                updatePerm = [...selectedUsers].map(data => {
                    const copy = {...data};
                    copy.permission.incomingOrder[item] = e.target.checked;
                    return copy
                });
                break;
            }

            default:{
                updatePerm = [...selectedUsers].map(data => {
                    return {
                        ...data, 
                        permission: {
                            ...data.permission,
                        }
                    }
                });
            }
        }

        // const payload = {
        //     permissions: updatePerm
        // }

        // DashboardService.updateUserPermission(payload).then(data => {
        //     console.log(data, "ddddd")
        // })

        console.log(updatePerm, "perm")
    }

    return(
        <li className="content_cell">
            <div className="cell_final">
                <div className="perm_name_list">{data}</div>
                <div className="perm_check">
                    <Android12Switch onChange={(e) => changePermission(e)} defaultChecked />
                </div>
            </div>
        </li>
    )
}

const PermissionListItems = (props) => {
    const keys = Object.keys(props.data.permissions);

    return(
        <div className="perm_list_items">
            <div className="perm_list_title">
                <div className="perm_list_num">{props.index + 1}</div>
                <div className="perm_list_name">{props.data.name}</div>
            </div>

            <ol type="a" className="perm_list_content">
                {
                    keys?.map((item, index) => {
                        return(
                            <ListCards key={index} item={item} section={props.data.name} data={props.data.permissions[item]} />
                        )
                    })
                }
            </ol>
        </div>
    )
}

const PermissionList = (props) => {
    const goBack = () => {
        props.nav(1);
    }

    return(
        <div className="perm_list_container">
            <div onClick={goBack} className="header_text_perm">
                <span style={{fontSize:'20px'}}>&#8592;</span> Allow/Disallow Permission
            </div>

            <div className="perm_list">
                {
                    data.map((item, index) => {
                        return(
                            <PermissionListItems key={index} data={item} index={index} />
                        )
                    })
                }
            </div>
        </div>
    )
}

export default PermissionList;