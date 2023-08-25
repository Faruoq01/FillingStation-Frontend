import ApproximateDecimal from "../common/approx";

const SingleInputField = ({ value, setValue }) => {
  const handleInput = (e) => {
    const removeFormat = e.target.value.replace(/^0|[^.\w\s]/gi, "");
    setValue(removeFormat);
  };

  return (
    <div style={{ marginTop: "20px" }} className="single-form">
      <div className="input-d">
        <span style={{ color: "green" }}>Quantity (Litres)</span>
        <input
          value={ApproximateDecimal(value)}
          onChange={handleInput}
          className="lpo-inputs"
          type={"text"}
        />
      </div>
    </div>
  );
};

export default SingleInputField;
