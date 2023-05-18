import { Button, MenuItem, Select } from "@mui/material";
import "../../styles/overage.scss";
import slideMenu from '../../assets/slideMenu.png';
import tank from '../../assets/comp/tank.png';
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { overageType } from "../../store/actions/dailySales";
import ApproximateDecimal from "../common/approx";

const OveragesAndShortages = (props) => {

    const history = useHistory();
    const dispatch = useDispatch();
    const [defaultState, setDefault] = useState(10);
    const dipping = useSelector(state => state.dailySalesReducer.overages);
    const supplies = useSelector(state => state.dailySalesReducer.supplies);
    const overageTypeData = useSelector(state => state.dailySalesReducer.overageType);
    
    const getSupply = () => {
        const getSelectedType = supplies.filter(data => data.productType === overageTypeData);
        const firstPriority = getSelectedType.filter(data => data.priority === "0");
        const secondPriority = getSelectedType.filter(data => data.priority === "1");

        const firstTotals = firstPriority.reduce((accum, current) => {
            return Number(accum) + Number(current.quantity);
        }, 0);

        const secondTotals = secondPriority.reduce((accum, current) => {
            return Number(accum) + Number(current.quantity);
        }, 0);

        return {first: firstTotals, second: secondTotals};
    }
    
    const getDippingResult = () => {
        const productCategory = dipping.filter(data => data.productType === overageTypeData);

        const currentLevel = productCategory.reduce((accum, current) => {
            return Number(accum) + Number(current.afterSales);
        }, 0);

        const dippingLevel = productCategory.reduce((accum, current) => {
            return Number(accum) + Number(current.dipping);
        }, 0);

        const capacity = productCategory.reduce((accum, current) => {
            return Number(accum) + Number(current.tankCapacity);
        }, 0);

        const currentCent = currentLevel/capacity * 100;
        const dippingCent = dippingLevel/capacity * 100;

        const detail = {
            currentCent: isNaN(currentCent)? 0: currentCent,
            dippingCent: isNaN(dippingCent)? 0: dippingCent,
            currentLevel: currentLevel,
            dipping: dippingLevel
        }

        return detail;
    }

    const selectedType = (data) => {
        setDefault(data);
        if(data === 10){
            dispatch(overageType("PMS"));

        }else if (data === 20){
            dispatch(overageType("AGO"));

        }else{
            dispatch(overageType("DPK"));
        }
    }

    const loadOverageList = () => {
        history.push("/home/overage");
    }

    const Selectors = () => {
        return(
            <div style={selc}>
                <Select
                    labelId="demo-select-small"
                    id="demo-select-small"
                    value={defaultState}
                    style={selectMe}
                >
                    <MenuItem onClick={() => {selectedType(10)}} style={menu} value={10}>PMS</MenuItem>
                    <MenuItem onClick={() => {selectedType(20)}} style={menu} value={20}>AGO</MenuItem>
                    <MenuItem onClick={() => {selectedType(30)}} style={menu} value={30}>DPK</MenuItem>
                </Select>
                <Button 
                    variant="contained" 
                    startIcon={<img style={{width:'15px', height:'10px', marginRight:'15px'}} src={slideMenu} alt="icon" />}
                    sx={{
                        width:'150px',
                        height:'30px',
                        background:'#06805B',
                        fontSize:'11px',
                        borderRadius:'0px',
                        fontFamily:'Poppins',
                        textTransform:'capitalize',
                        '&:hover': {
                            backgroundColor: '#06805B'
                        }
                    }}
                    onClick={loadOverageList}
                >
                    View in details
                </Button>
            </div>
        )
    }

    const status = () => {
        const total = getDippingResult().dipping - getDippingResult().currentLevel;
        if(total < 0){
            return "Shortage"

        }else if(total === 0){
            return "None"

        }else{
            return "Overage"
        }
    }

    return(
        <div className="overages">
            <div className='alisss'>
                <div style={{marginTop:'0px'}} className="tank-text">Overage/Shortage</div>
                <Selectors />
            </div>

            <div className="overageContainer">
                <div className="innerOverage">
                    <div className="overlapOne"></div>
                    <div className="overlapTwo">
                        <div className="current-level">
                            <div style={{width: getDippingResult().currentCent + "%"}} className="dippingBarLeft"></div>
                        </div>
                        <div className="dipping">
                            <div style={{width: getDippingResult().dippingCent + "%"}} className="dippingBar"></div>
                        </div>
                    </div>
                    <div className="overlapThree">
                        <img style={{width:'32px', height:'25px'}} src={tank} alt="icon" />
                    </div>
                </div>

                <div className="labelsOverage">
                    <div>
                        <div style={title}>{ApproximateDecimal(getDippingResult().currentLevel + getSupply().second)} Ltrs</div>
                        <div style={label}>Current Level </div>
                    </div>

                    <div>
                        <div style={title}>{ApproximateDecimal(getDippingResult().dipping)} Ltrs</div>
                        <div style={label}>Dipping Level </div>
                    </div>
                </div>

                <div className="statusOverage">
                    <div>
                        <div style={title}>{ApproximateDecimal(getDippingResult().dipping - (getDippingResult().currentLevel + getSupply().second))} Ltrs</div>
                        <div style={label}>Differences</div>
                    </div>
                    <div style={shortage}>
                        {status()}
                    </div>
                </div>
            </div>
        </div>
    )
}

const menu = {
    fontSize: '12px'
}

const selectMe = {
    height: "30px",
    marginRight:'10px',
    borderRadius:'0px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'12px',
    outline:'none',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const selc = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
}

const title = {
    fontSize:'15px',
    fontWeight:'bold',
    fontFamily:'Poppins',
    color: '#000'
}

const label = {
    fontSize:'11px',
    fontWeight:'500',
    fontFamily:'Poppins',
    color:'#515151'
}

const shortage = {
    width: '90px',
    height: "32px",
    background: "#e4d8d4",
    display:'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '10px',
    marginTop: '10px',
    fontSize: '14px',
    color: '#e03534',
    fontWeight:'bold'
}

export default OveragesAndShortages;