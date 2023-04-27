import React, { useEffect, useCallback, useState } from 'react';
import '../../styles/payments.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllStations } from '../../store/actions/outlet';
import { OutlinedInput } from '@mui/material';
import RecordPaymentService from '../../services/recordPayment';
import { allBankPayment, allPosPayment, searchBankPayment, searchPosPayment } from '../../store/actions/recordPayment';
import config from '../../constants';
import { ThreeDots } from 'react-loader-spinner';
import swal from 'sweetalert';
import DailySalesService from '../../services/DailySales';

const mediaMatch = window.matchMedia('(max-width: 530px)');
const mobile = window.matchMedia('(max-width: 1150px)');

const Payments = (props) => {

    const [setLpo] = React.useState(false);
    const user = useSelector(state => state.authReducer.user);
    const bank = useSelector(state => state.recordPaymentReducer.bank);
    const pos = useSelector(state => state.recordPaymentReducer.pos);
    const dispatch = useDispatch();
    const [defaultState, setDefault] = useState(0);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [activeButton, setActiveButton] = useState(false);
    const [entries, setEntries] = useState(10);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(15);
    const [total1, setTotal1] = useState(0);
    const [setPrints] = useState(false);
    const [loading, setLoading] = useState(false);

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
        return user?.permission?.payments[e];
    }

    const openModal = () => {
        setLpo(true);
    }

    const getAllLPOData = useCallback(() => {

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
    
                RecordPaymentService.getBankPayments(payload).then((data) => {
                    setLoading(false);
                    setTotal1(data.bank.count);
                    dispatch(allBankPayment(data.bank.bank));
                });
        
                RecordPaymentService.getPOSPayments(payload).then((data) => {
                    dispatch(allPosPayment(data.pos.pos));
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

            RecordPaymentService.getBankPayments(payload).then((data) => {
                setLoading(false);
                setTotal1(data.bank.count);
                dispatch(allBankPayment(data.bank.bank));
            });
    
            RecordPaymentService.getPOSPayments(payload).then((data) => {
                dispatch(allPosPayment(data.pos.pos));
            });
        });
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllLPOData();
    },[getAllLPOData])

    const LPOCompanies = () => {
        setActiveButton(true);
    }

    const dispensed = () => {
        setActiveButton(false);
    }

    const refresh = () => {
        setLoading(true);
        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: oneStationData === null? "None": oneStationData?._id,
            organisationID: resolveUserID().id
        }

        RecordPaymentService.getBankPayments(payload).then((data) => {
            setLoading(false);
            setTotal1(data.bank.count);
            dispatch(allBankPayment(data.bank.bank));
        })

        RecordPaymentService.getPOSPayments(payload).then((data) => {
            dispatch(allPosPayment(data.pos.pos));
        })
    }

    const changeMenu = (index, item ) => {
        setLoading(false);
        setDefault(index);
        dispatch(adminOutlet(item));

        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: item === null? "None": item?._id,
            organisationID: resolveUserID().id
        }

        RecordPaymentService.getBankPayments(payload).then((data) => {
            setLoading(false);
            setTotal1(data.bank.count);
            dispatch(allBankPayment(data.bank.bank));
        })

        RecordPaymentService.getPOSPayments(payload).then((data) => {
            dispatch(allPosPayment(data.pos.pos));
        })
    }

    const searchTable = (value) => {
        dispatch(searchBankPayment(value));
        dispatch(searchPosPayment(value));
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

    const confirmPayment = (data, type) => {
        if(!getPerm('2')) return swal("Warning!", "Permission denied", "info");

        swal({
            title: "Alert!",
            text: "Are you sure you want to confirm this payment?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                
                const payload = {
                    type: "bank",
                    id: data._id,
                    confirmation: user.userType === "superAdmin"? user.firstname.concat(" ", user.lastname): user.staffName,
                }
        
                const payload2 = {
                    type: "pos",
                    id: data._id,
                    confirmation: user.userType === "superAdmin"? user.firstname.concat(" ", user.lastname): user.staffName,
                }
        
                DailySalesService.updateSales(type === "bank"? payload: payload2).then(data => {
                    setLoading(false);
                    refresh();
                }).then(()=>{
                    swal("Success", "Record updated successfully", "success");
                });
            }
        });
    }

    return(
        <React.Fragment>
            <div data-aos="zoom-in-down" style={{marginTop: mobile.matches? "10px": "auto"}} className='paymentsCaontainer'>
                {/* { prints && <LPOReport allOutlets={lpos} open={prints} close={setPrints}/>} */}
                <div className='inner-pay'>
                    <div className='action'>
                        <div style={{width:'150px'}} className='butt2'>
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={10}
                                sx={{...selectStyle2, backgroundColor:"#06805B", color:'#fff'}}
                            >
                                <MenuItem value={10}>Action</MenuItem>
                                <MenuItem onClick={openModal} value={20}>Register LPO</MenuItem>
                                <MenuItem value={30}>Download PDF</MenuItem>
                                <MenuItem value={40}>Print</MenuItem>
                            </Select>
                        </div>
                    </div>

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
                        <div style={{justifyContent: 'flex-end'}} className='butt'>
                            
                        </div>
                    </div>

                    <div style={{marginTop:'20px'}} className='search2'>
                        <div className='lpo-butt'>
                            <Button sx={{
                                width:'120px', 
                                height:'30px',  
                                background: !activeButton? '#06805B': '#fff',
                                borderRadius: '27px',
                                fontSize:'10px',
                                marginRight:'10px',
                                color: !activeButton? '#fff': '#000',
                                '&:hover': {
                                    background: !activeButton? '#06805B': '#fff',
                                }
                                }}  
                                onClick={dispensed}
                                variant="contained"> Bank Payments
                            </Button>
                            <Button sx={{
                                width:'120px', 
                                height:'30px',  
                                background: activeButton? '#06805B': '#fff',
                                borderRadius: '27px',
                                fontSize:'10px',
                                color: activeButton? '#fff': '#000',
                                '&:hover': {
                                    background: activeButton? '#06805B': '#fff',
                                }
                                }}  
                                onClick={LPOCompanies}
                                variant="contained"> POS payments
                            </Button>
                        </div>
                        <div style={{width: mediaMatch.matches? '100%': '330px', alignItems:'center'}} className='input-cont2'>
                            
                            <Select
                                labelId="demo-select-small"
                                id="demo-select-small"
                                value={entries}
                                sx={{...selectStyle2, 
                                    width:'130px',
                                    height:'32px',
                                    display: mediaMatch.matches && 'none',
                                }}
                            >
                                <MenuItem style={menu} value={10}>Show entries</MenuItem>
                                <MenuItem onClick={()=>{entriesMenu(20, 15)}} style={menu} value={20}>15 entries</MenuItem>
                                <MenuItem onClick={()=>{entriesMenu(30, 30)}} style={menu} value={30}>30 entries</MenuItem>
                                <MenuItem onClick={()=>{entriesMenu(40, 100)}} style={menu} value={40}>100 entries</MenuItem>
                            </Select>
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

                    {activeButton ||
                        <div style={{marginTop:'10px'}} className='table-container'>
                        <div className='table-head'>
                            <div className='column'>S/N</div>
                            <div className='column'>Bank Name</div>
                            <div className='column'>Teller Number</div>
                            <div className='column'>Amount Paid</div>
                            <div className='column'>Payment Date</div>
                            <div className='column'>Date Created</div>
                            <div className='column'>Confirmed By</div>
                            <div className='column'>Reciept</div>
                        </div>

                        <div className='row-container'>
                            {
                                !loading?
                                bank.length === 0?
                                <div style={place}>No Bank Payment Data </div>:
                                bank.map((data, index) => {
                                    return(
                                        <div className='table-head2'>
                                            <div className='column'>{index + 1}</div>
                                            <div className='column'>{data.bankName}</div>
                                            <div className='column'>{data.tellerNumber}</div>
                                            <div className='column'>{data.amountPaid}</div>
                                            <div className='column'>{data.paymentDate}</div>
                                            <div className='column'>{data.createdAt.split('T')[0]}</div>
                                            <div className='column'>
                                                {
                                                    ("confirmation" in data? data.confirmation === "null"? 
                                                        <Button sx={{
                                                            width:'60px', 
                                                            height:'30px',  
                                                            background: '#F36A4C',
                                                            borderRadius: '3px',
                                                            fontSize:'10px',
                                                            textTransform: 'capitalize',
                                                            '&:hover': {
                                                                backgroundColor: '#F36A4C'
                                                            }
                                                            }}  
                                                            onClick={()=>{confirmPayment(data, "bank")}}
                                                            variant="contained"> Confirm
                                                        </Button>:
                                                        <div>{data.confirmation}</div> :
                                                        <Button sx={{
                                                            width:'60px', 
                                                            height:'30px',  
                                                            background: '#F36A4C',
                                                            borderRadius: '3px',
                                                            fontSize:'10px',
                                                            textTransform: 'capitalize',
                                                            '&:hover': {
                                                                backgroundColor: '#F36A4C'
                                                            }
                                                            }}  
                                                            onClick={()=>{confirmPayment(data, "bank")}}
                                                            variant="contained"> Confirm
                                                        </Button>
                                                    )
                                                }                                             
                                            </div>
                                            <div className='column'>
                                                {data.uploadSlip !== "null" && <a href={config.BASE_URL + data.uploadSlip} target="_blank" rel="noreferrer">View Slip</a>}
                                                {data.uploadSlip === "null" && <span>No attachment</span>}
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
                    }

                    {activeButton &&
                        <div style={{marginTop:'10px'}} className='table-container'>
                            <div className='table-head'>
                                <div className='column'>S/N</div>
                                <div className='column'>POS Name</div>
                                <div className='column'>Terminal ID</div>
                                <div className='column'>Amount Paid</div>
                                <div className='column'>Payment Date</div>
                                <div className='column'>Date Created</div>
                                <div className='column'>Confirmed By</div>
                                <div className='column'>Reciept</div>
                            </div>

                            <div className='row-container'>
                                {
                                    !loading?
                                    pos.length === 0?
                                    <div style={place}>No POS Payment Data </div>:
                                    pos.map((data, index) => {
                                        return(
                                            <div className='table-head2'>
                                                <div className='column'>{index + 1}</div>
                                                <div className='column'>{data.posName}</div>
                                                <div className='column'>{data.terminalID}</div>
                                                <div className='column'>{data.amountPaid}</div>
                                                <div className='column'>{data.paymentDate}</div>
                                                <div className='column'>{data.createdAt.split('T')[0]}</div>
                                                <div className='column'>
                                                    {
                                                        ("confirmation" in data? data.confirmation === "null"? 
                                                            <Button sx={{
                                                                width:'60px', 
                                                                height:'30px',  
                                                                background: '#F36A4C',
                                                                borderRadius: '3px',
                                                                fontSize:'10px',
                                                                textTransform: 'capitalize',
                                                                '&:hover': {
                                                                    backgroundColor: '#F36A4C'
                                                                }
                                                                }}  
                                                                onClick={()=>{confirmPayment(data, "pos")}}
                                                                variant="contained"> Confirm
                                                            </Button>:
                                                            <div>{data.confirmation}</div> :
                                                            <Button sx={{
                                                                width:'60px', 
                                                                height:'30px',  
                                                                background: '#F36A4C',
                                                                borderRadius: '3px',
                                                                fontSize:'10px',
                                                                textTransform: 'capitalize',
                                                                '&:hover': {
                                                                    backgroundColor: '#F36A4C'
                                                                }
                                                                }}  
                                                                onClick={()=>{confirmPayment(data, "pos")}}
                                                                variant="contained"> Confirm
                                                            </Button>
                                                        )
                                                    }
                                                </div>
                                                <div className='column'>
                                                    {data.uploadSlip !== "null" && <a href={config.BASE_URL + data.uploadSlip} target="_blank" rel="noreferrer">View Slip</a>}
                                                    {data.uploadSlip === "null" && <span>No attachment</span>}
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
                    }

                    <div className='footer'>
                        <div style={{fontSize:'14px'}}>
                            Showing {((skip + 1) * limit) - (limit-1)} to {(skip + 1) * limit} of {total1} entries
                        </div>
                        <div className='nav'>
                            <button onClick={prevPage} className='but'>Previous</button>
                            <div className='num'>{skip + 1}</div>
                            <button onClick={nextPage} className='but2'>Next</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
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
    fontFamily:'Poppins'
}

const load = {
    width: '100%',
    height:'30px',
    display:'flex',
    justifyContent:'center',
}

export default Payments;