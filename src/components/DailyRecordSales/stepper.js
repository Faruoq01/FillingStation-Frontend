import React, { useEffect, useState } from 'react'
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
stepConnectorClasses,
} from "@mui/material/StepConnector";
import SanitizerIcon from "@mui/icons-material/Sanitizer";
import PropaneTankIcon from "@mui/icons-material/PropaneTank";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import PaidIcon from "@mui/icons-material/Paid";
import AddCardIcon from "@mui/icons-material/AddCard";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { IconButton, Stack } from '@mui/material';
import { useLocation } from 'react-router-dom';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
      top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)",
      },
    },
    [`&.${stepConnectorClasses.completed}`]: {
      [`& .${stepConnectorClasses.line}`]: {
        backgroundImage:
          "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)",
      },
    },
    [`& .${stepConnectorClasses.line}`]: {
      height: 3,
      border: 0,
      backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
      borderRadius: 1,
    },
  }));
  
const ColorlibStepIconRoot = styled("div")(({ theme, ownerState }) => ({
    backgroundColor:
        theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
    zIndex: 1,
    color: "#fff",
    width: 40,
    height: 40,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    fontSize: "11px",
    alignItems: "center",
    ...(ownerState.active && {
        backgroundImage:
        "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)",
        boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    }),
    ...(ownerState.completed && {
        backgroundImage:
        "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)",
    }),
}));
  
function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
        1: <SanitizerIcon />,
        2: <AssignmentReturnedIcon />,
        3: <CreditScoreIcon />,
        4: <PaidIcon />,
        5: <AddCardIcon />,
        6: <PropaneTankIcon />,
    };

    return (
        <ColorlibStepIconRoot
        ownerState={{ completed, active }}
        className={className}>
        {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}
  
  ColorlibStepIcon.propTypes = {
    /**
     * Whether this step is active.
     * @default false
     */
    active: PropTypes.bool,
    className: PropTypes.string,
    /**
     * Mark the step as completed. Is passed to child components.
     * @default false
     */
    completed: PropTypes.bool,
    /**
     * The label displayed in the step icon.
     */
    icon: PropTypes.node,
  };
  
  const steps = [
    "Pump Update",
    "Return to Tank",
    "LPO",
    "Expenses",
    "Payments",
    "Dipping",
  ];

const routeMaps = {
    pump: "/home/recordsales/pumpupdate/0",
    rtTank: "/home/recordsales/rttank",
    lpo: "/home/recordsales/lpo",
    expenses: "/home/recordsales/expenses",
    payment: "/home/recordsales/payments",
    dipping: "/home/recordsales/dipping",
}

const StepperComponent = () => {
    const [pages, setPages] = useState(1);
    const {pathname} = useLocation();

    useEffect(()=>{
        switch(pathname){
            case routeMaps.pump: {
                setPages(1)
                break;
            }
            case routeMaps.rtTank: {
                setPages(2)
                break;
            }
            case routeMaps.lpo: {
                setPages(3)
                break;
            }
            case routeMaps.expenses: {
                setPages(4)
                break;
            }
            case routeMaps.payment: {
                setPages(5)
                break;
            }
            case routeMaps.dipping: {
                setPages(6)
                break;
            }
            default:{
                setPages(1);
            }
        }
    }, [pathname])

    return(
        <React.Fragment>
            <div className="steps">
                <Stack sx={{ width: "100%", marginTop: "20px" }} spacing={4}>
                <Stepper
                    alternativeLabel
                    activeStep={pages - 1}
                    connector={<ColorlibConnector />}>
                    {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel StepIconComponent={ColorlibStepIcon}>
                        {label}
                        </StepLabel>
                    </Step>
                    ))}
                </Stepper>
                </Stack>
            </div>

            <div className="ttx" style={text}>
                {steps[pages - 1]}
            </div>

            <div className="mob">
                <IconButton>
                {/* <ArrowCircleLeftIcon sx={{width:'50px', height:'50px', marginLeft:'2%'}} /> */}
                </IconButton>

                <div className="icons">
                <div
                    className="cont"
                    style={{
                    backgroundImage:
                        pages >= 1
                        ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                        : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
                    }}>
                    <SanitizerIcon sx={{ color: "#fff" }} />
                </div>

                <div
                    className="cont"
                    style={{
                    backgroundImage:
                        pages >= 2
                        ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                        : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
                    }}>
                    <AssignmentReturnedIcon sx={{ color: "#fff" }} />
                </div>

                <div
                    className="cont"
                    style={{
                    backgroundImage:
                        pages >= 3
                        ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                        : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
                    }}>
                    <CreditScoreIcon sx={{ color: "#fff" }} />
                </div>

                <div
                    className="cont"
                    style={{
                    backgroundImage:
                        pages >= 4
                        ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                        : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
                    }}>
                    <PaidIcon sx={{ color: "#fff" }} />
                </div>

                <div
                    className="cont"
                    style={{
                    backgroundImage:
                        pages >= 5
                        ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                        : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
                    }}>
                    <AddCardIcon sx={{ color: "#fff" }} />
                </div>

                <div
                    className="cont"
                    style={{
                    backgroundImage:
                        pages === 6
                        ? "linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)"
                        : "linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)",
                    }}>
                    <PropaneTankIcon sx={{ color: "#fff" }} />
                </div>
                </div>

                <IconButton>
                {/* <ArrowCircleRightIcon sx={{width:'50px', height:'50px', marginRight:'2%'}} /> */}
                </IconButton>
            </div>
        </React.Fragment>
    )
}

const text = {
    width: "96%",
    textAlign: "left",
    fontSize: "12px",
    marginTop: "30px",
    marginLeft: "4%",
    fontWeight: "bold",
};

export default StepperComponent