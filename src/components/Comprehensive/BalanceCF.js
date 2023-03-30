import { useSelector } from 'react-redux';

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

            <div className="initial_balance_container_mobile"></div>
        </div>
    )
}

const ins = {
    background: '#EDEDEDB2',
    color:'#000',
    fontWeight:'600'
}

export default BalanceCF;