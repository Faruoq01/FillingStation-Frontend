import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert';
import DailySalesService from '../../services/DailySales';
import { bulkReports } from '../../store/actions/dailySales';

const Dipping = () => {

    const {dipping} = useSelector(state => state.dailySalesReducer.bulkReports);

    const dispatch = useDispatch();
    const currentDate = useSelector(state => state.dailySalesReducer.currentDate);
    const user = useSelector(state => state.authReducer.user);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);

    const resolveUserID = () => {
        if(user.userType === "superAdmin" || user.userType === "admin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const DippingRow = (props) => {

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
                onLoad: false,
                selectedDate: currentDate
            }
    
            DailySalesService.getDailySalesDataAndAnalyze(salesPayload).then(data => {
                dispatch(bulkReports(data.dailyRecords));
            });
        }

        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">{props.index + 1}</div>
                <div style={ins} className="cells">{props.data.tankName}</div>
                <div style={ins} className="cells">{props.data.productType}</div>
                <div style={ins} className="cells">{props.data.currentLevel}</div>
                <div style={ins} className="cells">{props.data.dipping}</div>
                <div style={ins} className="cells">
                    <img style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                    <img onClick={()=>{deleteRecord(props.data)}} style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                </div>
            </div>
        )
    }

    return(
        <div className="initial_balance_container">
            <div className="product_balance_header">
                <div className="cells">S/N</div>
                <div className="cells">Tank Name</div>
                <div className="cells">Product</div>
                <div className="cells">Current Level</div>
                <div className="cells">Dipping</div>
                <div className="cells">Action</div>
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
    )
}

const ins = {
    background: '#EDEDEDB2',
    color:'#000',
    fontWeight:'600'
}

export default Dipping;