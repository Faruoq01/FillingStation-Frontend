import React, { useCallback, useEffect, useState } from 'react';
import '../../styles/payments.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import hr7 from '../../assets/hr7.png';
import hr8 from '../../assets/hr8.png';
import SalaryModal from '../Modals/SalaryModal';
import SalaryService from '../../services/salary';
import { createSalary, searchSalary } from '../../store/actions/salary';
import { useDispatch, useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import { OutlinedInput } from '@mui/material';
import { adminOutlet, getAllStations } from '../../store/actions/outlet';
import UpdateSalary from '../Modals/UpdateSalary';
import swal from 'sweetalert';
import SalaryReports from '../Reports/SalaryReport';
import { ThreeDots } from 'react-loader-spinner';

const mediaMatch = window.matchMedia('(max-width: 530px)');
const mobile = window.matchMedia('(max-width: 600px)');

const Salary = () => {

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [defaultState, setDefault] = useState(0);
    const dispatch = useDispatch();
    const user = useSelector(state => state.authReducer.user);
    const salaryData = useSelector(state => state.salaryReducer.salary);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [currentSalary, setCurrentSalary] = useState(false);
    const [entries, setEntries] = useState(10);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(15);
    const [total, setTotal] = useState(0);
    const [ prints, setPrints] = useState(false);
    const [loading, setLoading] = useState(false);

    const resolveUserID = () => {
        if(user.userType === "superAdmin" || user.userType === "admin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const getPerm = (e) => {
        if(user.userType === "superAdmin"){
            return true;
        }
        return user.permission?.hr[e];
    }

    const openSalaryModal = () => {
        if(!getPerm('7')) return swal("Warning!", "Permission denied", "info");
        
        if(oneStationData === null){
            swal("Warning!", "Please select a station first", "info");
        }else{
            setOpen(true);
        }
    }

    const getAllSalaryData = useCallback(() => {

        if(oneStationData !== null){
            if((getPerm('5') || getPerm('6') || user.userType === "superAdmin")){
                const findID = allOutlets.findIndex(data => data._id === oneStationData._id);
                setDefault(findID + 1);

                const payload = {
                    skip: skip * limit,
                    limit: limit,
                    outletID: oneStationData._id, 
                    organisationID: resolveUserID().id
                }
                SalaryService.allSalaryRecords(payload).then(data => {
                    setLoading(false);
                    setTotal(data.salary.count);
                    dispatch(createSalary(data.salary.salary));
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
            if((getPerm('5') || user.userType === "superAdmin") && oneStationData === null){
                if(!getPerm('6')) setDefault(1);
                dispatch(adminOutlet(null));
                return "None";
            }else{
                return user.outletID;
            }
        }).then((data)=>{
            const payload = {
                skip: skip * limit,
                limit: limit,
                outletID: data, 
                organisationID: resolveUserID().id
            }
            SalaryService.allSalaryRecords(payload).then(data => {
                setLoading(false);
                setTotal(data.salary.count);
                dispatch(createSalary(data.salary.salary));
            });
        })

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllSalaryData();
    },[getAllSalaryData]);

    const refresh = () => {
        setLoading(true);
        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: oneStationData === null? "None": oneStationData?._id,
            organisationID: resolveUserID().id
        }
        SalaryService.allSalaryRecords(payload).then(data => {
            setTotal(data.salary.count);
            dispatch(createSalary(data.salary.salary));
        }).then(()=>{
            setLoading(false);
        })
    }

    const changeMenu = (index, item ) => {
        if(!getPerm('6') && item === null) return swal("Warning!", "Permission denied", "info");
        setLoading(true);
        setDefault(index);
        dispatch(adminOutlet(item));

        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: item === null? "None": item?._id,
            organisationID: resolveUserID().id
        }
        SalaryService.allSalaryRecords(payload).then(data => {
            setTotal(data.salary.count);
            dispatch(createSalary(data.salary.salary));
        }).then(()=>{
            setLoading(false);
        })
    }

    const searchTable = (value) => {
        dispatch(searchSalary(value));
    }

    const updateSalary = (item) => {
        setOpen2(true);
        setCurrentSalary(item)
    }

    const deleteSalary = (item) => {
        swal({
            title: "Alert!",
            text: "Are you sure you want to delete this salary?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                if (willDelete) {
                    SalaryService.deleteSalary({id: item._id}).then((data) => {
                        swal("Success", "Salary created successfully!", "success");
                    }).then(()=>{
                        getAllSalaryData();
                    })
                }
            }
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

    const entriesMenu = (value, limit) => {
        setEntries(value);
        setLimit(limit);
        refresh();
    }

    const printReport = () => {
        if(!getPerm('8')) return swal("Warning!", "Permission denied", "info");
        setPrints(true);
    }

    return(
        <div data-aos="zoom-in-down" className='paymentsCaontainer'>
            {<SalaryModal station={oneStationData} open={open} close={setOpen} refresh={refresh} />}
            {<UpdateSalary open={open2} id={currentSalary} close={setOpen2} refresh={refresh} />}
            { prints && <SalaryReports allOutlets={salaryData} open={prints} close={setPrints}/>}
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
                            <MenuItem onClick={openSalaryModal} value={20}>Add Salary</MenuItem>
                            <MenuItem value={30}>History</MenuItem>
                            <MenuItem onClick={printReport} value={40}>Print</MenuItem>
                        </Select>
                    </div>
                </div>

                <div className='search'>
                    <div className='input-cont'>
                        <div className='second-select'>
                            {getPerm('5') &&
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
                            {getPerm('5') ||
                                <Select
                                    labelId="demo-select-small"
                                    id="demo-select-small"
                                    value={0}
                                    sx={selectStyle2}
                                    disabled
                                >
                                    <MenuItem style={menu} value={0}>{!getPerm('5')? oneStationData?.outletName+", "+oneStationData?.alias: "No station created"}</MenuItem>
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
                    <div style={{width:'100px'}} className='butt'>
                        <Button sx={{
                            width:'100%', 
                            height:'30px',  
                            background: '#427BBE',
                            borderRadius: '0px',
                            fontSize:'10px',
                            '&:hover': {
                                backgroundColor: '#427BBE'
                            }
                            }}  
                            onClick={openSalaryModal}
                            variant="contained"> Add Salary
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
                            borderRadius: '0px',
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
                            borderRadius: '0px',
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

                {
                    mobile.matches?
                    !loading?
                    salaryData.length === 0?
                    <div style={place}>No data</div>:
                    salaryData.map((item, index) => {
                        return(
                            <div key={index} className='mobile-table-container'>
                                <div className="inner-container">

                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.position}</div>
                                            <div className='foots'>Position</div>
                                        </div>
                                        <div className='right-text'>
                                            <div className='heads'>{item.level}</div>
                                            <div className='foots'>Level</div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.low_range+' - '+item.high_range}</div>
                                            <div className='foots'>Salary Range</div>
                                        </div>
                                        <div className='right-text'>
                                            <div style={{width:'70px'}} className='actions'>
                                                <img onClick={()=>{updateSalary(item)}} style={{width:'27px', height:'27px'}} src={hr7} alt="icon" />
                                                <img onClick={()=>{deleteSalary(item)}} style={{width:'27px', height:'27px'}} src={hr8} alt="icon" />
                                            </div>
                                        </div>
                                    </div>
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
                    </div>:

                    <div className='table-container'>
                        <div className='table-head'>
                            <div className='column'>S/N</div>
                            <div className='column'>Position</div>
                            <div className='column'>Level</div>
                            <div className='column'>Salary range</div>
                            <div className='column'>Actions</div>
                        </div>

                        <div className='row-container'>
                            {
                                !loading?
                                salaryData.length === 0?
                                <div style={place}>No data</div>:
                                salaryData.map((item, index) => {
                                    return(
                                        <div data-aos="fade-up" key={index} className='table-head2'>
                                            <div className='column'>{index + 1}</div>
                                            <div className='column'>{item.position}</div>
                                            <div className='column'>{item.level}</div>
                                            <div className='column'>{item.low_range+' - '+item.high_range}</div>
                                            <div className='column'>
                                                <div style={{width:'70px'}} className='actions'>
                                                    <img onClick={()=>{updateSalary(item)}} style={{width:'27px', height:'27px'}} src={hr7} alt="icon" />
                                                    <img onClick={()=>{deleteSalary(item)}} style={{width:'27px', height:'27px'}} src={hr8} alt="icon" />
                                                </div>
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
                    <div style={{fontSize:'12px'}}>
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
    borderRadius:'0px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'13px',
    outline:'none',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const menu = {
    fontSize:'13px',
}

const place = {
    width:'100%',
    textAlign:'center',
    fontSize:'13px',
    marginTop:'20px',
    color:'green'
}

const load = {
    width: '100%',
    height:'30px',
    display:'flex',
    justifyContent:'center',
}

export default Salary;