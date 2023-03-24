import edit from '../../assets/comp/edit.png';
import del from '../../assets/comp/delete.png';

const InitialBalance = () => {

    const InitialRows = () => {
        return(
            <div style={{marginTop:'5px'}} className="header_balance_container">
                <div style={ins} className="B_forward">
                    <div style={{marginRight:'5px'}} className="b_child">PMS</div>
                    <div className="b_child">20,000</div>
                </div>
                <div style={ins} className="initial_supply">
                    <div style={{marginRight:'5px'}} className="b_child">PMS</div>
                    <div style={{marginRight:'5px'}} className="b_child">10000</div>
                    <div style={{marginRight:'5px'}} className="b_child">0</div>
                    <div className="b_child">1000</div>
                </div>
                <div style={ins} className="B_forward">
                    <div style={{marginRight:'5px'}} className="b_child">PMS</div>
                    <div className="b_child">30000</div>
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
                        <div className="b_child">
                            <img style={{width:'20px', height:'20px', marginRight:'10px'}} src={edit} alt="icon" />
                            <img style={{width:'20px', height:'20px'}} src={del} alt="icon" />
                        </div>
                    </div>
                </div>

                <InitialRows />
                <InitialRows />
                <InitialRows />
                <InitialRows />
            </div>

            <div className="initial_balance_container_mobile">
                {/* Balance Brought forward */}
                <div className='mobile_header'>
                    &nbsp;&nbsp;&nbsp; Balance B/Forward
                </div>
                <div className='balance_mobile_detail'>
                    <div className='col_1'>
                        <div className='mobile_big'>11,234:00</div>
                        <div className='mobile_sm'>PMS</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>11,234:00</div>
                        <div className='mobile_sm'>AGO</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>11,234:00</div>
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
                        <div className='mobile_big'>11,234:00</div>
                        <div className='mobile_sm'>PMS</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>11,234:00</div>
                        <div className='mobile_sm'>AGO</div>
                    </div>
                    <div className='col_1'>
                        <div className='mobile_big'>11,234:00</div>
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
