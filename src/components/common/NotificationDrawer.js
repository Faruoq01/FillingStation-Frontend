import { useEffect, useState } from "react";
import HistoryService from "../../services/history";
import { useSelector } from "react-redux";
import CloseIcon from '@mui/icons-material/Close';
import { ThreeDots } from 'react-loader-spinner';
import RemarkCard from "./RemarkCard";
import "../../styles/history.scss";

const NotificationDrawer = (props) => {

    const user = useSelector(state => state.authReducer.user);
    const [historyData, setHistory] = useState([]);
    const [historyLoad, setHistoryLoad] = useState(false);

    const resolveUserID = () => {
        if(user.userType === "superAdmin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const getHistoryRecords = () => {
        setHistoryLoad(true);
        const payload = {
            organisationID: resolveUserID().id,
            limit: Number(user.noteCount)
        }

        HistoryService.allRecords2(payload).then(data => {
            setHistory(data.history.history);
            setHistoryLoad(data.history.history);
        }).then(()=>{
            setHistoryLoad(false);
        });
    }

    useEffect(()=>{
        getHistoryRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return(
        <div className='overlays'>
            <div data-aos="zoom-in-down" className='rightDrawer'>
                <div className='innerDrawer'>
                    <div className='topWrite'>
                        <div className='notewrite'>Notification</div>
                        <div onClick={()=>{props.open(false)}} className='IconDraw'>
                            <CloseIcon/>
                        </div>
                    </div>

                    <div style={remark}>
                        {
                            historyLoad?
                            <ThreeDots 
                                height="60" 
                                width="50" 
                                radius="9"
                                color="#076146" 
                                ariaLabel="three-dots-loading"
                                wrapperStyle={{}}
                                wrapperClassName=""
                                visible={true}
                            />:
                            historyData.length === 0?
                            <div style={place}>No history created</div>:
                            historyData.map((item, index) => {
                                return(                              
                                    <RemarkCard key={index} data={item} />                             
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const place = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'grey',
    marginTop: '30px'
}

const remark = {
    marginTop:'20px',
    height: '92%',
    overflowY: 'scroll',
    overflowX: 'hidden',
}

export default NotificationDrawer;