import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';
import { useSelector } from 'react-redux';

const InitialBalance = () => {

    const {balances, supply} = useSelector(state => state.dailySalesReducer.bulkReports);
    // console.log(balances, "hhhhhhhhh")

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
                    <div className="b_child">{props.data === null? "0": props.data.balanceCF}</div>
                </div>
                <div style={ins} className="initial_supply">
                    <div style={{marginRight:'5px'}} className="b_child">{props.type}</div>
                    <div style={{marginRight:'5px'}} className="b_child">{getInit(props).quantity}</div>
                    <div style={{marginRight:'5px'}} className="b_child">{getInit(props).shortage}</div>
                    <div className="b_child">{getInit(props).overage}</div>
                </div>
                <div style={ins} className="B_forward">
                    <div style={{marginRight:'5px'}} className="b_child">{props.type}</div>
                    <div className="b_child">{props.data === null? "0": (Number(props.data.balanceCF) + Number(getInit(props).quantity))}</div>
                </div>
                <div style={ins} className="initial_action">
                    <div className="b_child">
                        <img style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                        <img style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                    </div>
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

    return(
        <div style={{width:'100%'}}>
            <div className="initial_balance_container">
                <div className="header_balance_container">
                    <div className="B_forward">Balance B/Forward</div>
                    <div className="initial_supply">&nbsp; &nbsp; Supply</div>
                    <div className="B_forward">Available Balance</div>
                    <div className="initial_action">Action</div>
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
                        <div className="b_child">Overage</div>
                    </div>
                    <div style={ins} className="B_forward">
                        <div style={{marginRight:'5px'}} className="b_child">Product Type</div>
                        <div className="b_child">Litre Qty</div>
                    </div>
                    <div style={ins} className="initial_action">
                        <div className="b_child">Edit/del</div>
                    </div>
                </div>

                <InitialRows data = {balances.pms} type = {'PMS'} />
                <InitialRows data = {balances.ago} type = {'AGO'} />
                <InitialRows data = {balances.dpk} type = {'DPK'} />
            </div>

            <div className="initial_balance_container_mobile">
                {/* Balance Brought forward */}
                <div className='mobile_header'>
                    &nbsp;&nbsp;&nbsp; Balance B/Forward
                </div>
                <div className='balance_mobile_detail'>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances.pms === null? "0": balances.pms.balanceCF}</div>
                        <div className='mobile_sm'>PMS</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances.ago === null? "0": balances.ago.balanceCF}</div>
                        <div className='mobile_sm'>AGO</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances.dpk === null? "0": balances.dpk.balanceCF}</div>
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
                            <SupplyCard color={"#06805B"} type={"PMS"} />
                            <SupplyCard color={"#FFA010"} type={"AGO"} />
                            <SupplyCard color={"#525252"} type={"DPK"} />
                        </div>
                    </div>
                </div>


                {/* Balance carried forward */}
                <div className='mobile_header'>
                    &nbsp;&nbsp;&nbsp; Available Balance
                </div>
                <div className='balance_mobile_detail'>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances.pms === null? "0": (Number(balances.pms.balanceCF) + Number(getInit({data: balances.pms, type: "PMS"}).quantity))}</div>
                        <div className='mobile_sm'>PMS</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances.ago === null? "0": (Number(balances.ago.balanceCF) + Number(getInit({data: balances.ago, type: "AGO"}).quantity))}</div>
                        <div className='mobile_sm'>AGO</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>{balances.dpk === null? "0": (Number(balances.dpk.balanceCF) + Number(getInit({data: balances.ago, type: "DPK"}).quantity))}</div>
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

export default InitialBalance;
