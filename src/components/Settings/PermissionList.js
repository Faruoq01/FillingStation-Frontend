import "../../styles/permList.scss";
import { styled } from "@mui/material/styles";
import { Button, Switch } from "@mui/material";
import data from "./permissionsHelper";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import DashboardService from "../../services/360station/dashboard";
import { useState } from "react";
import { useEffect } from "react";
import { saveSelectedUsers } from "../../storage/settings";

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const ListCards = ({ item, section, data }) => {
  const dispatch = useDispatch();
  const singleUser = useSelector((state) => state.settings.singleUser);
  const selectedUsers = useSelector((state) => state.settings.selectedUsers);
  const [updatedUser, setUpdatedUser] = useState(null);

  const getPerm = () => {
    if (updatedUser !== null) {
      let keyData = section.toLowerCase().split(" ").join(",").replace(",", "");

      switch (keyData) {
        case "dashboard": {
          return updatedUser.dashboard[item];
        }

        case "dailysales": {
          return updatedUser.dailySales[item];
        }

        case "mystations": {
          return updatedUser.myStation[item];
        }

        case "recordsales": {
          return updatedUser.recordSales[item];
        }

        case "analysis": {
          return updatedUser.analysis[item];
        }

        case "payments": {
          return updatedUser.payments[item];
        }

        case "expenses": {
          return updatedUser.expenses[item];
        }

        case "corporatesales": {
          return updatedUser.corporateSales[item];
        }

        case "productorders": {
          return updatedUser.productOrder[item];
        }

        case "incomingorders": {
          return updatedUser.incomingOrder[item];
        }

        case "supply": {
          return updatedUser.supply[item];
        }

        case "regulatorypayment": {
          return updatedUser.regPay[item];
        }

        case "tankupdate": {
          return updatedUser.tankUpdate[item];
        }

        case "humanresources": {
          return updatedUser.hr[item];
        }

        case "settings": {
          return updatedUser.settings[item];
        }

        default: {
        }
      }
    }
  };

  useEffect(() => {
    setUpdatedUser(singleUser?.permission);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changePermission = (e) => {
    if (selectedUsers.length === 0)
      return swal(
        "Warning!",
        "Please select at least one user to update permission!",
        "info"
      );

    let updatePerm = JSON.parse(JSON.stringify(selectedUsers));
    let keyData = section.toLowerCase().split(" ").join(",").replace(",", "");

    switch (keyData) {
      case "dashboard": {
        updatePerm = updatePerm.map((data) => {
          const copy = { ...data };
          copy.permission.dashboard[item] = e.target.checked;
          return copy;
        });
        console.log(updatePerm, "logs mehn");
        break;
      }

      case "dailysales": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.dailySales[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "mystations": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.myStation[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "recordsales": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.recordSales[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "analysis": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.analysis[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "payments": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.payments[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "expenses": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.expenses[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "corporatesales": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.corporateSales[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "productorders": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.productOrder[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "incomingorders": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.incomingOrder[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "supply": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.supply[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "regulatorypayment": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.regPay[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "tankupdate": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.tankUpdate[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "humanresources": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.hr[item] = e.target.checked;
          return copy;
        });
        break;
      }

      case "settings": {
        const users = JSON.parse(JSON.stringify(selectedUsers));
        updatePerm = users.map((data) => {
          const copy = { ...data };
          copy.permission.settings[item] = e.target.checked;
          return copy;
        });
        break;
      }

      default: {
      }
    }
    dispatch(saveSelectedUsers(updatePerm));
    const latestUser = updatePerm.filter((data) => data._id === singleUser._id);
    setUpdatedUser(latestUser[0]?.permission);
  };

  return (
    <li className="content_cell">
      <div className="cell_final">
        <div className="perm_name_list">{data}</div>
        <div className="perm_check">
          <Android12Switch
            onChange={(e) => changePermission(e)}
            checked={typeof getPerm() === "undefined" ? false : getPerm()}
          />
        </div>
      </div>
    </li>
  );
};

const PermissionListItems = (props) => {
  const keys = Object.keys(props.data.permissions);

  return (
    <div className="perm_list_items">
      <div className="perm_list_title">
        <div className="perm_list_num">{props.index + 1}</div>
        <div className="perm_list_name">{props.data.name}</div>
      </div>

      <ol type="a" className="perm_list_content">
        {keys?.map((item, index) => {
          return (
            <ListCards
              key={index}
              item={item}
              section={props.data.name}
              data={props.data.permissions[item]}
              userList={props.users}
            />
          );
        })}
      </ol>
    </div>
  );
};

const PermissionList = (props) => {
  const allUsers = useSelector((state) => state.settings.selectedUsers);

  const goBack = () => {
    props.nav(1);
  };

  const submit = () => {
    const payload = {
      permissions: allUsers,
    };

    DashboardService.updateUserPermission(payload).then(() => {
      swal("Success", "Records updated successfully!", "success");
    });
  };

  return (
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
        {data.map((item, index) => {
          return <PermissionListItems key={index} data={item} index={index} />;
        })}
      </div>
    </div>
  );
};

export default PermissionList;
