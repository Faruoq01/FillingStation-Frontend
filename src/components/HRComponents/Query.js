import React, { useCallback, useEffect, useState } from 'react';
import '../../styles/payments.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import hr7 from '../../assets/hr7.png';
import hr8 from '../../assets/hr8.png';
import QueryModal from '../Modals/QueryModal';
import { useDispatch, useSelector } from 'react-redux';
import QueryService from '../../services/query';
import { createQuery, searchQuery } from '../../store/actions/query';
import OutletService from '../../services/outletService';
import { OutlinedInput } from '@mui/material';
import { adminOutlet, getAllStations } from '../../store/actions/outlet';
import QueryReport from '../Reports/QueryReport';
import ViewQuery from '../Modals/ViewQuery';
import swal from 'sweetalert';
import UpdateQuery from '../Modals/UpdateQuery';

const mediaMatch = window.matchMedia('(max-width: 530px)');

const Query = () => {

    const [open, setOpen] = useState(false);
    const [defaultState, setDefault] = useState(0);
    const dispatch = useDispatch();
    const user = useSelector(state => state.authReducer.user);
    const queryData = useSelector(state => state.queryReducer.query);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [prints, setPrints] = useState(false);
    const [openQuery, setOpenQuery] = useState(false);
    const [description, setDesc] = useState('');
    const [openUpdate, setUpdate] = useState(false);
    const [currentQuery, setCurrentQuery] = useState({});
    const [entries, setEntries] = useState(10);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(15);
    const [total, setTotal] = useState(0);

    const resolveUserID = () => {
        if(user.userType === "superAdmin" || user.userType === "admin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const handleQuery = () => {
        if(user.userType === "superAdmin" || user.userType === "admin"){
            if(oneStationData === null){
                swal("Warning!", "Please select a station first", "info");
            }else{
                setOpen(true);
            }
            
        }else{
            swal("Warning!", "You do not have a permission", "info");
        }
    }

    const getAllQueryData = useCallback(() => {

        const payload = {
            organisation: resolveUserID().id
        }

        if(user.userType === "superAdmin" || user.userType === "admin"){
            OutletService.getAllOutletStations(payload).then(data => {
                dispatch(getAllStations(data.station));
                dispatch(adminOutlet(null));
            }).then(()=>{
                const payload = {
                    skip: skip * limit,
                    limit: limit,
                    outletID: "None", 
                    organisationID: resolveUserID().id
                }
                QueryService.allQueryRecords(payload).then(data => {
                    setTotal(data.query.count);
                    dispatch(createQuery(data.query.query));
                });
            })
        }else{
            OutletService.getOneOutletStation({outletID: user.outletID}).then(data => {
                dispatch(adminOutlet(data.station));
            }).then(()=>{
                const payload = {
                    skip: skip * limit,
                    limit: limit,
                    outletID: "None", 
                    organisationID: resolveUserID().id
                }
                QueryService.allQueryRecords(payload).then(data => {
                    setTotal(data.query.count);
                    dispatch(createQuery(data.query.query));
                });
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllQueryData();
    },[getAllQueryData]);

    const refresh = () => {
        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: oneStationData === null? "None": oneStationData?._id,
            organisationID: resolveUserID().id
        }
        QueryService.allQueryRecords(payload).then(data => {
            setTotal(data.query.count);
            dispatch(createQuery(data.query.query));
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
        QueryService.allQueryRecords(payload).then(data => {
            dispatch(createQuery(data.query.query));
        });
    }

    const searchTable = (value) => {
        dispatch(searchQuery(value));
    }

    const printReport = () => {
        setPrints(true);
    }

    const openView = (data) => {
        setDesc(data.description);
        setOpenQuery(true);
    }

    const deleteQuery = (item) => {
        swal({
            title: "Alert!",
            text: "Are you sure you want to delete this query?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                QueryService.deleteQuery({id: item._id}).then((data) => {
                    swal("Success", "Query created successfully!", "success");
                }).then(()=>{
                    getAllQueryData();
                })
            }
        });
    }

    const updateQuery = (item) => {
        setCurrentQuery(item);
        setUpdate(true);
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

    const entriesMenu = (value, limit) => {
        setEntries(value);
        setLimit(limit);
        refresh();
    }

    return(
        <div data-aos="zoom-in-down" className='paymentsCaontainer'>
            {<QueryModal open={open} close={setOpen} refresh={refresh}/>}
            {<UpdateQuery open={openUpdate} close={setUpdate} id={currentQuery} refresh={refresh} />}
            { prints && <QueryReport allOutlets={queryData} open={prints} close={setPrints}/>}
            {openQuery && <ViewQuery open={openQuery} close={setOpenQuery} desc={description} />}
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
                            <MenuItem onClick={handleQuery} value={20}>Add Query</MenuItem>
                            <MenuItem value={30}>History</MenuItem>
                            <MenuItem  onClick={printReport} value={40}>Print</MenuItem>
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
                    <div style={{width:'100px'}} className='butt'>
                        <Button sx={{
                            width:'100%', 
                            height:'30px',  
                            background: '#427BBE',
                            borderRadius: '3px',
                            fontSize:'10px',
                            '&:hover': {
                                backgroundColor: '#427BBE'
                            }
                            }}  
                            onClick={handleQuery}
                            variant="contained"> Add Query
                        </Button>
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
                        <div className='column'>Staff Name</div>
                        <div className='column'>Query Title</div>
                        <div className='column'>Description</div>
                        <div className='column'>Date Queried</div>
                        <div className='column'>Action</div>
                    </div>

                    {
                        queryData.length === 0?
                        <div style={place}>No data</div>:
                        queryData.map((item, index) => {
                            return(
                                <div data-aos="fade-up" key={index} className='row-container'>
                                    <div className='table-head2'>
                                        <div className='column'>{index + 1}</div>
                                        <div className='column'>{item.employeeName}</div>
                                        <div className='column'>{item.queryTitle}</div>
                                        <div className='column'>
                                            <Button sx={{
                                                width:'80px', 
                                                height:'30px',  
                                                background: '#427BBE',
                                                borderRadius: '3px',
                                                fontSize:'10px',
                                                '&:hover': {
                                                    backgroundColor: '#427BBE'
                                                }
                                                }}  
                                                onClick={()=>{openView(item)}}
                                                variant="contained"> View
                                            </Button>
                                        </div>
                                        <div className='column'>{item.createdAt.split('T')[0]}</div>
                                        <div className='column'>
                                            <div style={{width:'70px'}} className='actions'>
                                                <img onClick={()=>{updateQuery(item)}} style={{width:'27px', height:'27px'}} src={hr7} alt="icon" />
                                                <img onClick={()=>{deleteQuery(item)}} style={{width:'27px', height:'27px'}} src={hr8} alt="icon" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <div className='footer'>
                    <div style={{fontSize:'14px', fontFamily:'Nunito-Regular'}}>
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
    fontFamily: 'Nunito-Regular',
    fontSize:'14px',
    outline:'none',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const menu = {
    fontSize:'14px',
    fontFamily:'Nunito-Regular'
}

const place = {
    width:'100%',
    textAlign:'center',
    fontSize:'14px',
    fontFamily:'Nunito-Regular',
    marginTop:'20px',
    color:'green'
}

export default Query;