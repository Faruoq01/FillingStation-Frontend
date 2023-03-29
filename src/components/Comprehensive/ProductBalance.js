import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';
import { useSelector } from 'react-redux';

const ProductBalance = (props) => { 

    const {sales} = useSelector(state => state.dailySalesReducer.bulkReports);

    const product = sales.filter(data => data.productType === props.type);

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
        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">{data.pumpName}</div>
                <div style={ins} className="cells">{data.openingMeter}</div>
                <div style={ins} className="cells">{data.closingMeter}</div>
                <div style={ins} className="cells">{Number(data.closingMeter) - Number(data.openingMeter)}</div>
                <div style={ins} className="cells">{rate(data, props.type)}</div>
                <div style={ins} className="cells">{amount(data, props.type)}</div>
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