import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';
import { useDispatch, useSelector } from 'react-redux';
import Sales from '../Modals/DailySales/sales';
import { useState } from 'react';
import swal from 'sweetalert';
import DailySalesService from '../../services/DailySales';
import { bulkReports } from '../../store/actions/dailySales';

const ProductBalance = (props) => { 

    const {sales} = useSelector(state => state.dailySalesReducer.bulkReports);
    const dispatch = useDispatch();
    const currentDate = useSelector(state => state.dailySalesReducer.currentDate);
    const user = useSelector(state => state.authReducer.user);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);

    const product = sales.filter(data => data.productType === props.type);
    const [openEdit, setOpenEdit] = useState(false);
    const [oneRecord, setOneRecord] = useState({});

    const resolveUserID = () => {
        if(user.userType === "superAdmin" || user.userType === "admin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const rate = (row, type) => {
        if(type === "PMS") return row.PMSSellingPrice;
        if(type === "AGO") return row.AGOSellingPrice;
        if(type === "DPK") return row.DPKSellingPrice;
    }

    const amount = (row, type) => {
        const diff = Number(row.closingMeter) - Number(row.openingMeter);

        if(type === "PMS") return row.PMSSellingPrice*diff;
        if(type === "AGO") return row.AGOSellingPrice*diff;
        if(type === "DPK") return row.DPKSellingPrice*diff;
    }

    const ProductRow = ({data}) => {

        const openEditModal = (data) => {
            setOneRecord(data);
            setOpenEdit(true);
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
                    DailySalesService.deleteSales({id: data._id, type:'sales'}).then(data => {
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
                <div style={ins} className="cells">{data.openingMeter}</div>
                <div style={ins} className="cells">{data.closingMeter}</div>
                <div style={ins} className="cells">{Number(data.closingMeter) - Number(data.openingMeter)}</div>
                <div style={ins} className="cells">{rate(data, props.type)}</div>
                <div style={ins} className="cells">{amount(data, props.type)}</div>
                <div style={ins} className="cells">
                    <img onClick={()=>{openEditModal(data)}} style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                    <img onClick={() => { deleteRecord(data)}} style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                </div>
            </div>
        )
    }

    return(
        <div className="initial_balance_container">
           {openEdit && <Sales data={oneRecord} open={openEdit} close={setOpenEdit} />}
            <div className="product_balance_header">
                <div className="cells">{props.type}</div>
                <div className="cells">Opening</div>
                <div className="cells">Closing</div>
                <div className="cells">Differences</div>
                <div className="cells">Rate</div>
                <div className="cells">Amount</div>
                <div className="cells">Action</div>
            </div>

            {
                product?.length === 0?
                <div>No records</div>:
                product.map((item, index) => {
                    return(
                        <ProductRow key={index} data={item} />
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

export default ProductBalance;