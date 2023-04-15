import { useSelector } from 'react-redux';
import ApproximateDecimal from '../common/approx';

const BalanceCF = () => {

    const {balances} = useSelector(state => state.dailySalesReducer.bulkReports);

    const BalanceCF = ({data, type, sn}) => {

        return(
            <div style={{marginTop:'5px'}} className="product_balance_header">
                <div style={ins} className="cells">{sn}</div>
                <div style={ins} className="cells">{type} </div>
                <div style={ins} className="cells">{data === null? "0": ApproximateDecimal(data.balanceCF)}</div>
            </div>
        )
    }

    const MobileBalanceCF = ({data, type, sn}) => {
        return(
            <div className='supply_card'>
    
                <div style={rows}>
                    <div style={{width:'100%'}}>
                        <div style={title}>{sn}</div>
                        <div style={label}>S/N</div>
                    </div>

                    <div style={{width:'100%'}}>
                        <div style={title}>{type}</div>
                        <div style={label}>Product</div>
                    </div>
                </div>
    
                <div style={rows}>
                    <div style={{width:'100%'}}>
                        <div style={title}>{data === null? "0": ApproximateDecimal(data.balanceCF)}</div>
                        <div style={label}>Quantity</div>
                    </div>

                    <div style={{width:'100%'}}></div>
                </div>
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
                            <MobileBalanceCF data={balances?.pms} type={'PMS'} sn={'1'} />
                            <MobileBalanceCF data={balances?.ago} type={'AGO'} sn={'2'} />
                            <MobileBalanceCF data={balances?.dpk} type={'DPK'} sn={'3'} />
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

export default BalanceCF;