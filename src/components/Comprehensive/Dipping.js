import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import DailySalesService from '../../services/DailySales';
import { bulkReports } from '../../store/actions/dailySales';
import UpdateDipping from '../Modals/DailySales/Dipping';
import { useState } from 'react';
import ApproximateDecimal from '../common/approx';

const Dipping = () => {

    const {dipping, sales} = useSelector(state => state.dailySalesReducer.bulkReports);

    const dispatch = useDispatch();
    const currentDate = useSelector(state => state.dailySalesReducer.currentDate);
    const user = useSelector(state => state.authReducer.user);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);

    const [openEdit, setOpenEdit] = useState(false);
    const [oneRecord, setOneRecord] = useState({});

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
        return user.permission?.dailySales[e];
    }

    const updateRecord = (data) => {
        setOpenEdit(true);
        setOneRecord(data);
    }

    const deleteRecord = (data) => {
        swal({
            title: "Alert!",
            text: "Are you sure you want to delete this record?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                DailySalesService.deleteSales({id: data._id, type: "dipping"}).then(data => {
                    getAndAnalyzeDailySales();
                }).then(()=>{
                    swal("Success", "Record deleted successfully", "success");
                });
            }
        });
    }

    const getAndAnalyzeDailySales = () => {
        const salesPayload = {
            organisationID: resolveUserID().id,
            outletID: oneStationData._id,
            onLoad: currentDate === ""? true: false,
            selectedDate: currentDate
        }

        DailySalesService.getDailySalesDataAndAnalyze(salesPayload).then(data => {
            dispatch(bulkReports(data.dailyRecords));
        });
    }

    const afterSales = (tank) => {
        const returnTank = sales.filter(data => data.tankID === tank.tankID);

        if(returnTank.length === 0){
            return ApproximateDecimal(tank.dipping);

        }else{
            return ApproximateDecimal(returnTank[0].afterSales);
        }
    }

    const difference = (current, dipping) => {
        const diff = Number(dipping.replace(/[^0-9.]/g, '')) - Number(current.replace(/[^0-9.]/g, ''));
        return ApproximateDecimal(diff);
    }

    const DippingRow = (props) => {

        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">{props.index + 1}</div>
                <div style={ins} className="cells">{props.data.tankName}</div>
                <div style={ins} className="cells">{props.data.productType}</div>
                <div style={ins} className="cells">{afterSales(props.data)}</div>
                <div style={ins} className="cells">{ApproximateDecimal(props.data.dipping)}</div>
                <div style={ins} className="cells">{difference(afterSales(props.data), props.data.dipping)}</div>
                {getPerm('17') &&
                    <div style={ins} className="cells">
                        <img onClick={()=>{updateRecord(props.data)}} style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                        <img onClick={()=>{deleteRecord(props.data)}} style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                    </div>
                }
            </div>
        )
    }

    const MobileDippingRow = ({data}) => {
        return(
            <div className='supply_card'>
    
                <div style={rows}>
                    <div style={{width:'100%'}}>
                        <div style={title}>{data.tankName}</div>
                        <div style={label}>Tank Name</div>
                    </div>

                    <div style={{width:'100%'}}>
                        <div style={title}>{data.productType}</div>
                        <div style={label}>Product</div>
                    </div>
                </div>
    
                <div style={rows}>
                    <div style={{width:'100%'}}>
                        <div style={title}>{afterSales(data)}</div>
                        <div style={label}>Computed Level</div>
                    </div>

                    <div style={{width:'100%'}}>
                    <div style={title}>{ApproximateDecimal(data.dipping)}</div>
                        <div style={label}>Dipping</div>
                    </div>
                </div>

                <div style={rows}>
                    <div style={{width:'100%'}}>
                        <div style={title}>{difference(afterSales(data), data.dipping)}</div>
                        <div style={label}>Difference</div>
                    </div>

                    <div style={{width:'100%'}}>
                        <div style={title}>
                            {getPerm("13") &&
                                <div className="cells">
                                    <img onClick={()=>{updateRecord(data)}} style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                                    <img onClick={() => { deleteRecord(data)}} style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                                </div>
                            }
                        </div>
                        <div style={label}>Action</div>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div style={{width:'100%'}}>
             <div className="initial_balance_container">
                {openEdit && <UpdateDipping data={oneRecord} open={openEdit} close={setOpenEdit} />}
                <div className="product_balance_header">
                    <div className="cells">S/N</div>
                    <div className="cells">Tank Name</div>
                    <div className="cells">Product</div>
                    <div className="cells">Computed Level</div>
                    <div className="cells">Dipping</div>
                    <div className="cells">Difference</div>
                    {getPerm('17') && <div className="cells">Action</div>}
                </div>

                {
                    dipping.length === 0?
                    <div>No records </div>:
                    dipping.map((item, index) => {
                        return(
                            <DippingRow key={index} data={item} index={index} />
                        )
                    })
                }
            </div>

            <div className="initial_balance_container_mobile">
                {/* Supply records */}
                <div className='mobile_header'>
                    &nbsp;&nbsp;&nbsp; Dipping
                </div>
                <div style={{marginBottom:'20px', marginTop:'10px'}} className='balance_mobile_detail'>
                    <div className='sups'>
                        <div className='slide'>
                            {
                                dipping.length === 0?
                                <div>No records </div>:
                                dipping.map((item, index) => {
                                    return(
                                        <MobileDippingRow key={index} data={item} index={index} />
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ins = {
    background: '#EDEDEDB2',
    color:'#000',
    fontWeight:'600'
}

const rows = {
    width:'90%',
    height:'auto',
    marginTop:'20px',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between'
}

const title = {
    fontSize:'12px',
    fontWeight:'500',
    fontFamily:'Poppins',
    lineHeight:'30px',
    color:'#515151'
}

const label = {
    fontSize:'11px',
    fontWeight:'500',
    fontFamily:'Poppins',
    color:'#07956A'
}

export default Dipping;