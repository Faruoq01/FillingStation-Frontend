import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';
import { useSelector } from 'react-redux';

const LPOReport = () => {

    const {lpo} = useSelector(state => state.dailySalesReducer.bulkReports);

    const rate = (row, type) => {
        if(type === "PMS") return row.PMSRate;
        if(type === "AGO") return row.AGORate;
        if(type === "DPK") return row.DPKRate;
    }

    const amount = (row, type) => {
        if(type === "PMS") return row.PMSRate*row.lpoLitre;
        if(type === "AGO") return row.AGORate*row.lpoLitre;
        if(type === "DPK") return row.DPKRate*row.lpoLitre;
    }

    const LPORows = (props) => {
        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">{props.index + 1}</div>
                <div style={{...ins, width:'150%'}} className="cells">{props.data.accountName}</div>
                <div style={ins} className="cells">{props.data.productType}</div>
                <div style={ins} className="cells">{props.data.truckNo}</div>
                <div style={ins} className="cells">{props.data.lpoLitre}</div>
                <div style={ins} className="cells">{rate(props.data, props.data.productType)}</div>
                <div style={ins} className="cells">{amount(props.data, props.data.productType)}</div>
                <div style={ins} className="cells">
                    <img style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                    <img style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                </div>
            </div>
        )
    }

    return(
        <div className="initial_balance_container">
            <div className="product_balance_header">
                <div className="cells">S/N</div>
                <div style={{width:'150%'}} className="cells">Account Name</div>
                <div className="cells">Product</div>
                <div className="cells">Truck No</div>
                <div className="cells">Quantity</div>
                <div className="cells">Rate</div>
                <div className="cells">Amount</div>
                <div className="cells">Action</div>
            </div>

            {
                lpo?.length === 0?
                <div>No records</div>:
                lpo.map((item, index) => {
                    return(
                        <LPORows key={index} data={item} index={index} />
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

export default LPOReport;