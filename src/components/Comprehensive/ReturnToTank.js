import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import DailySalesService from '../../services/DailySales';
import { bulkReports } from '../../store/actions/dailySales';
import { useState } from 'react';
import UpdateReturnToTank from '../Modals/DailySales/returnToTank';

const ReturnToTank = () => { 

    const {rtVolumes} = useSelector(state => state.dailySalesReducer.bulkReports);
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

    const rate = (data) => {
        if(data.productType === "PMS") return data.PMSPrice;
        if(data.productType === "AGO") return data.AGOPrice;
        if(data.productType === "DPK") return data.DPKPrice;
    }

    const amount = (data, type) => {
        if(type === "PMS") return data.PMSPrice*data.rtLitre;
        if(type === "AGO") return data.AGOPrice*data.rtLitre;
        if(type === "DPK") return data.DPKPrice*data.rtLitre;
    }

    const RTRows = ({data}) => {

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
                    DailySalesService.deleteSales({id: data._id, type:'rt'}).then(data => {
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

        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">{data.pumpName}</div>
                <div style={ins} className="cells">{data.tankName}</div>
                <div style={ins} className="cells">{data.productType}</div>
                <div style={ins} className="cells">{data.rtLitre}</div>
                <div style={ins} className="cells">{rate(data)}</div>
                <div style={ins} className="cells">{amount(data, data.productType)}</div>
                <div style={ins} className="cells">
                    <img onClick={()=>{updateRecord(data)}} style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                    <img onClick={()=>{deleteRecord(data)}} style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                </div>
            </div>
        )
    }

    return(
        <div className="initial_balance_container">
            {openEdit && <UpdateReturnToTank data={oneRecord} open={openEdit} close={setOpenEdit} />}
            <div className="product_balance_header">
                <div className="cells">Pump Name</div>
                <div className="cells">Tank Name</div>
                <div className="cells">Product</div>
                <div className="cells">Quantity</div>
                <div className="cells">Rate</div>
                <div className="cells">Amount</div>
                <div className="cells">Action</div>
            </div>

            {
                rtVolumes?.length === 0?
                <div>No records</div>:
                rtVolumes.map((item, index) => {
                    return(
                        <RTRows key={index} data={item} />
                    )
                })
            }
        </div>
    )
}

const ins = {
    background: '#EDEDEDB2',
    color:'#000',
    fontWeight:'600'
}

export default ReturnToTank;