import pc from "../../assets/landing/pc.png";
import tick from "../../assets/landing/tick.png";

const Features = () => {
  return (
    <div className="features">
      <div className="inns">
        <div className="left">
          <span className="hdd">Monitoring System...</span>
          <div className="entry">
            <div className="top">
              <img
                style={{ width: "25px", height: "25px", marginRight: "10px" }}
                src={tick}
                alt="icon"
              />
              <span className="nxt">Daily Update</span>
            </div>

            <span className="bdd">
              Stay ahead of the competition with accurate sales, purchases, and
              fuel tank level information. Our monitoring system continuously
              captures and updates data, ensuring that you have up-to-the-minute
              insights into your fueling outlet's performance. By having access
              to daily data, you can make timely and informed decisions, respond
              quickly to changes in market demand, and address any potential
              lapses or issues promptly. Whether you are on-site or remotely
              managing your operations, this feature keeps you updated and in
              control.
            </span>
          </div>

          <div className="entry">
            <div className="top">
              <img
                style={{ width: "25px", height: "25px", marginRight: "10px" }}
                src={tick}
                alt="icon"
              />
              <span className="nxt">Accurate Reports</span>
            </div>

            <span className="bdd">
              Gain a deeper understanding of your station’s operations with our
              comprehensive and accurate reporting system. Our platform
              generates detailed reports that provide valuable insights into
              various aspects of your business, such as sales trends, purchase
              patterns, fuel consumption, and inventory management. The accurate
              reports feature enables you to monitor key metrics, track
              progress, and make informed business decisions.
            </span>
          </div>

          <div className="entry">
            <div className="top">
              <img
                style={{ width: "25px", height: "25px", marginRight: "10px" }}
                src={tick}
                alt="icon"
              />
              <span className="nxt">Important Alerts and Notifications</span>
            </div>

            <span className="bdd">
              Stay on top of your station’s operations with our important alerts
              and notifications feature. Our system is designed to immediately
              notify you about critical information and potential issues that
              require your attention. You can set up customized alerts and
              notifications to receive alerts on inventory levels, equipment
              status, maintenance schedules, compliance requirements, and any
              anomalies that may impact your operations. By receiving timely
              notifications, you can take immediate action, prevent disruptions,
              and ensure smooth operations. This feature keeps you informed,
              allowing you to proactively address issues, maintain a high level
              of efficiency, and provide uninterrupted service to your
              customers.
            </span>
          </div>
        </div>
        <div className="right">
          <img
            style={{ width: "350px", height: "300px" }}
            src={pc}
            alt="icon"
          />
        </div>
      </div>
    </div>
  );
};

export default Features;
