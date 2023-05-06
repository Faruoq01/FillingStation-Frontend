import React, {useEffect, useCallback, useState} from 'react';
import '../../styles/payments.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import { getAllStations , adminOutlet} from '../../store/actions/outlet';
import ExpenseService from '../../services/expense';
import { allExpenses, searchExpenses } from '../../store/actions/expense';
import { ThreeDots } from 'react-loader-spinner';

const mobile = window.matchMedia('(max-width: 1150px)');

const OverageList = () => {

    const dispatch = useDispatch();
    const { dipping } = useSelector(state => state.dailySalesReducer.bulkReports);
    const user = useSelector(state => state.authReducer.user);
    const [defaultState, setDefault] = useState(0);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(15);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    console.log(dipping)

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

    const getAllProductData = useCallback(() => {

        if(oneStationData !== null){
            if((getPerm('0') || getPerm('1') || user.userType === "superAdmin")){
                const findID = allOutlets.findIndex(data => data._id === oneStationData._id);
                setDefault(findID + 1);

                const payload = {
                    skip: skip * limit,
                    limit: limit,
                    outletID: oneStationData._id, 
                    organisationID: resolveUserID().id
                }
    
                ExpenseService.getAllExpenses(payload).then((data) => {
                    setLoading(false);
                    setTotal(data.expense.count);
                    dispatch(allExpenses(data.expense.expense));
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
            const payload = {
                skip: skip * limit,
                limit: limit,
                outletID: data, 
                organisationID: resolveUserID().id
            }

            ExpenseService.getAllExpenses(payload).then((data) => {
                setLoading(false);
                setTotal(data.expense.count);
                dispatch(allExpenses(data.expense.expense));
            });
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllProductData();
    },[getAllProductData])

    const refresh = () => {
        setLoading(true);
        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: oneStationData === null? "None": oneStationData?._id,
            organisationID: resolveUserID().id
        }

        ExpenseService.getAllExpenses(payload).then((data) => {
            setTotal(data.expense.count);
            dispatch(allExpenses(data.expense.expense));
        }).then(()=>{
            setLoading(false);
        });
    }

    const changeMenu = (index, item ) => {
        setLoading(true);
        setDefault(index);
        dispatch(adminOutlet(item));

        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: item === null? "None": item?._id,
            organisationID: resolveUserID().id
        }

        ExpenseService.getAllExpenses(payload).then((data) => {
            setTotal(data.expense.count);
            dispatch(allExpenses(data.expense.expense));
        }).then(()=>{
            setLoading(false);
        });
    }

    const searchTable = (value) => {
        dispatch(searchExpenses(value));
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
        const total = Number(data.dipping) - Number(data.currentLevel);
        if(total === 0){
            return "None";

        }else if(total < 0){
            return "Shortage";

        }else{
            return "Overage"
        }
    }

    return(
        <div data-aos="zoom-in-down" style={{marginTop: mobile.matches? "10px": "auto"}} className='paymentsCaontainer'>
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
                                    onChange={(e) => {searchTable(e.target.value)}}
                                />
                        </div>
                    </div>
                    <div style={{width:'120px'}} className='butt'>
                        
                    </div>
                </div>

                <div></div>

                <div className='table-container'>
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
                            dipping.length === 0?
                            <div style={place}>No product data</div>:
                            dipping.map((data, index) => {
                                return(
                                    <div className='table-head2'>
                                        <div className='column'>{index + 1}</div>
                                        <div className='column'>{data.createdAt}</div>
                                        <div className='column'>{data.currentLevel}</div>
                                        <div className='column'>{data.dipping}</div>
                                        <div className='column'>{Number(data.dipping) - Number(data.currentLevel)}</div>
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