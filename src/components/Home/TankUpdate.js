import React, { useCallback, useEffect, useState } from 'react';
import '../../styles/payments.scss';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import TankUpdateModal from '../Modals/TankUpdateModal';
import { useDispatch, useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllOutletTanks, getAllStations, searchTanks } from '../../store/actions/outlet';
import PrintTankUpdate from '../Reports/PrintTankUpdate';
import swal from 'sweetalert';
import { ThreeDots } from 'react-loader-spinner';
import ApproximateDecimal from '../common/approx';

const mediaMatch = window.matchMedia('(max-width: 530px)');
const mobile = window.matchMedia('(max-width: 600px)');

const TankUpdate = () => {

    const [open, setOpen] = useState(false);
    const [defaultState, setDefault] = useState(0);
    const dispatch = useDispatch();
    const user = useSelector(state => state.authReducer.user);
    const tankList = useSelector(state => state.outletReducer.tankList);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [tanks] = useState([]);
    const [entries, setEntries] = useState(10);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(15);
    const [total, setTotal] = useState(0);
    const [prints, setPrints] = useState(false);
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
        return user.permission?.tankUpdate[e];
    }

    const updateTankModal = () => {
        if(!getPerm('2')) return swal("Warning!", "Permission denied", "info");
        
        if(oneStationData === null){
            swal("Warning!", "Please select a station first", "info");
        }else{
            setOpen(true);
        }
    }

    const getTankData = useCallback(() => {
        setLoading(true);
        const payload = {
            organisation: resolveUserID().id
        }

        OutletService.getAllOutletStations(payload).then(data => {
            dispatch(getAllStations(data.station));
            if(getPerm('0')){
                if(!getPerm('1')) setDefault(1);
                dispatch(adminOutlet(null));
                return "None";
            }else{
                const allStations = data.station;
                const findID = allStations.findIndex(data => data._id === user.outletID);
                dispatch(adminOutlet(allStations[findID]));
                return user.outletID;
            }
        }).then((data)=>{
            const payload2 = {
                skip: skip * limit,
                limit: limit,
                outletID: data, 
                organisationID: resolveUserID().id
            }
            OutletService.getAllOutletTanks(payload2).then(data => {
                setLoading(false)
                setTotal(data.count);
                dispatch(getAllOutletTanks(data.stations));
            })
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getTankData();
    },[getTankData]);

    const refresh = () => {
        setLoading(true)
        const payload = {
            skip: skip * limit,
            limit: limit,
            outletID: oneStationData === null? "None": oneStationData?._id,
            organisationID: resolveUserID().id
        }
        OutletService.getAllOutletTanks(payload).then(data => {
            setTotal(data.count);
            dispatch(getAllOutletTanks(data.stations));
        }).then(()=>{
            setLoading(false)
        });
    }

    const changeMenu = (index, item ) => {
        if(!getPerm('1') && item === null) return swal("Warning!", "Permission denied", "info");
        setLoading(true)
        setDefault(index);
        dispatch(adminOutlet(item));

        const payload = {
            outletID: item === null? "None": item?._id,
            organisationID: resolveUserID().id
        }
        OutletService.getAllOutletTanks(payload).then(data => {
            setTotal(data.count);
            dispatch(getAllOutletTanks(data.stations));
        }).then(()=>{
            setLoading(false)
        });
    }

    const searchTable = (value) => {
        dispatch(searchTanks(value));
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
        if(!getPerm('2')) return swal("Warning!", "Permission denied", "info");
        setPrints(true);
    }

    return(
        <div data-aos="zoom-in-down" className='paymentsCaontainer'>
            { <TankUpdateModal data={tankList} open={open} close={setOpen} tanks={tanks} refresh={getTankData} /> }
            { prints && <PrintTankUpdate allOutlets={tankList} open={prints} close={setPrints}/>}
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
                            <MenuItem onClick={updateTankModal} value={20}>Update Tank</MenuItem>
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
                    <div style={{width:'120px'}} className='butt'>
                        {/* <Button sx={{
                            width:'100%', 
                            height:'30px',  
                            background: '#427BBE',
                            borderRadius: '3px',
                            fontSize:'10px',
                            '&:hover': {
                                backgroundColor: '#427BBE'
                            }
                            }}
                            onClick={updateTankModal}
                            variant="contained">Update Tank
                        </Button> */}
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
                    tankList.length === 0?
                    <div style={place}>No data</div>:
                    tankList.map((item, index) => {
                        return(
                            <div key={index} className='mobile-table-container'>
                                <div className="inner-container">
                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.dateUpdated}</div>
                                            <div className='foots'>Date Updated</div>
                                        </div>
                                        <div className='right-text'>
                                            <div className='heads'>{item.tankName}</div>
                                            <div className='foots'>Tank Name</div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.productType}</div>
                                            <div className='foots'>Tank Product</div>
                                        </div>
                                        <div className='right-text'>
                                            <div className='heads'>{item.previousLevel}</div>
                                            <div className='foots'>Previous Level</div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='left-text'>
                                            <div className='heads'>{item.quantityAdded}</div>
                                            <div className='foots'>Quantity Added</div>
                                        </div>
                                        <div className='right-text'>
                                            <div className='heads'>{item.currentLevel}</div>
                                            <div className='foots'>Current Level</div>
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
                            <div className='column'>Date</div>
                            <div className='column'>Tank Name</div>
                            <div className='column'>Tank Product</div>
                            <div className='column'>Station</div>
                            <div className='column'>Previous Level</div>
                            <div className='column'>Quantity Added</div>
                            <div className='column'>Updated Level</div>
                        </div>

                        <div className='row-container'>
                            {
                                !loading?
                                tankList.length === 0?
                                <div style={place}>No tank updates</div>:
                                tankList.map((data, index) => {
                                    return(
                                        <div key={index} className='table-head2'>
                                            <div className='column'>{index + 1}</div>
                                            <div className='column'>{data.dateUpdated}</div>
                                            <div className='column'>{data.tankName}</div>
                                            <div className='column'>{data.productType}</div>
                                            <div className='column'>{data.station}</div>
                                            <div className='column'>{ApproximateDecimal(data.previousLevel)}</div>
                                            <div className='column'>{data.quantityAdded}</div>
                                            <div className='column'>{ApproximateDecimal(data.currentLevel)}</div>
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

const place = {
    width:'100%',
    textAlign:'center',
    fontSize:'13px',
    marginTop:'20px',
    color:'green'
}

const menu = {
    fontSize:'13px',
}

const load = {
    width: '100%',
    height:'30px',
    display:'flex',
    justifyContent:'center',
}

export default TankUpdate;