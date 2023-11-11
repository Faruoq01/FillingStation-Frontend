import React, { useState } from "react";
import Footer from "./Footer";
import Navbar from "./NavBar";
import "../../styles/landing.scss";
import { Home, HowItWorks } from "./pages";

const Homepage = () => {
  const [page, setPage] = useState(0);

  return (
    <React.Fragment>
      <div style={background}>
        <Navbar page={page} setPage={setPage} />
        {page === 0 && <Home />}
        {page === 1 && <HowItWorks />}
        <Footer />
      </div>
    </React.Fragment>
  );
};

const background = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
};

export default Homepage;
