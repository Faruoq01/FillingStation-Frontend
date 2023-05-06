import { Button } from "@mui/material";
import "../../styles/overage.scss";
import slideMenu from '../../assets/slideMenu.png';
import tank from '../../assets/comp/tank.png';

const OveragesAndShortages = () => {
    return(
        <div className="overages">
            <div className='alisss'>
                <div style={{marginTop:'0px'}} className="tank-text">Overage/Shortage</div>
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
                    // onClick={()=>{history.push("/home/analysis/payments")}}
                >
                    View in details
                </Button>
            </div>

            <div className="overageContainer">
                <div className="innerOverage">
                    <div className="overlapOne"></div>
                    <div className="overlapTwo">
                        <div className="current-level">
                            <div className="dippingBarLeft"></div>
                        </div>
                        <div className="dipping">
                            <div className="dippingBar"></div>
                        </div>
                    </div>
                    <div className="overlapThree">
                        <img style={{width:'32px', height:'25px'}} src={tank} alt="icon" />
                    </div>
                </div>

                <div className="labelsOverage">
                    <div>
                        <div style={title}>10000 Ltrs</div>
                        <div style={label}>Current Level </div>
                    </div>

                    <div>
                        <div style={title}>10000 Ltrs</div>
                        <div style={label}>Dipping Level </div>
                    </div>
                </div>

                <div className="statusOverage">
                    <div>
                        <div style={title}>-300 Ltrs</div>
                        <div style={label}>Differences</div>
                    </div>
                    <div style={shortage}>
                        Shortage
                    </div>
                </div>
            </div>
        </div>
    )
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