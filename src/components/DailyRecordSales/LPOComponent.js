import { Button, Radio } from "@mui/material"
import { useCallback, useState } from "react";
import photo from '../../assets/photo.png';
import upload from '../../assets/upload.png';
import cross from '../../assets/cross.png';
import { useDispatch, useSelector } from "react-redux";
import ReactCamera from "../Modals/ReactCamera";
import { useRef } from "react";
import AddIcon from '@mui/icons-material/Add';
import hr8 from '../../assets/hr8.png';
import swal from 'sweetalert';
import axios from "axios";
import config from '../../constants';
import { passRecordSales } from "../../store/actions/dailySales";
import { useEffect } from "react";

const LPOComponent = (props) => {

    const dispatch = useDispatch();
    const gallery = useRef();
    const linkedData = useSelector(state => state.dailySalesReducer.linkedData);
    const tankList = useSelector(state => state.outletReducer.tankList);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const lpos = useSelector(state => state.lpoReducer.lpo);
    const [selectedPMS, setSelectedPMS] = useState(null);
    const [selectedAGO, setSelectedAGO] = useState(null);
    const [selectedDPK, setSelectedDPK] = useState(null);
    console.log(linkedData, "linked ssssssssssss")

    // selections
    const [open, setOpen] = useState(false);

    // payload records
    const [cam, setCam] = useState(null);
    const [gall, setGall] = useState(null);
    const pumpList = useSelector(state => state.outletReducer.pumpList);
    const [productType, setProductType] = useState(null);
    const [dispenseLpo, setDispensedLPO] = useState(null);
    const [dispensedPump, setDispensedPump] = useState(null);
    const [truckNo, setTruckNo] = useState("");
    const [quantity, setQuantity] = useState("");

    const getPMSPump = useCallback(() => {
        const newList = [...pumpList];
        const pms = newList.filter(data => data.productType === "PMS");
        return pms;
    }, [pumpList]);

    const getAGOPump = useCallback(() => {
        const newList = [...pumpList];
        const ago = newList.filter(data => data.productType === "AGO");
        return ago;
    }, [pumpList]);

    const getDPKPump = useCallback(() => {
        const newList = [...pumpList];
        const dpk = newList.filter(data => data.productType === "DPK");
        return dpk;
    }, [pumpList]);

    const [pms, setPMS] = useState([]);
    const [ago, setAGO] = useState([]);
    const [dpk, setDPK] = useState([]);

    useEffect(()=>{
        setPMS(getPMSPump());
        setAGO(getAGOPump());
        setDPK(getDPKPump());
     
    }, [
        getAGOPump, 
        getDPKPump, 
        getPMSPump, 
    ]);

    const onRadioClick = (data) => {
        if(data === "PMS"){
            setProductType('PMS');
        }
        
        if(data === "AGO"){
            setProductType('AGO');
        }

        if(data === "DPK"){
            setProductType('DPK');
        }
    }

    useEffect(()=>{
        setProductType("PMS");
    },[])

    const pumpItem = (e, index, item) => {
        e.preventDefault();
        setDispensedPump(item);

        if(productType === "PMS"){
            setSelectedPMS(index);
            setSelectedAGO(null);
            setSelectedDPK(null);
        }else if(productType === "AGO"){
            setSelectedPMS(null);
            setSelectedAGO(index);
            setSelectedDPK(null);
        }else{
            setSelectedPMS(null);
            setSelectedAGO(null);
            setSelectedDPK(index);
        }
    }

    const desselect = () => {
        if(productType === "PMS"){
            setSelectedPMS("");
        }else if(productType === "AGO"){
            setSelectedAGO("")
        }else{
            setSelectedDPK("")
        }
    }

    const selectLPOAccount = (e) => {
        const value = e.target.options[e.target.options.selectedIndex].value;
        setDispensedLPO(JSON.parse(value));
    }

    const openCamera = () => {
        setOpen(true);
    }

    const openGallery = () => {
        gallery.current.click();
    }

    const pickFromGallery = (e) => {
        let file = e.target.files[0];

        const formData = new FormData();
        formData.append("file", file);
        const httpConfig = {
            headers: {
                "content-type": "multipart/form-data",
                "Authorization": "Bearer "+ localStorage.getItem('token'),
            }
        };
        const url = `${config.BASE_URL}/360-station/api/upload`;
        axios.post(url, formData, httpConfig).then((data) => {
            setGall(data.data.path);
        });
    }

    const addDetailsToList = () => {
        if(oneStationData === null) return swal("Warning!", "please select station", "info");
        if(dispensedPump === null) return swal("Warning!", "Please select lpo pump", "info");
        if(dispenseLpo === null) return swal("Warning!", "Please select lpo account", "info");
        if(truckNo === "") return swal("Warning!", "Truck no field cannot be empty", "info");
        if(quantity === "") return swal("Warning!", "Quantity field cannot be empty", "info");
        if(productType === "") return swal("Warning!", "Product type field cannot be empty", "info");

        const tank = tankList.filter(data => data._id === dispensedPump.hostTank)[0];
        if(Number(tank.currentLevel) < Number(quantity)) return swal("Warning!", "Tank capacity exceeded (current level is "+ tank.currentLevel +" Ltrs)", "info");

        const payload = {
            accountName: dispenseLpo.companyName,
            productType: productType,
            truckNo: truckNo,
            lpoLitre: quantity,
            camera: cam,
            gallery: gall,
            lpoID: dispenseLpo._id,
            pumpID: dispensedPump._id,
            tank: tank,
            PMSRate: oneStationData?.PMSPrice,
            AGORate: oneStationData?.AGOPrice,
            DPKRate: oneStationData?.AGOPrice,
            PMSCost: oneStationData?.PMSCost,
            AGOCost: oneStationData?.AGOCost,
            DPKCost: oneStationData?.DPKCost,
            outletID: oneStationData?._id,
            organizationID: oneStationData?.organisation,
        }

        const newList = {...linkedData};
        newList.head.data.payload.push(payload);
        dispatch(passRecordSales(newList));

        setGall(null);
        setCam(null);
        setTruckNo("");
        setQuantity("");
    }

    const deleteFromList = (index) => {
        const newList = {...linkedData};
        newList.head.data.payload.pop(index);
        dispatch(passRecordSales(newList));
    }

    const updateTankWithLPO = (e) => {
        setQuantity(e.target.value);

        if(dispensedPump === null){
            swal("Warning!", "Please select lpo pump", "info");
        }else{
            // update tank payload
            const newTankList = [...linkedData?.head?.prev?.data?.selectedTanks];
            console.log(newTankList, "fake tanks rt")
            const tankID = newTankList.findIndex(data => data._id === dispensedPump.hostTank);
            if(tankID !== -1){
                newTankList[tankID] = {
                    ...newTankList[tankID], 
                    pumps: linkedData?.head?.prev?.data?.selectedPumps?.filter(data => data.hostTank === newTankList[tankID]._id),
                    outlet: oneStationData,
                    fakeLevelThree: Number(newTankList[tankID].fakeLevelTwo) - Number(Number(e.target.value) < 0? 0: Number(e.target.value))
                }
                
                const newList = {...linkedData};
                newList.head.data.selectedTanks = newTankList;
                dispatch(passRecordSales(newList));
            }
        }
    }

    return(
        <div className="inner-body" style={{width:'98%', display:'flex', flexDirection: 'column', alignItems:'center'}}>
            <ReactCamera open={open} close={setOpen} setDataUri={setCam} />

            <div style={rad} className='radio'>
                <div className='rad-item'>
                    <Radio {...props}
                        sx={{
                            '&, &.Mui-checked': {
                            color: '#054834',
                            },
                        }} 
                        onClick={()=>onRadioClick("PMS")} 
                        checked={productType === 'PMS'? true: false} 
                    />
                    <div className='head-text2' style={{marginRight:'5px', fontSize:'12px'}}>PMS</div>
                </div>
                <div className='rad-item'>
                    <Radio {...props}
                        sx={{
                            '&, &.Mui-checked': {
                            color: '#054834',
                            },
                        }}
                        onClick={()=>onRadioClick("AGO")} 
                        checked={productType === 'AGO'? true: false} 
                    />
                    <div className='head-text2' style={{marginRight:'5px', fontSize:'12px'}}>AGO</div>
                </div>
                <div className='rad-item'>
                    <Radio {...props}
                        sx={{
                            '&, &.Mui-checked': {
                            color: '#054834',
                            },
                        }} 
                        onClick={()=>onRadioClick("DPK")} 
                        checked={productType === 'DPK'? true: false} 
                    />
                    <div className='head-text2' style={{marginRight:'5px', fontSize:'12px'}}>DPK</div>
                </div>
            </div>
            
            <div style={{marginTop:'10px', marginBottom:'10px'}}>Select Pump used for the day</div>
            <div style={{flexDirection:'row', justifyContent:'center'}} className='pump-list'>
                {
                    pumpList.length === 0?
                    <div style={{...box, width:'170px'}}>
                        <div style={{marginRight:'10px'}}>No pump Created</div>
                        <img style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                    </div>:
                    productType === "PMS"?
                    pms.map((data, index) => {
                        return(
                            <div key={index} >
                                {selectedPMS === index &&
                                    <div className='box'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={desselect} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                                {selectedPMS !== index &&
                                    <div className='box2'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={desselect} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                            </div>
                        )
                    }):
                    productType === "AGO"?
                    ago.map((data, index) => {
                        return(
                            <div key={index}>
                                {selectedAGO === index &&
                                    <div className='box'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={desselect} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                                {selectedAGO !== index &&
                                    <div className='box2'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={desselect} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                            </div>
                        )
                    }):
                    dpk.map((data, index) => {
                        return(
                            <div key={index} >
                                {selectedDPK === index &&
                                    <div className='box'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={desselect} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                                {selectedDPK !== index &&
                                    <div className='box2'>
                                        <p onClick={e => pumpItem(e, index, data)} style={{marginRight:'10px'}}>{data.pumpName}</p>
                                        <img onClick={desselect} style={{width:'20px', height:'20px'}} src={cross}  alt="icon"/>
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>

            <div className='inner-body'>
                <div className='left-supply'>

                    <div className='single-form'>
                        <div className='input-d'>
                            <span style={{color:'green'}}>Account Name</span>
                            <select onChange={selectLPOAccount} className='text-field'>
                                <option>Select lpo account</option>
                                {
                                    lpos.map((data, index) => {
                                        return(
                                            <option value={JSON.stringify(data)} key={index}>{data.companyName}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>

                    <div className='single-form'>
                        <div className='input-d'>
                            <span style={{color:'green'}}>Product Type</span>
                            <input defaultValue={productType} disabled className='text-field' type={'text'} />
                        </div>
                    </div>

                    <div className='single-form'>
                        <div className='input-d'>
                            <span style={{color:'green'}}>Truck No</span>
                            <input value={truckNo} onChange={e => setTruckNo(e.target.value)} className='text-field' type={'text'} />
                        </div>
                    </div>

                    <div style={{marginTop:'20px'}} className='single-form'>
                        <div className='input-d'>
                            <span style={{color:'green'}}>Quantity (Litres)</span>
                            <input value={quantity} onChange={e => {updateTankWithLPO(e)}} className='text-field' type={'text'} />
                        </div>
                    </div>

                    <div style={{marginTop:'30px'}} className='double-form'>
                        <div className='input-d'>
                            <Button 
                                variant="contained" 
                                onClick={openCamera}
                                sx={{
                                    width:'100%',
                                    height:'35px',
                                    background:'#216DB2',
                                    fontSize:'13px',
                                    borderRadius:'5px',
                                    textTransform:'capitalize',
                                    '&:hover': {
                                        backgroundColor: '#216DB2'
                                    }
                                }}
                            >
                                <img style={{width:'22px', height:'18px', marginRight:'10px'}} src={photo} alt="icon" />
                                <div>{typeof(cam) === "string"? "Image taken":<span>Take photo</span>}</div>
                            </Button>
                        </div>

                        <div className='input-d'>
                            <Button 
                                onClick={openGallery}
                                variant="contained" 
                                sx={{
                                    width:'100%',
                                    height:'35px',
                                    background:'#087B36',
                                    fontSize:'13px',
                                    borderRadius:'5px',
                                    textTransform:'capitalize',
                                    '&:hover': {
                                        backgroundColor: '#087B36'
                                    }
                                }}
                            >
                                <img style={{width:'22px', height:'18px', marginRight:'10px'}} src={upload} alt="icon" />
                                <div>{typeof(gall) === "string"? "File uploaded":<span>Upload</span>}</div>
                            </Button>
                        </div>
                    </div>

                    <div style={add}>
                        <Button sx={{
                            width:'140px', 
                            height:'30px',  
                            background: '#427BBE',
                            borderRadius: '3px',
                            fontSize:'11px',
                            '&:hover': {
                                backgroundColor: '#427BBE'
                            }
                            }}  
                            onClick={addDetailsToList}
                            variant="contained"> 
                            <AddIcon sx={{marginRight:'10px'}} /> Add to List
                        </Button>
                    </div>
                    <input onChange={pickFromGallery} ref={gallery} style={{visibility:'hidden'}} type={'file'} />
                </div>

                <div className='right-supply'>
                    <div className="table-head">
                        <div className="col">S/N</div>
                        <div className="col">Account</div>
                        <div className="col">Product</div>
                        <div className="col">Quantity</div>
                        <div className="col">Action</div>
                    </div>

                    {
                        linkedData.head?.data?.payload.length === 0?
                        <div style={{marginTop:'10px'}}>No data</div>:
                        linkedData.head?.data?.payload.map((data, index) => {
                            return(
                                <div key={index} style={{background: '#fff', marginTop:'5px'}} className="table-head">
                                    <div style={{color:'#000'}} className="col">{index + 1}</div>
                                    <div style={{color:'#000'}} className="col">{data?.accountName}</div>
                                    <div style={{color:'#000'}} className="col">{data?.productType}</div>
                                    <div style={{color:'#000'}} className="col">{data?.lpoLitre}</div>
                                    <div style={{color:'#000'}} className="col">
                                        <img 
                                            onClick={()=>{deleteFromList(index)}} 
                                            style={{width:'22px', height:'22px'}} 
                                            src={hr8} 
                                            alt="icon" 
                                        />
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

const rad = {
    display: 'flex',
    flexDirection:'row',
    justifyContent:'center'
}

const box = {
    width: '100px',
    height: '35px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#06805B',
    borderRadius: '30px',
    color: '#fff',
    fontFamily: 'Nunito-Regular',
    marginRight: '10px',
    marginTop: '10px',
}

const add = {
    width:'100%',
    display: 'flex',
    flexDirection:'row',
    justifyContent:'flex-start',
    marginTop:'30px'
}

export default LPOComponent;