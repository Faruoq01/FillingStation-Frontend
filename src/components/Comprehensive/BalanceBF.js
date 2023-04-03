import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const InitialBalance = () => {

    const {balances, supply, sales} = useSelector(state => state.dailySalesReducer.bulkReports);
    // console.log(balances, "hhhhhhhhh")

    const getSales = (type) => {
        const totalSales = sales.filter(data => data.productType === type).reduce((accum, current) => {
            return Number(accum) + Number(current.sales);
        }, 0);

        return totalSales;
    }

    const getInit = (props) => {

        const quantity = supply.filter(data => data.productType === props.type).reduce((accum, current) => {
            return Number(accum) + Number(current.quantity);
        }, 0);

        const shortage = supply.filter(data => data.productType === props.type).reduce((accum, current) => {
            if(current.shortage === "None"){
                return 0;
            }else{
                return Number(accum) + Number(current.quantity);
            }
        }, 0);

        const overage = supply.filter(data => data.productType === props.type).reduce((accum, current) => {
            if(current.overage === "None"){
                return 0;
            }else{
                return Number(accum) + Number(current.quantity);
            }
        }, 0);

        return {quantity: quantity, shortage: shortage, overage: overage}
    }

    const InitialRows = (props) => {

        return(
            <div style={{marginTop:'5px'}} className="header_balance_container">
                <div style={ins} className="B_forward">
                    <div style={{marginRight:'5px'}} className="b_child">{props.type}</div>
                    <div className="b_child">{props.data === null? "0": Number(props.data.balanceCF) + Number(getSales(props.type))}</div>
                </div>
                <div style={ins} className="initial_supply">
                    <div style={{marginRight:'5px'}} className="b_child">{props.type}</div>
                    <div style={{marginRight:'5px'}} className="b_child">{getInit(props).quantity}</div>
                    <div style={{marginRight:'5px'}} className="b_child">{getInit(props).shortage}</div>
                    <div style={{marginRight:'5px'}} className="b_child">{getInit(props).overage}</div>
                    <div className="b_child"><Link>View</Link></div>
                </div>
                <div style={ins} className="B_forward">
                    <div style={{marginRight:'5px'}} className="b_child">{props.type}</div>
                    <div className="b_child">{props.data === null? "0": (Number(props.data.balanceCF) + Number(getInit(props).quantity) + Number(getSales(props.type)))}</div>
                </div>
            </div>
        )
    }

    const SupplyCard = (props) => {
        return(
            <div className='supply_card'>
                <div style={tag}>
                    <div style={{...tag_name, background: props.color}}>{props.type}</div>
                </div>

                <div style={rows}>
                    <div>
                        <div style={title}>{getInit(props).quantity}</div>
                        <div style={label}>Quantity</div>
                    </div>
                    <div>
                    <div style={title}>{getInit(props).shortage}</div>
                        <div style={label}>Shortage</div>
                    </div>
                </div>

                <div style={rows}>
                    <div>
                        <div style={title}>{getInit(props).shortage}</div>
                        <div style={label}>Overage</div>
                    </div>
                    <div>
                    <div style={title}><Link>View</Link></div>
                        <div style={label}></div>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div style={{width:'100%'}}>
            <div className="initial_balance_container">
                <div className="header_balance_container">
                    <div className="B_forward">Balance B/Forward</div>
                    <div className="initial_supply">&nbsp; &nbsp; Supply</div>
                    <div className="B_forward">Available Balance</div>
                </div>

                <div style={{marginTop:'5px'}} className="header_balance_container">
                    <div style={ins} className="B_forward">
                        <div style={{marginRight:'5px'}} className="b_child">Product Type</div>
                        <div className="b_child">Litre Qty</div>
                    </div>
                    <div style={ins} className="initial_supply">
                        <div style={{marginRight:'5px'}} className="b_child">Type</div>
                        <div style={{marginRight:'5px'}} className="b_child">Quantity</div>
                        <div style={{marginRight:'5px'}} className="b_child">Shortage</div>
                        <div style={{marginRight:'5px'}} className="b_child">Overage</div>
                        <div className="b_child">Details</div>
                    </div>
                    <div style={ins} className="B_forward">
                        <div style={{marginRight:'5px'}} className="b_child">Product Type</div>
                        <div className="b_child">Litre Qty</div>
                    </div>
                </div>

                <InitialRows data = {balances?.pms} type = {'PMS'} />
                <InitialRows data = {balances?.ago} type = {'AGO'} />
                <InitialRows data = {balances?.dpk} type = {'DPK'} />
            </div>

            <div className="initial_balance_container_mobile">
                {/* Balance Brought forward */}
                <div className='mobile_header'>
                    &nbsp;&nbsp;&nbsp; Balance B/Forward
                </div>
                <div className='balance_mobile_detail'>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances?.pms === null? "0": Number(balances?.pms?.balanceCF) + Number(getSales('PMS'))}</div>
                        <div className='mobile_sm'>PMS</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances?.ago === null? "0": Number(balances?.ago?.balanceCF) + Number(getSales('AGO'))}</div>
                        <div className='mobile_sm'>AGO</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances?.dpk === null? "0": Number(balances?.dpk?.balanceCF) + Number(getSales('DPK'))}</div>
                        <div className='mobile_sm'>DPK</div>
                    </div>
                </div>
                
                {/* Supply records */}
                <div style={{marginTop:'20px'}} className='mobile_header'>
                    &nbsp;&nbsp;&nbsp; Supply
                </div>
                <div style={{marginBottom:'20px', marginTop:'10px'}} className='balance_mobile_detail'>
                    <div className='sups'>
                        <div className='slide'>
                            <SupplyCard color={"#06805B"} type={"PMS"} data = {balances?.pms} />
                            <SupplyCard color={"#FFA010"} type={"AGO"} data = {balances?.ago}  />
                            <SupplyCard color={"#525252"} type={"DPK"} data = {balances?.dpk}  />
                        </div>
                    </div>
                </div>


                {/* Balance carried forward */}
                <div className='mobile_header'>
                    &nbsp;&nbsp;&nbsp; Available Balance
                </div>
                <div className='balance_mobile_detail'>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances?.pms === null? "0": (Number(balances?.pms?.balanceCF) + Number(getInit({data: balances?.pms, type: "PMS"}).quantity))}</div>
                        <div className='mobile_sm'>PMS</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances?.ago === null? "0": (Number(balances?.ago?.balanceCF) + Number(getInit({data: balances?.ago, type: "AGO"}).quantity))}</div>
                        <div className='mobile_sm'>AGO</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances?.dpk === null? "0": (Number(balances?.dpk?.balanceCF) + Number(getInit({data: balances?.ago, type: "DPK"}).quantity))}</div>
                        <div className='mobile_sm'>DPK</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ins = {
    background: 'transparent',
    color:'#000'
}

const tag = {
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-start'
}

const tag_name = {
    width:'70px',
    height:'35px',
    background:'#06805B',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    fontSize:'12px'
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

export default InitialBalance;
