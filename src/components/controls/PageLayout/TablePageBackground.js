const TablePageBackground = ({ children, bg }) => {
  return (
    <div
      style={{ background: bg }}
      data-aos="zoom-in-down"
      className="paymentsCaontainer">
      <div className="inner-pay">{children}</div>
    </div>
  );
};

export default TablePageBackground;
