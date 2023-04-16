import { Avatar, Button } from "@mui/material";
import "../../styles/confirmation_msg.scss";

const RemarkCard = () => {
    return(
        <div className="remark_card">
            <div className="name_avatar">
                <Avatar sx={{width:'35px', height:'35px', fontSize:'14px'}} alt="Remy Sharp">AF</Avatar>
                <div className="rmk_content">
                    <div className="user_rmk">Faruk</div>
                    <div className="content_rmk">
                        I write this to confirm how this is going to look
                        like when i write it as a message at least for the
                        first time.
                    </div>
                    <div className="rmk_date">20th April, 2023.</div>
                </div>
            </div>
        </div>
    )
}

const ReportConfirmation = () => {
    return(
        <div style={{width:'100%'}}>
            <div className="initial_balance_container">
                <div className="report_confirmation">
                    <div className="left_confirmation">
                        <div className="confirmation_header">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            Reports confirmed by: &nbsp;&nbsp;&nbsp; Aminu Faruk Umar
                        </div>
                        <div className="confirmation_area">
                            <textarea className="remark" placeholder="Remark" />
                        </div>
                        <div className="conf_button">
                            <Button 
                                variant="contained" 
                                sx={{
                                    width:'80px',
                                    height:'30px',
                                    background:'tomato',
                                    fontSize:'12px',
                                    marginLeft:'10px',
                                    borderRadius:"0px",
                                    textTransform:'capitalize',
                                    '&:hover': {
                                        backgroundColor: 'tomato'
                                    }
                                }}
                                // onClick={()=>{openDailySales("report")}}
                            >
                                Post
                            </Button>
                        </div>
                    </div>
                    <div className="right_confirmation">
                        <div className="rmk">Remark History</div>

                        <RemarkCard />
                        <RemarkCard />
                        <RemarkCard />
                        <RemarkCard />
                        <RemarkCard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReportConfirmation;