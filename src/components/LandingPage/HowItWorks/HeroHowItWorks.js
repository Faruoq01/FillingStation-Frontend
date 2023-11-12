import React from "react";
import "../../../styles/landing/works.scss";

const HeroHowItWorks = () => {
  return (
    <React.Fragment>
      <div className="works-container">
        <div className="header">How it Works</div>
        <div className="content-header">
          To get started with 360-Station, your journey begins with a
          straightforward registration process, laying the foundation for
          precise business management. During registration, you will provide all
          the necessary details to create your filling stations accurately.
          Afterward, you can seamlessly incorporate tanks into your system,
          which serve as the central hub for precise inventory control, ensuring
          you always maintain control over fuel levels. Additionally, our
          platform smoothly integrates pumps, allowing you to monitor daily
          sales activities, providing you with up-to-date updates on your
          filling stations' performance. Furthermore, 360-Station emphasizes the
          importance of recording daily transactions, enabling you to maintain a
          detailed record of product sales (AFO, PMS, DPK), pricing information,
          and operational expenses.
        </div>
      </div>
    </React.Fragment>
  );
};

export default HeroHowItWorks;
