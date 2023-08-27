import { ThreeDots } from "react-loader-spinner";

const ThreeDotsLoader = () => {
  return (
    <div style={load}>
      <ThreeDots
        height="60"
        width="50"
        radius="9"
        color="#076146"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
};

const load = {
  width: "100%",
  height: "30px",
  display: "flex",
  justifyContent: "center",
};

export default ThreeDotsLoader;
