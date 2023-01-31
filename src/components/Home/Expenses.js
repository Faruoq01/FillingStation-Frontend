import React, {useEffect, useCallback, useState} from 'react';
import '../../styles/payments.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import { getAllStations , adminOutlet} from '../../store/actions/outlet';
import ExpenseService from '../../services/expense';
import { allExpenses, searchExpenses } from '../../store/actions/expense';
import config from '../../constants';
import ExpenseReport from '../Reports/ExpenseReport';

const mediaMatch = window.matchMedia('(max-width: 530px)');
const mobile = window.matchMedia('(max-width: 1150px)');

const Expenses = () => {

    const [setOpen] = React.useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.authReducer.user);
    const expense = useSelector(state => state.expenseReducer.expense);
    const [defaultState, setDefault] = useState(0);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [entries, setEntries] = useState(10);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(15);
    const [total, setTotal] = useState(0);
    const [prints, setPrints] = useState(false);

    const resolveUserID = () => {
        if(user.userType === "superAdmin" || user.userType === "admin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const createOrderHandler = () => {
        setOpen(true);
    }

    const getAllProductData = useCallback(() => {

        const payload = {
            organisation: resolveUserID().id
        }

        if(user.userType === "superAdmin" || user.userType === "admin"){
            OutletService.getAllOutletStations(payload).then(data => {
                dispatch(getAllStations(data.station));
            }).then((data)=>{
                const payload = {
                    skip: skip * limit,
                    limit: limit,
                    outletID: "None", 
                    organisationID: resolveUserID().id
                }
    
                ExpenseService.getAllExpenses(payload).then((data) => {
                    setTotal(data.expense.count);
                    dispatch(allExpenses(data.expense.expense));
                });
            });
        }else{
            OutletService.getOneOutletStation({outletID: user.outletID}).then(data => {
                dispatch(adminOutlet(data.station));
                return data.station;
            }).then(data => {
                const payload = {
                    skip: skip * limit,
                    limit: limit,
                    outletID: "None", 
                    organisationID: resolveUserID().id
                }
    
                ExpenseService.getAllExpenses(payload).then((data) => {
                    setTotal(data.expense.count);
                    dispatch(allExpenses(data.expense.expense));
                });
            });
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllProductData();
    },[getAllProductData])

    const refresh = () => {
        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: oneStationData === null? "None": oneStationData?._id,
            organisationID: resolveUserID().id
        }

        ExpenseService.getAllExpenses(payload).then((data) => {
            setTotal(data.expense.count);
            dispatch(allExpenses(data.expense.expense));
        });
    }

    const changeMenu = (index, item ) => {
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
        });
    }

    const searchTable = (value) => {
        dispatch(searchExpenses(value));
    }

    const printReport = () => {
        setPrints(true);
    }

    const entriesMenu = (value, limit) => {
        setEntries(value);
        setLimit(limit);
        refresh();
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

    return(
        <div data-aos="zoom-in-down" style={{marginTop: mobile.matches? "10px": "auto"}} className='paymentsCaontainer'>
            { prints && <ExpenseReport allOutlets={expense} open={prints} close={setPrints}/>}
            <div className='inner-pay'>
                <div className='action'>
                    <div style={{width:'150px'}} className='butt2'>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={10}
                            sx={{...selectStyle2, backgroundColor:"#06805B", color:'#fff'}}
                        >
                            <MenuItem value={10}>Actions</MenuItem>
                            <MenuItem onClick={createOrderHandler} value={20}>Create Order</MenuItem>
                            <MenuItem value={30}>Download PDF</MenuItem>
                            <MenuItem value={40}>Print</MenuItem>
                        </Select>
                    </div>
                </div>

                <div className='search'>
                    <div className='input-cont'>
                        <div className='second-select'>
                            {(user.userType === "superAdmin" || user.userType === "admin") &&
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={defaultState}
                                    sx={selectStyle2}
                                >
                                    <MenuItem onClick={()=>{changeMenu(0, null)}} style={menu} value={0}>Select Station</MenuItem>
                                    {
                                        allOutlets.map((item, index) => {
                                            return(
                                                <MenuItem key={index} style={menu} onClick={()=>{changeMenu(index + 1, item)}} value={index + 1}>{item.outletName+ ', ' +item.alias}</MenuItem>
                                            )
                                        })  
                                    }
                                </Select>
                            }
                            {user.userType === "staff" &&
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={0}
                                    sx={selectStyle2}
                                    disabled
                                >
                                    <MenuItem style={menu} value={0}>{user.userType === "staff"? oneStationData?.outletName+", "+oneStationData?.alias: "No station created"}</MenuItem>
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

                <div className='search2'>
                    <div className='butt2'>
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={entries}
                            sx={selectStyle2}
                        >
                            <MenuItem style={menu} value={10}>Show entries</MenuItem>
                            <MenuItem onClick={()=>{entriesMenu(20, 15)}} style={menu} value={20}>15 entries</MenuItem>
                            <MenuItem onClick={()=>{entriesMenu(30, 30)}} style={menu} value={30}>30 entries</MenuItem>
                            <MenuItem onClick={()=>{entriesMenu(40, 100)}} style={menu} value={40}>100 entries</MenuItem>
                        </Select>
                    </div>
                    <div style={{width: mediaMatch.matches? '100%': '190px'}} className='input-cont2'>
                        <Button sx={{
                            width: mediaMatch.matches? '100%': '100px', 
                            height:'30px',  
                            background: '#58A0DF',
                            borderRadius: '3px',
                            fontSize:'10px',
                            display: mediaMatch.matches && 'none',
                            marginTop: mediaMatch.matches? '10px': '0px',
                            '&:hover': {
                                backgroundColor: '#58A0DF'
                            }
                            }}  variant="contained"> History
                        </Button>
                        <Button sx={{
                            width: mediaMatch.matches? '100%': '80px', 
                            height:'30px',  
                            background: '#F36A4C',
                            borderRadius: '3px',
                            fontSize:'10px',
                            display: mediaMatch.matches && 'none',
                            marginTop: mediaMatch.matches? '10px': '0px',
                            '&:hover': {
                                backgroundColor: '#F36A4C'
                            }
                            }}  
                            onClick={printReport}
                            variant="contained"> Print
                        </Button>
                    </div>
                </div>

                <div className='table-container'>
                    <div className='table-head'>
                        <div className='column'>S/N</div>
                        <div className='column'>Date Created</div>
                        <div className='column'>Expense Date</div>
                        <div className='column'>Expense Name</div>
                        <div className='column'>Description</div>
                        <div className='column'>Expense Amount</div>
                        <div className='column'>Action</div>
                    </div>

                    <div className='row-container'>
                        {
                            expense.length === 0?
                            <div style={place}>No product data</div>:
                            expense.map((data, index) => {
                                return(
                                    <div className='table-head2'>
                                        <div className='column'>{index + 1}</div>
                                        <div className='column'>{data.createdAt.split('T')[0]}</div>
                                        <div className='column'>{data.dateCreated}</div>
                                        <div className='column'>{data.expenseName}</div>
                                        <div className='column'>{data.description}</div>
                                        <div className='column'>{data.expenseAmount}</div>
                                        <div className='column'>
                                            {(data.attachApproval === "0" && data.attachApprovalCam !== "0") && <a href={config.BASE_URL + data.attachApprovalCam} target="_blank" rel="noreferrer">View Invoice</a>}
                                            {(data.attachApproval !== "0" && data.attachApprovalCam === "0") && <a href={config.BASE_URL + data.attachApproval} target="_blank" rel="noreferrer">View Invoice</a>}
                                            {(data.attachApproval === "0" && data.attachApprovalCam === "0") && <span>No attachment</span>}
                                        </div>
                                    </div> 
                                )
                            })
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

const selectStyle2 = {
    width:'100%', 
    height:'35px', 
    borderRadius:'5px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'14px',
    outline:'none',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const place = {
    width:'100%',
    textAlign:'center',
    fontSize:'14px',
    marginTop:'20px',
    color:'green'
}

const menu = {
    fontSize:'14px',
}

export default Expenses;