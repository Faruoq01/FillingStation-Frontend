import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import active from "../../assets/active.png";
import darkMode from "../../assets/darkMode.png";
import { useEffect } from "react";
import { useState } from "react";

const SideItems = ({ marginT, link, name, icon, icon2, close }) => {
  const user = useSelector((state) => state.auth.user);
  const { pathname } = useLocation();
  const [activeRoute, setActiveRoute] = useState("");

  useEffect(() => {
    setActiveRoute(pathname);
  }, [pathname]);

  return (
    <Link className="link" to={link}>
      <div
        onClick={() => {
          close();
        }}
        style={{ marginTop: marginT }}
        className="item-container">
        {activeRoute.split("/")[2] === link.split("/")[2] ? (
          <div className="side-item">
            <div className="side-focus">
              <div className="side-focus-image">
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={user.isDark === "0" ? active : darkMode}
                  alt="icon"
                />
              </div>
              <div data-aos="zoom-out-right" className="side-focus-text">
                <img
                  style={{
                    width: "18px",
                    height: "18px",
                    marginRight: "10px",
                  }}
                  src={user.isDark === "0" ? icon : icon2}
                  alt="icon"
                />
                <div
                  style={{ color: user.isDark === "0" ? "#054834" : "#fff" }}>
                  {name}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="side-item2">
            <img className="normal-image" src={icon2} alt="icon" />
            <div style={{ color: "#fff" }}>{name}</div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default SideItems;
