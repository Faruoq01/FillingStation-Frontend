import { Radio } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../services/360station/user";
import { updateUser } from "../../storage/auth";
import dark from "../../assets/dark.png";
import light from "../../assets/light.png";

const Appearances = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [active, setActive] = useState(true);
  const [inActive, setInactive] = useState(false);

  const [sideBar, setSideBar] = useState("0");

  useEffect(() => {
    setActive(user.isDark === "0" ? true : false);
    setInactive(user.isDark === "0" ? false : true);
  }, [user.isDark]);

  const selectDarkMode = () => {
    const payload = {
      id: user._id,
      isDark: user.isDark === "0" ? "1" : "0",
    };

    UserService.updateUserDarkMode(payload)
      .then((data) => {
        return data;
      })
      .then((data) => {
        UserService.getOneUser({ id: data.user._id }).then((data) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch(updateUser(data.user));
        });
      });
  };

  const changeSideBar = (data, color) => {
    setSideBar(data);

    const payload = {
      id: user._id,
      sideBarMode: color,
    };

    UserService.updateUserDarkMode(payload)
      .then((data) => {
        return data;
      })
      .then((data) => {
        UserService.getOneUser({ id: data.user._id }).then((data) => {
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch(updateUser(data.user));
        });
      });
  };

  return (
    <div className="appearance">
      <div className="app">
        <div className="head">Appearances</div>
      </div>
      <div className="details">
        <div className="detail-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Posuere
        </div>
        <div className="theme">
          <div className="col">
            <div style={{ fontSize: "12px" }}>Color</div>
            <div style={{ marginTop: "10px" }} className="radio">
              <div style={{ marginRight: "10px" }} className="color-group">
                <div className="colors">
                  <img
                    src={dark}
                    alt="icon"
                    style={{ width: "30px", height: "30px" }}
                  />
                </div>
                <div style={{ fontSize: "12px" }}>Light</div>
              </div>
              <Radio onChange={selectDarkMode} checked={active} />
            </div>
            <div style={{ marginTop: "10px" }} className="radio">
              <div style={{ marginRight: "10px" }} className="color-group">
                <div style={{ background: "#fff" }} className="colors">
                  <img
                    src={light}
                    alt="icon"
                    style={{ width: "30px", height: "30px" }}
                  />
                </div>
                <div style={{ fontSize: "12px" }}>Dark</div>
              </div>
              <Radio onChange={selectDarkMode} checked={inActive} />
            </div>
          </div>

          <div className="col2">
            <div style={{ fontSize: "12px" }}>Theme</div>
            <div style={{ marginTop: "10px" }} className="radio">
              <div className="color-group">
                <div style={{ background: "#054834" }} className="colors"></div>
                <div style={{ fontSize: "12px" }}>Green</div>
              </div>
              <Radio
                onChange={() => {
                  changeSideBar("0", "#054834");
                }}
                checked={sideBar === "0" ? true : false}
              />
            </div>
            <div className="radio">
              <div className="color-group">
                <div style={{ background: "#181017" }} className="colors"></div>
                <div style={{ fontSize: "12px" }}>Dark</div>
              </div>
              <Radio
                onChange={() => {
                  changeSideBar("1", "#181017");
                }}
                checked={sideBar === "1" ? true : false}
              />
            </div>
            <div className="radio">
              <div className="color-group">
                <div style={{ background: "#2e3f49" }} className="colors"></div>
                <div style={{ fontSize: "12px" }}>Party</div>
              </div>
              <Radio
                onChange={() => {
                  changeSideBar("2", "#2e3f49");
                }}
                checked={sideBar === "2" ? true : false}
              />
            </div>
            <div style={{ marginBottom: "20px" }} className="radio">
              <div className="color-group">
                <div style={{ background: "#132124" }} className="colors"></div>
                <div>mood</div>
              </div>
              <Radio
                onChange={() => {
                  changeSideBar("3", "#132124");
                }}
                checked={sideBar === "3" ? true : false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appearances;
