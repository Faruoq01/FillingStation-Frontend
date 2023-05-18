import React, {useEffect, useCallback, useState} from 'react';
import '../../styles/payments.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import { getAllStations , adminOutlet} from '../../store/actions/outlet';
import { ThreeDots } from 'react-loader-spinner';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DashboardService from '../../services/dashboard';
import { overageType, overages } from '../../store/actions/dailySales';
import { dateRange } from '../../store/actions/dashboard';

const OverageList = () => {

    const dispatch = useDispatch();
    const moment = require('moment-timezone');
    const dipping = useSelector(state => state.dailySalesReducer.overages);
    const updatedDate = useSelector(state => state.dashboardReducer.dateRange);
    const user = useSelector(state => state.authReducer.user);
    const [defaultState, setDefault] = useState(0);
    const [defaultState2, setDefault2] = useState(10);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [skip, setSkip] = useState(0);
    const [limit] = useState(15);
    const [total] = useState(0);
    const [loading, setLoading] = useState(false);
    const overageTypeData = useSelector(state => state.dailySalesReducer.overageType);
    const supplies = useSelector(state => state.dailySalesReducer.supplies);

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
        return user?.permission?.expenses[e];
    }

    const getSupply = (id) => {
        const getSelectedType = supplies.filter(data => data.productType === overageTypeData);
        const getForATank = getSelectedType.filter(data => Object.keys(data.recipientTanks).includes(id));
    
        const secondPriority = getForATank.filter(data => data.priority === "1");

        const secondTotals = secondPriority.reduce((accum, current) => {
            return Number(accum) + Number(current.recipientTanks[id]);
        }, 0);

        return {second: secondTotals};
    }

    const getAllProductData = useCallback(() => {

        if(oneStationData !== null){
            if((getPerm('0') || getPerm('1') || user.userType === "superAdmin")){
                const findID = allOutlets.findIndex(data => data._id === oneStationData._id);
                setDefault(findID + 1);
                
                const startDate = moment(updatedDate[0]).format('YYYY-MM-DD HH:mm:ss').split(" ")[0];
                const endDate = moment(updatedDate[1]).format('YYYY-MM-DD HH:mm:ss').split(" ")[0];

                const payload = {
                    skip: skip * limit,
                    limit: limit,
                    outletID: oneStationData === null? "None": oneStationData._id, 
                    organisation: resolveUserID().id,
                    startRange: startDate,
                    endRange: endDate
                }

                DashboardService.dipping(payload).then(data => {
                    dispatch(overages(data.dipping));
                }).then(()=>{
                    setLoading(false);
                });

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
                if(!getPerm('1')) setDefault(1);
                dispatch(adminOutlet(null));
                return "None";
            }else{

                OutletService.getOneOutletStation({outletID: user.outletID}).then(data => {
                    dispatch(adminOutlet(data.station));
                });
                
                return user.outletID;
            }
        }).then((data)=>{
            const startDate = moment(updatedDate[0]).format('YYYY-MM-DD HH:mm:ss').split(" ")[0];
            const endDate = moment(updatedDate[1]).format('YYYY-MM-DD HH:mm:ss').split(" ")[0];

            const payload = {
                skip: skip * limit,
                limit: limit,
                outletID: data, 
                organisation: resolveUserID().id,
                startRange: startDate,
                endRange: endDate
            }

            DashboardService.dipping(payload).then(data => {
                dispatch(overages(data.dipping));
            }).then(()=>{
                setLoading(false);
            });
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllProductData();
    },[getAllProductData])

    const refresh = () => {
        setLoading(true);
        const startDate = moment(updatedDate[0]).format('YYYY-MM-DD HH:mm:ss').split(" ")[0];
        const endDate = moment(updatedDate[1]).format('YYYY-MM-DD HH:mm:ss').split(" ")[0];

        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: oneStationData === null? "None": oneStationData._id, 
            organisation: resolveUserID().id,
            startRange: startDate,
            endRange: endDate
        }

        DashboardService.dipping(payload).then(data => {
            dispatch(overages(data.dipping));
        }).then(()=>{
            setLoading(false);
        });
    }

    const changeMenu = (index, item ) => {
        setLoading(true);
        setDefault(index);
        dispatch(adminOutlet(item));

        const startDate = moment(updatedDate[0]).format('YYYY-MM-DD HH:mm:ss').split(" ")[0];
        const endDate = moment(updatedDate[1]).format('YYYY-MM-DD HH:mm:ss').split(" ")[0];

        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: item === null? "None": item._id, 
            organisation: resolveUserID().id,
            startRange: startDate,
            endRange: endDate
        }

        DashboardService.dipping(payload).then(data => {
            dispatch(overages(data.dipping));
        }).then(()=>{
            setLoading(false);
        });
    }

    const nextPage = () => {
        if(!(skip < 0)){
            setSkip(prev => prev + 1)
        }
        refresh();
    }

    const prevPage = () => {
        if(!(skip <= 0)){
            setSkip(prev => prev - 1)
        } 
        refresh();
    }

    const status = (data) => {
        const total = Number(data.dipping) - (Number(data.afterSales) + getSupply(data.tankID).second);
        if(total === 0){
            return "None";

        }else if(total < 0){
            return "Shortage";

        }else{
            return "Overage"
        }
    }

    const getDateFromRange = (data) => {
        setLoading(true);
        const startDate = moment(data[0]).format('YYYY-MM-DD HH:mm:ss').split(" ")[0];
        const endDate = moment(data[1]).format('YYYY-MM-DD HH:mm:ss').split(" ")[0];
        dispatch(dateRange([new Date(startDate), new Date(endDate)]));

        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: oneStationData === null? "None": oneStationData._id, 
            organisation: resolveUserID().id,
            startRange: startDate,
            endRange: endDate
        }

        DashboardService.dipping(payload).then(data => {
            dispatch(overages(data.dipping));
        }).then(()=>{
            setLoading(false);
        });
    }

    const getDippingResult = () => {
        const productCategory = dipping.filter(data => data.productType === overageTypeData);
        return productCategory;
    }

    const selectedType = (data) => {
        setDefault2(data);
        if(data === 10){
            dispatch(overageType("PMS"));

        }else if (data === 20){
            dispatch(overageType("AGO"));

        }else{
            dispatch(overageType("DPK"));
        }
    }

    return(
        <div data-aos="zoom-in-down"  className='paymentsCaontainer'>
            <div className='inner-pay'>
                <div className='search'>
                    <div className='input-cont'>
                        <div className='second-select'>
                            {getPerm('0') &&
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
                            {getPerm('0') ||
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={0}
                                    sx={selectStyle2}
                                    disabled
                                >
                                    <MenuItem style={menu} value={0}>{!getPerm('0')? oneStationData?.outletName+", "+oneStationData?.alias: "No station created"}</MenuItem>
                                </Select>
                            }
                        </div>
                    </div>
                    <div style={{width: 'auto'}} className='butt'>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={defaultState2}
                            style={selectMe}
                        >
                            <MenuItem onClick={() => {selectedType(10)}} style={menu} value={10}>PMS</MenuItem>
                            <MenuItem onClick={() => {selectedType(20)}} style={menu} value={20}>AGO</MenuItem>
                            <MenuItem onClick={() => {selectedType(30)}} style={menu} value={30}>DPK</MenuItem>
                        </Select>
                        <DateRangePicker onChange={getDateFromRange} value={updatedDate} />
                    </div>
                </div>

                <div></div>

                <div style={{marginTop:'10px'}} className='table-container'>
                    <div className='table-head'>
                        <div className='column'>S/N</div>
                        <div className='column'>Date Created</div>
                        <div className='column'>Current stock</div>
                        <div className='column'>Dipping Level</div>
                        <div className='column'>Difference</div>
                        <div className='column'>Status</div>
                    </div>

                    <div className='row-container'>
                        {
                            !loading?
                            getDippingResult().length === 0?
                            <div style={place}>No Shortage/Overage</div>:
                            getDippingResult().map((data, index) => {
                                return(
                                    <div className='table-head2'>
                                        <div className='column'>{index + 1}</div>
                                        <div className='column'>{data.createdAt}</div>
                                        <div className='column'>{Number(data.afterSales) + getSupply(data.tankID).second}</div>
                                        <div className='column'>{data.dipping}</div>
                                        <div className='column'>{Number(data.dipping) - (Number(data.afterSales) + getSupply(data.tankID).second)}</div>
                                        <div className='column'>
                                            <span style={status(data) === "Shortage"? short2: short}>{status(data)}</span>
                                        </div>
                                    </div> 
                                )
                            }):<div style={load}>
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
                        }
                    </div>
                </div>

                <div className='footer'>
                    <div style={{fontSize:'14px'}}>
                        Showing {((skip + 1) * limit) - (limit-1)} to {(skip + 1) * limit} of {total} entries
                    </div>
                    <div className='nav'>
                        <button onClick={prevPage} className='but'>Previous</button>
                        <div className='num'>{skip + 1}</div>
                        <button onClick={nextPage} className='but2'>Next</button>
                    </div>
                </div>
            </div>
        </div>
    )
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

const short = {
    width: '80px',
    height: '28px',
    background: 'rgba(13, 108, 234, 0.12)',
    color:'#0D6CEA',
    fontSize:'12px',
    borderRadius:'10px',
    display: 'flex',
    justifyContent:'center',
    alignItems:'center'
}

const short2 = {
    width: '80px',
    height: '28px',
    background: 'rgba(223, 5, 5, 0.12)',
    color:'#DF0505',
    fontSize:'12px',
    borderRadius:'10px',
    display: 'flex',
    justifyContent:'center',
    alignItems:'center'
}

const selectStyle2 = {
    width:'100%', 
    height:'35px', 
    borderRadius:'0px',
    background: '#F2F1F1B2',
    color:'grey',
    fontSize:'12px',
    outline:'none',
    fontFamily:'Poppins',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const place = {
    width:'100%',
    textAlign:'center',
    fontSize:'12px',
    marginTop:'20px',
    color:'green'
}

const menu = {
    fontSize:'12px',
    fontFamily:'Poppins',
}

const load = {
    width: '100%',
    height:'30px',
    display:'flex',
    justifyContent:'center',
}

export default OverageList;