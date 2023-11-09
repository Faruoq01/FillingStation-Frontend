import tankfill from "../../assets/landing/tankfill.png";

const About = () => {
  return (
    <div className="about">
      <div className="inner">
        <div className="first">
          <img className="image" src={tankfill} alt="icon" />
        </div>
        <div className="second">
          <p className="head">
            Why <span style={{ color: "#399A19" }}>360-Station</span>
          </p>
          <p className="bod">
            360 Station offers a centralized approach to managing and
            controlling all aspects of a station's operations. This means that
            various tasks and processes can be handled within a single system,
            reducing the need for multiple tools or manual processes. The system
            incorporates an Enterprise Resource Planning (ERP) system, which
            typically integrates different areas of a business, such as finance,
            sales, and inventory, into a unified platform.
          </p>
          <p className="more">Read More</p>
        </div>
      </div>
    </div>
  );
};

export default About;
