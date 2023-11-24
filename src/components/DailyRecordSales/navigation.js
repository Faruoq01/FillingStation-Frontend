import { Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

const defaultHandle = () => {};
const routeMaps = {
    pump: "/home/recordsales/pumpupdate/0",
    rtTank: "/home/recordsales/rttank",
    lpo: "/home/recordsales/lpo",
    expenses: "/home/recordsales/expenses",
    payment: "/home/recordsales/payments",
    dipping: "/home/recordsales/dipping",
}

const Navigation = ({next=defaultHandle, finish=defaultHandle}) => {
    const {pathname} = useLocation();
    const navigate = useNavigate()

    const previous = () => {
        navigate(-1)
    };

    const finishAndSubmit = () => {
        finish();
    };

    const nextPage = () => {
        next();
    };

    return(
        <div className="navs">
            <div>
                {pathname !== routeMaps.pump &&
                    <Button
                        variant="contained"
                        sx={{
                            width: "100px",
                            height: "30px",
                            background: "#054834",
                            fontSize: "13px",
                            borderRadius: "5px",
                            textTransform: "capitalize",
                            "&:hover": {
                            backgroundColor: "#054834",
                            },
                        }}
                        onClick={previous}
                        >
                        Previous
                    </Button>
                }
            </div>
            {pathname !== routeMaps.dipping &&
                <Button
                    variant="contained"
                    sx={{
                    width: "140px",
                    height: "30px",
                    background: "#054834",
                    fontSize: "13px",
                    borderRadius: "5px",
                    textTransform: "capitalize",
                    "&:hover": {
                        backgroundColor: "#054834",
                    },
                    }}
                    onClick={nextPage}
                    >
                    Save & Proceed
                </Button>
            }

            {pathname === routeMaps.dipping && (
                <Button
                    variant="contained"
                    sx={{
                    width: "140px",
                    height: "30px",
                    background: "#054834",
                    fontSize: "13px",
                    borderRadius: "5px",
                    textTransform: "capitalize",
                    "&:hover": {
                        backgroundColor: "#054834",
                    },
                    }}
                    onClick={finishAndSubmit}
                    >
                    Finish
                </Button>
            )}
        </div>
    )
}

export default Navigation