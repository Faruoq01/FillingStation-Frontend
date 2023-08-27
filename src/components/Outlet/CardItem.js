import tan from "../../assets/tan.png";
import eye from "../../assets/eye.png";
import filling from "../../assets/filling.png";
const mobile = window.matchMedia("(max-width: 600px)");

const CardItem = (props) => {
  return (
    <div
      style={{ width: mobile.matches ? "100%" : "auto" }}
      key={props.index}
      className="cardRapper">
      <div
        style={{ width: mobile.matches ? "94%" : "auto" }}
        className="cardItem">
        <div className="inner">
          <div className="row">
            <div className="rowdata">License Code</div>
            <div className="detail">{props.data.licenseCode}</div>
          </div>
          <div style={{ marginTop: "10px" }} className="row">
            <div className="rowdata">Name</div>
            <div className="detail">{props.data.outletName}</div>
          </div>
          <div style={{ marginTop: "10px" }} className="row">
            <div className="rowdata">Outlet Code</div>
            <div className="detail">{props.data._id}</div>
          </div>
          <div style={{ marginTop: "10px" }} className="row">
            <div className="rowdata">No Of Tanks</div>
            <div className="detail">{props.data.noOfTanks}</div>
          </div>
          <div style={{ marginTop: "10px" }} className="row">
            <div className="rowdata">No Of Pumps</div>
            <div className="detail">{props.data.noOfPumps}</div>
          </div>
          <div style={{ marginTop: "10px" }} className="row">
            <div className="rowdata">Town/City</div>
            <div className="detail">{props.data.city}</div>
          </div>
          <div style={{ marginTop: "10px" }} className="row">
            <div className="rowdata">Actions</div>
            <div className="detail">
              <img
                style={{ width: "27px", height: "27px", marginRight: "10px" }}
                src={eye}
                alt="icon"
              />
              <img
                style={{ width: "27px", height: "27px", marginRight: "10px" }}
                src={filling}
                alt="icon"
              />
              <img
                style={{ width: "27px", height: "27px", marginRight: "10px" }}
                src={tan}
                alt="icon"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardItem;
