import { useSelector } from 'react-redux';

const SupplyCard = (props) => {
    return(
        <div className='supply_card'>

            <div style={rows}>
                <div>
                    <div style={title}>138KW-ABJ</div>
                    <div style={label}>Truck No</div>
                </div>
                <div>
                <div style={title}>13,028.03</div>
                    <div style={label}>Litre Qty</div>
                </div>
            </div>

            <div style={rows}>
                <div>
                    <div style={title}>**********</div>
                    <div style={label}>Shortage</div>
                </div>
                <div>
                <div style={title}>13,028.03</div>
                    <div style={label}>Litre Qty</div>
                </div>
            </div>
        </div>
    )
}

const BalanceCF = () => {

    const {balances} = useSelector(state => state.dailySalesReducer.bulkReports);

    const BalanceCF = ({data, type, sn}) => {

        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">{sn}</div>
                <div style={ins} className="cells">{type} </div>
                <div style={ins} className="cells">{data === null? "0": data.balanceCF}</div>
                <div style={ins} className="cells">Said</div>
            </div>
        )
    }

    return(
        <div style={{width:'100%'}}>
            <div style={{maxWidth: '700px'}} className="initial_balance_container">
                <div className="product_balance_header">
                    <div className="cells">S/N</div>
                    <div className="cells">Product Type</div>
                    <div className="cells">Quantity</div>
                    <div className="cells">Confirmed By</div>
                </div>

                <BalanceCF data={balances?.pms} type={'PMS'} sn={'1'} />
                <BalanceCF data={balances?.ago} type={'AGO'} sn={'2'} />
                <BalanceCF data={balances?.dpk} type={'DPK'} sn={'3'} />
            </div>

            <div className="initial_balance_container_mobile">
                {/* Supply records */}
                <div className='mobile_header'>
                    &nbsp;&nbsp;&nbsp; Balance Carried Forward
                </div>
                <div style={{marginBottom:'20px', marginTop:'10px'}} className='balance_mobile_detail'>
                    <div className='sups'>
                        <div className='slide'>
                            <SupplyCard />
                            <SupplyCard />
                            <SupplyCard />
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
    fontSize:'14px',
    fontWeight:'500',
    fontFamily:'Poppins',
    lineHeight:'30px',
    color:'#515151'
}

const label = {
    fontSize:'12px',
    fontWeight:'500',
    fontFamily:'Poppins',
    color:'#07956A'
}

export default BalanceCF;