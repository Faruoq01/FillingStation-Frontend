import { Avatar, MenuItem, OutlinedInput, Select } from "@mui/material";
import "../../styles/history.scss";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OutletService from "../../services/outletService";
import { adminOutlet, getAllStations } from "../../store/actions/outlet";
import swal from "sweetalert";

const months = {
    '01' : 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
}

const RemarkCard = (props) => {

    const convertDate = (data) => {
        const date = data.split('-');
        const format = `${date[2]} ${months[date[1]]} ${date[0]}`;
        return format;
    }

    return(
        <div className="remark_card">
            <div className="name_avatar">
                {
                    props.data.image === "null"?
                    <Avatar sx={{width:'35px', background: 'grey', height:'35px', fontSize:'14px'}} alt="Remy Sharp">{props.data.name.substring(0, 2)}</Avatar>:
                    <Avatar alt="Remy Sharp" src={props.data.image} />
                }
                <div className="rmk_content">
                    <div className="user_rmk">{props.data.name}</div>
                    <div className="content_rmk">{props.data.remark}</div>
                    <div className="rmk_date">{convertDate(props.data.createdAt)}.</div>
                </div>
            </div>
        </div>
    )
}

const data = [
    {
        image: "null",
        name: 'Akinseye Olayemi',
        remark: 'Lorem ipsum dolor sit amet consectetur. Cursus posuere nibh commodo leo pellentesque bibendum. Est pharetra at tellus in. Suspendisse diam consectetur vitae diam erat tincidunt.',
        createdAt: '2023-05-11'
    },

    {
        image: "null",
        name: 'Akinseye Olayemi',
        remark: 'Lorem ipsum dolor sit amet consectetur. Cursus posuere nibh commodo leo pellentesque bibendum. Est pharetra at tellus in. Suspendisse diam consectetur vitae diam erat tincidunt.',
        createdAt: '2023-05-11'
    },

    {
        image: "null",
        name: 'Akinseye Olayemi',
        remark: 'Lorem ipsum dolor sit amet consectetur. Cursus posuere nibh commodo leo pellentesque bibendum. Est pharetra at tellus in. Suspendisse diam consectetur vitae diam erat tincidunt.',
        createdAt: '2023-05-11'
    }
]

const HistoryPage = () => {
    const dispatch = useDispatch();

    const [defaultState, setDefaultState] = useState(0);
    const [loading, setLoading] = useState();
    const user = useSelector(state => state.authReducer.user);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);

    const resolveUserID = () => {
        if(user.userType === "superAdmin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const getPerm = (e) => {
        if(user.userType === "superAdmin"){
            return true;
        }
        return user.permission?.incomingOrder[e];
    }

    const getAllIncomingOrder = useCallback(() => {

        if(oneStationData !== null){
            if((getPerm('0') || getPerm('1') || user.userType === "superAdmin")){
                const findID = allOutlets.findIndex(data => data._id === oneStationData._id);
                setDefaultState(findID + 1);

                // const payload = {
                //     skip: skip * limit,
                //     limit: limit,
                //     outletID: oneStationData._id, 
                //     organisationID: resolveUserID().id
                // }
    
                // IncomingService.getAllIncoming(payload).then((data) => {
                //     setLoading(false);
                //     setTotal(data.incoming.count);
                //     dispatch(createIncomingOrder(data.incoming.incoming));
                // });

                return
            }
        }

        setLoading(true);
        const payload = {
            organisation: resolveUserID().id
        }

        OutletService.getAllOutletStations(payload).then(data => {
            dispatch(getAllStations(data.station));
            if((getPerm('0') || user.userType === "superAdmin") && oneStationData === null){
                if(!getPerm('1')) setDefaultState(1);
                dispatch(adminOutlet(null));
                return "None";
            }else{

                OutletService.getOneOutletStation({outletID: user.outletID}).then(data => {
                    dispatch(adminOutlet(data.station));
                });
                
                return user.outletID;
            }
        }).then((data)=>{
            // const payload = {
            //     skip: skip * limit,
            //     limit: limit,
            //     outletID: data, 
            //     organisationID: resolveUserID().id
            // }

            // IncomingService.getAllIncoming(payload).then((data) => {
            //     setLoading(false);
            //     setTotal(data.incoming.count);
            //     dispatch(createIncomingOrder(data.incoming.incoming));
            // });
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllIncomingOrder();
    },[getAllIncomingOrder]);

    const changeMenu = (index, item ) => {
        // if(!getPerm('1') && item === null) return swal("Warning!", "Permission denied", "info");
        // setLoading(true);
        setDefaultState(index);
        dispatch(adminOutlet(item));

        // const payload = {
        //     skip: skip * limit,
        //     limit: limit,
        //     outletID: item === null? "None": item?._id,
        //     organisationID: resolveUserID().id
        // }
        
        // IncomingService.getAllIncoming(payload).then((data) => {console.log(data, "incoming")
        //     setTotal(data.incoming.count);
        //     dispatch(createIncomingOrder(data.incoming.incoming));
        // }).then(()=>{
        //     setLoading(false);
        // })
    }

    return(
        <div className="historyContainer">
            <div className="inner_history">
                <div className='history_controls'>
                    
                    <div className='outlet_control'>
                        {true &&
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={defaultState}
                                sx={selectStyle2}
                            >
                                <MenuItem onClick={()=>{changeMenu(0, null)}} style={menu} value={0}>All Stations</MenuItem>
                                {
                                    allOutlets.map((item, index) => {
                                        return(
                                            <MenuItem key={index} style={menu} onClick={()=>{changeMenu(index + 1, item)}} value={index + 1}>{item.outletName+ ', ' +item.alias}</MenuItem>
                                        )
                                    })  
                                }
                            </Select>
                        }
                        {true ||
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={0}
                                sx={selectStyle2}
                                disabled
                            >
                                <MenuItem style={menu} value={0}>{true? oneStationData?.outletName+", "+oneStationData?.alias: "No station created"}</MenuItem>
                            </Select>
                        }
                    </div>
                    <div className='second-select'>
                        <OutlinedInput 
                            sx={{
                                width:'100%',
                                height: '35px',  
                                background:'#EEF2F1', 
                                fontSize:'12px',
                                borderRadius:'0px',
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                    border:'1px solid #777777',
                                },
                            }} 
                            type='text'
                            placeholder="Search" 
                            // onChange={(e) => {searchTable(e.target.value)}}
                        />
                    </div>
                </div>
                
                {
                    data.length === 0?
                    <div style={place}>No history created</div>:
                    data.map((item, index) => {
                        return(
                            <RemarkCard key={index} data={item} />
                        )
                    })
                }
            </div>
        </div>
    )
}

const selectStyle2 = {
    width:'100%', 
    height:'35px', 
    borderRadius:'0px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'12px',
    outline:'none',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const place = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    fontWeight: 'bold',
    fontSize: '14px',
    color: 'grey'
}

const menu = {
    fontSize:'12px',
}

export default HistoryPage;