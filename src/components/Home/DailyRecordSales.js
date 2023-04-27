import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import SanitizerIcon from '@mui/icons-material/Sanitizer';
import PropaneTankIcon from '@mui/icons-material/PropaneTank';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import AssignmentReturnedIcon from '@mui/icons-material/AssignmentReturned';
import PaidIcon from '@mui/icons-material/Paid';
import AddCardIcon from '@mui/icons-material/AddCard';
import '../../styles/newSales.scss';
import { Button, IconButton, MenuItem, Select } from '@mui/material';
import PumpUpdateComponent from '../DailyRecordSales/PumpUpdateComponent';
import LPOComponent from '../DailyRecordSales/LPOComponent';
import ExpenseComponents from '../DailyRecordSales/ExpenseComponents';
import PaymentsComponents from '../DailyRecordSales/PaymentComponents';
import ReturnToTankComponent from '../DailyRecordSales/ReturnToTankComponent';
import DippingComponents from '../DailyRecordSales/DippingComponents';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { passRecordSales } from '../../store/actions/dailySales';
import { useSelector } from 'react-redux';
import OutletService from '../../services/outletService';
import { adminOutlet, getAllOutletTanks, getAllPumps, getAllStations } from '../../store/actions/outlet';
import LPOService from '../../services/lpo';
import { createLPO } from '../../store/actions/lpo';
import Backdrop from '@mui/material/Backdrop';
import { BallTriangle } from 'react-loader-spinner';
import { useState } from 'react';
import { useRef } from 'react';
import SummaryRecord from '../Modals/SummaryRecord';
import { changeDate, changeStation } from '../../store/actions/records';
import { isSafari } from 'react-device-detect';
import swal from 'sweetalert';

const mediaMatch = window.matchMedia('(max-width: 450px)');

const months = {
    '01' : 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
}

function DoublyLinkedListNode(data){
    this.data = data;
    this.next = null;
    this.prev = null;
    this.data.ago = [];
    this.data.pms = [];
    this.data.dpk = [];
    this.data.selectedPumps = [];
    this.data.selectedTanks = [];
    this.data.lpo = [];
    this.data.supply = [];
    this.data.expenses = [];
    this.data.pay = [];
    this.data.dipping = [];
}

function DoublyLinkedList(){
    this.head = null;
    this.currentDate = null;
    this.size = 0;
    this.page = 1;

    this.isEmpty = function(){
        return this.size === 0;
    }

    this.addNode = function(value){
        if(this.head === null){
            this.head = new DoublyLinkedListNode(value);
        }else{
            var temp = new DoublyLinkedListNode(value);
            temp.next = this.head;
            this.head.prev = temp;
            this.head = temp;
        }
        this.size++;
    }

    this.nextPage = function(){
        this.head = this.head.next
    }

    this.previousPage = function(){
        this.head = this.head.prev
    }
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
      'linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
      'linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 40,
  height: 40,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  fontSize:'11px',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage:
    'linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage:
    'linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)',
  }),
}));

function ColorlibStepIcon(props) {
  const { active, completed, className } = props;

  const icons = {
    1: <SanitizerIcon />,
    2: <AssignmentReturnedIcon />,
    3: <CreditScoreIcon />,
    4: <PaidIcon />,
    5: <AddCardIcon />,
    6: <PropaneTankIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

ColorlibStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
  /**
   * The label displayed in the step icon.
   */
  icon: PropTypes.node,
};

const steps = ['Pump Update', 'Return to Tank', 'LPO', 'Expenses', 'Payments', 'Dipping'];

const DailyRecordSales = () => {
    const date = new Date();
    const toString = date.toDateString();
    const [month, day, year] = toString.split(' ');
    const date2 = `${day} ${month} ${year}`;

    const dateHandle = useRef();
    const dispatch = useDispatch();
    const user = useSelector(state => state.authReducer.user);
    const linkedData = useSelector(state => state.dailySalesReducer.linkedData);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const [defaultState, setDefault] = useState(0);
    const [open, setOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(date2);
    const [openSummary, setOpenSummary] = useState(false);

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
        return user.permission?.recordSales[e];
    }

    const getAllInitialRecords = React.useCallback((list) => {

        if(oneStationData !== null){
            if((getPerm('0') || getPerm('1') || user.userType === "superAdmin")){
                const findID = allOutlets.findIndex(data => data._id === oneStationData._id);
                setDefault(findID + 1);

                const payload = {
                    outletID: oneStationData._id, 
                    organisationID: resolveUserID().id
                }
        
                OutletService.getAllStationPumps(payload).then(data => {
                    dispatch(getAllPumps(data));
                });
        
                OutletService.getAllOutletTanks(payload).then(data => {
                    const outletTanks = data.stations.map(data => {
                        const newData = {...data, label: data.tankName, value: data._id, dippingValue: "0"};
                        return newData;
                    });
                    dispatch(getAllOutletTanks(outletTanks));
                });
        
                LPOService.getAllLPO(payload).then((data) => {
                    dispatch(createLPO(data.lpo.lpo));
                });

                return
            }
        }

        const payload = {
            organisation: resolveUserID().id
        }

        OutletService.getAllOutletStations(payload).then(data => {
            dispatch(getAllStations(data.station));
            if((getPerm('0') || user.userType === "superAdmin") && oneStationData === null){
                if(!getPerm('1')) setDefault(1);
                dispatch(adminOutlet(null));
                dispatch(getAllPumps([]));
                return "None";
            }else{
                return user.outletID;
            }
        }).then(data => {
            if(data !== "None"){
                const payload = {
                    outletID: data, 
                    organisationID: resolveUserID().id
                }
        
                OutletService.getAllStationPumps(payload).then(data => {
                    dispatch(getAllPumps(data));
                });
        
                OutletService.getAllOutletTanks(payload).then(data => {
                    const outletTanks = data.stations.map(data => {
                        const newData = {...data, label: data.tankName, value: data._id, dippingValue: "0"};
                        return newData;
                    });
                    dispatch(getAllOutletTanks(outletTanks));
                });
        
                LPOService.getAllLPO(payload).then((data) => {
                    dispatch(createLPO(data.lpo.lpo));
                });
            }
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, user.outletID, user.userType]);

    useEffect(()=>{
        const list = new DoublyLinkedList();
        for(let i=6; i > 0 ; i--){
            list.addNode({
                currentPage: String(i),
                payload: [],
            });
        }
        dispatch(passRecordSales(list));

        getAllInitialRecords(list);
    },[getAllInitialRecords, dispatch]);

    const nextQuestion = () => {
        let newList = {...linkedData}

        if(newList.head.next !== null){
            if(oneStationData === null ) return swal("Warning!", "Please select a station first", "info");
            if(!getPerm('3') && (newList.page === 1)) return swal("Warning!", "Permission denied", "info");
            if(!getPerm('4') && (newList.page === 2)) return swal("Warning!", "Permission denied", "info");
            if(!getPerm('5') && (newList.page === 3)) return swal("Warning!", "Permission denied", "info");
            if(!getPerm('6') && (newList.page === 4)) return swal("Warning!", "Permission denied", "info");
            if(!getPerm('7') && (newList.page === 5)) return swal("Warning!", "Permission denied", "info");

            const clonePage = [...pages];
            clonePage[newList.page] = newList.page;
            setPages(clonePage);

            newList.nextPage();
            newList.page++;
            dispatch(passRecordSales(newList));
            // console.log(newList, 'next')
        }
    }

    const prevQuestion = () => {
        let newList = {...linkedData}
        if(newList.head.prev !== null){
            const clonePage = [...pages];
            clonePage[newList.page - 1] = 0;
            setPages(clonePage);

            newList.previousPage();
            newList.page--;
            dispatch(passRecordSales(newList));
            // console.log(newList, 'prev')
        }
    }

    const finishAndSubmit = () => {
        let newList = {...linkedData}

        if(!getPerm('8') && (newList.page === 6)) return swal("Warning!", "Permission denied", "info");
        setOpenSummary(true);
    }

    const changeMenu = (index, item ) => {
        if(!getPerm('1') && item === null) return swal("Warning!", "Permission denied", "info");
        setDefault(index);
        dispatch(changeStation());

        const payload = {
            outletID: item._id, 
            organisationID: item.organisation
        }

        OutletService.getAllStationPumps(payload).then(data => {
            dispatch(getAllPumps(data));
        });

        OutletService.getAllOutletTanks(payload).then(data => {
            const outletTanks = data.stations.map(data => {
                const newData = {...data, label: data.tankName, value: data._id, dippingValue: "0"};
                return newData;
            });
            dispatch(getAllOutletTanks(outletTanks));
        });

        LPOService.getAllLPO(payload).then((data) => {
            dispatch(createLPO(data.lpo.lpo));
        });

        dispatch(adminOutlet(item));
    }

    const updateDate = (e) => {
        if(!getPerm('2')) return swal("Warning!", "Permission denied", "info");
        const date = e.target.value.split('-');
        const format = `${date[2]} ${months[date[1]]} ${date[0]}`;
        setCurrentDate(format);

        dispatch(changeDate(e.target.value));
    }

    const [pages, setPages] = useState([1, 0, 0, 0, 0, 0]);

    return (
        <div className='salesRecordStyle'>
            {openSummary && <SummaryRecord setPages={setPages} refresh={getAllInitialRecords} clops={setOpen} open={openSummary} close={setOpenSummary} />}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                // onClick={handleClose}
            >
                <BallTriangle
                    height={100}
                    width={100}
                    radius={5}
                    color="#fff"
                    ariaLabel="ball-triangle-loading"
                    wrapperClass={{}}
                    wrapperStyle=""
                    visible={true}
                />
            </Backdrop>
            <div style={{width:'90%', marginTop:'20px', display:'flex', justifyContent:'space-between'}}>
                <div>
                    {getPerm('0') &&
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={defaultState}
                            sx={selectStyle2}
                        >
                            <MenuItem style={menu} value={0}>Select Station</MenuItem>
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
                <div>
                    <div style={sales}>
                        <input onChange={updateDate} ref={dateHandle} style={{
                            width: mediaMatch? '140px': '170px',
                            height:'30px',
                            background:'#054834',
                            fontSize:'12px',
                            borderRadius:'0px',
                            textTransform:'capitalize',
                            display:'flex',
                            flexDirection:'row',
                            alignItems:'center',
                            color:'#fff',
                            outline:'none',
                            border:'none',
                            paddingRight:'10px'
                        }} type="date" />
                        {isSafari || <div onClick={()=>{dateHandle.current.showPicker()}} style={cover}>{currentDate}</div>}
                    </div>
                </div>
            </div>
            
            <div className="steps">
                <Stack sx={{ width: '100%', marginTop:'20px' }} spacing={4}>
                    <Stepper alternativeLabel activeStep={linkedData.page - 1} connector={<ColorlibConnector />}>
                        {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
                        </Step>
                        ))}
                    </Stepper>
                </Stack>
            </div>

            <div className='ttx' style={text}>{steps[linkedData.page - 1]}</div>

            <div className="mob">
                <IconButton>
                    {/* <ArrowCircleLeftIcon sx={{width:'50px', height:'50px', marginLeft:'2%'}} /> */}
                </IconButton>

                <div className="icons">
                    <div className='cont' 
                        style={{
                            backgroundImage: pages[0]===0? 'linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)': 
                            'linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)'
                        }}>
                        <SanitizerIcon sx = {{color: pages[0] === 0? '#000': '#fff'}} />
                    </div>

                    <div className='cont' 
                        style={{
                            backgroundImage: pages[1]===0? 'linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)': 
                            'linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)'
                        }}>
                            <AssignmentReturnedIcon sx = {{color: pages[0] === 0? '#000': '#fff'}} />
                    </div>

                    <div className='cont' 
                        style={{
                            backgroundImage: pages[2]===0? 'linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)': 
                            'linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)'
                        }}>
                            <CreditScoreIcon sx = {{color: pages[0] === 0? '#000': '#fff'}} />
                    </div>

                    <div className='cont' 
                        style={{
                            backgroundImage: pages[3]===0? 'linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)': 
                            'linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)'
                        }}>
                            <PaidIcon sx = {{color: pages[0] === 0? '#000': '#fff'}} />
                    </div>

                    <div className='cont' 
                        style={{
                            backgroundImage: pages[4]===0? 'linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)': 
                            'linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)'
                        }}>
                            <AddCardIcon sx = {{color: pages[0] === 0? '#000': '#fff'}} />
                    </div>

                    <div className='cont' 
                        style={{
                            backgroundImage: pages[5]===0? 'linear-gradient( 136deg, #ccc 0%, #ccc 50%, #ccc 100%)': 
                            'linear-gradient( 136deg, #06805B 0%, #143d59 50%, #213970 100%)'
                        }}>
                            <PropaneTankIcon sx = {{color: pages[0] === 0? '#000': '#fff'}} />
                    </div>
                </div>

                <IconButton>
                    {/* <ArrowCircleRightIcon sx={{width:'50px', height:'50px', marginRight:'2%'}} /> */}
                </IconButton>
            </div>

            <div className='form-body'>
                {linkedData.page === 1 && <PumpUpdateComponent />}
                {linkedData.page === 2 && <ReturnToTankComponent />}
                {linkedData.page === 3 && <LPOComponent />}
                {linkedData.page === 4 && <ExpenseComponents /> }
                {linkedData.page === 5 && <PaymentsComponents /> }
                {linkedData.page === 6 && <DippingComponents /> }
            </div>

            <div className="navs">
                <div>
                    {linkedData.head?.prev !== null &&
                        <Button 
                            variant="contained" 
                            sx={{
                                width:'100px',
                                height:'30px',
                                background:'#054834',
                                fontSize:'13px',
                                borderRadius:'5px',
                                textTransform:'capitalize',
                                '&:hover': {
                                    backgroundColor: '#054834'
                                }
                            }}
                            onClick={prevQuestion}
                        >
                            Previous
                        </Button>
                    }
                </div>
                
                {linkedData.head?.next === null ||
                    <Button 
                        variant="contained" 
                        sx={{
                            width:'140px',
                            height:'30px',
                            background:'#054834',
                            fontSize:'13px',
                            borderRadius:'5px',
                            textTransform:'capitalize',
                            '&:hover': {
                                backgroundColor: '#054834'
                            }
                        }}
                        onClick={nextQuestion}
                    >
                        Save & Proceed
                    </Button>
                }

                {linkedData.head?.next === null &&
                    <Button 
                        variant="contained" 
                        sx={{
                            width:'140px',
                            height:'30px',
                            background:'#054834',
                            fontSize:'13px',
                            borderRadius:'5px',
                            textTransform:'capitalize',
                            '&:hover': {
                                backgroundColor: '#054834'
                            }
                        }}
                        onClick={finishAndSubmit}
                    >
                        Finish
                    </Button>
                }
            </div>
        </div>
    );
}

const menu = {
    fontSize:'12px',
}

const selectStyle2 = {
    width: mediaMatch.matches? '170px': '200px', 
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

const text = {
    width: '96%',
    textAlign: 'left',
    fontSize:'12px',
    marginTop: '30px',
    marginLeft:'4%',
    fontWeight:'bold',
}

const sales = {
    width:'100%', 
    display:'flex', 
    flexDirection:'row', 
    justifyContent:'flex-end',
    position: 'relative',
    alignItems:'flex-start',
}

const cover = {
    position: 'absolute',
    width:'100px',
    height: '20px',
    background:'#054834',
    fontSize:'12px',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    marginTop:'5px',
    left: '0px',
    color:'#fff'
}

export default DailyRecordSales;