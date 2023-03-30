import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';
import { useSelector } from 'react-redux';

const ReturnToTank = () => { 

    const {rtVolumes} = useSelector(state => state.dailySalesReducer.bulkReports);

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
        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">{data.pumpName}</div>
                <div style={ins} className="cells">{data.tankName}</div>
                <div style={ins} className="cells">{data.productType}</div>
                <div style={ins} className="cells">{data.rtLitre}</div>
                <div style={ins} className="cells">{rate(data)}</div>
                <div style={ins} className="cells">{amount(data, data.productType)}</div>
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