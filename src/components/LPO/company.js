import "../../styles/company.scss";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { Button } from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import pump from '../../assets/comp/pump.png';
import hand from '../../assets/comp/hand.png';

const SalesCard = (props) => {
    return(
        <div className="CardContainer">
            <div className="inner_card_container">
                <div className="first_detail">
                    <div className="rolls">
                        <div className="rolls_in">
                            {props.icon}
                        </div>
                    </div>
                    <div className="rolls_text">
                        <div className="money_ifs">NGN 20,000.00</div>
                        <div>Balance</div>
                    </div>
                </div>
                <div>
                    <Button startIcon={<SortIcon />} sx={buts}>View Details</Button>
                </div>
            </div>
        </div>
    )
}

const SalesRightCard = () => {
    return(
        <div style={{marginRight:'0px'}} className="CardContainer2">
            <div className="inner_card_container">
                <div className="first_detail">
                    <div className="rolls">
                        <div className="rolls_in">
                            <img src={hand} style={{width:'25px', height:'25px'}} alt={"icon"} />
                        </div>
                    </div>
                    <div className="rolls_text">
                        <div className="money_ifs">Selling Price</div>
                    </div>
                </div>
                <div className="rolls_detail">
                    <div className="rolls_cell">
                        <div className="val">NGN 178.00</div>
                        <div className="vals"><div style={{...mms, background:'#06805B'}}></div>AGO</div>
                    </div>
                    <div className="rolls_cell">
                        <div className="val">NGN 178.00</div>
                        <div className="vals"><div style={{...mms, background:'#FFA010'}}></div>PMS</div>
                    </div>
                    <div className="rolls_cell">
                        <div className="val">NGN 178.00</div>
                        <div className="vals"><div style={{...mms, background:'#515151'}}></div>DPK</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const StripeOne = () => {
    return(
        <div className="header_row2">
            <div className="row_cell">1</div>
            <div className="row_cell">Dates</div>
            <div className="row_cell">Products</div>
            <div className="row_cell">Litres</div>
            <div className="row_cell">Price</div>
            <div className="row_cell">Driver</div>
            <div className="row_cell">Attendant</div>
            <div className="row_cell">Station</div>
        </div>
    )
}

const StripeTwo = () => {
    return(
        <div style={{marginTop:'5px', background:'#FBFBFB'}} className="header_row2">
            <div className="row_cell">2</div>
            <div className="row_cell">Dates</div>
            <div className="row_cell">Products</div>
            <div className="row_cell">Litres</div>
            <div className="row_cell">Price</div>
            <div className="row_cell">Driver</div>
            <div className="row_cell">Attendant</div>
            <div className="row_cell">Station</div>
        </div>
    )
}

const CompanyLPO = () => {
    return(
        <div className="companyContainer">
            <div className="topCards">
                <SalesCard icon={<AccountBalanceWalletIcon sx={{color:'#fff'}} />} />
                <SalesCard icon={<img src={pump} style={{width:'20px', height:'20px'}} alt={"icon"} />} />
                <SalesRightCard />
            </div>

            <div className="company_lpo">
                <div className="company_left">
                    <div className="company_left_inner">
                        <div className="inner_header">
                            <div className="ttx">Transaction</div>
                            <Button startIcon={<SortIcon />} sx={buts2}>View All</Button>
                        </div>

                        <div className="header_row">
                            <div className="row_cell">S/N</div>
                            <div className="row_cell">Dates</div>
                            <div className="row_cell">Products</div>
                            <div className="row_cell">Litres</div>
                            <div className="row_cell">Price</div>
                            <div className="row_cell">Driver</div>
                            <div className="row_cell">Attendant</div>
                            <div className="row_cell">Station</div>
                        </div>

                        <StripeOne /> 
                        <StripeTwo />
                        <StripeOne /> 
                        <StripeTwo />
                        <StripeOne /> 
                        <StripeTwo />
                        <StripeOne /> 
                    </div>
                </div>

                <div className="company_right">
                    <div className="top_views">
                        <div className="top_view_controls">
                            <div>Recent Activities log</div>
                            <Button sx={{...buts, width:'80px', background:'#EDFFFA'}}>See All</Button>
                        </div>

                        <div className="top_view_content">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const buts = {
    width:'150px',
    height:'30px',
    background: '#E3E3E3',
    textTransform:'capitalize',
    color:'#054834',
    fontWeight: "500",
    fontSize:'12px',
    '&:hover': {
        background: '#E3E3E3',
    }
}

const buts2 = {
    width:'100px',
    height:'30px',
    background: '#EDFFFA',
    textTransform:'capitalize',
    color:'#054834',
    fontWeight: "500",
    fontSize:'12px',
    '&:hover': {
        background: '#EDFFFA',
    }
}


const mms = {
    width: '10px',
    height:'10px',
    borderRadius:'10px',
    background: 'green',
    marginRight:'6px'
}

export default CompanyLPO;