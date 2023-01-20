import React, {useRef} from 'react';
import Modal from '@mui/material/Modal';
import { useEffect } from 'react';
import { useState } from 'react';
import { ThreeDots } from  'react-loader-spinner';
import { useSelector } from 'react-redux';
import DPKDailySales from '../DailySales/DPKDailySales';
import AGODailySales from '../DailySales/AGODailySales';
import PMSDailySales from '../DailySales/PMSDailySales';


const mediaMatch = window.matchMedia('(max-width: 1000px)');

const LeftTableView = () => {

    return(
        <div style={columnHead1}>
            <div style={header1}>
                <span style={{marginLeft:'10px'}}>Balance B/Forward</span>
            </div>
            <div style={rowCont}>
                <div style={rows}>
                    <div style={cell}>Product Type</div>
                    <div style={{...cell, marginRight:'0px'}}>Litre Qty</div>
                </div>

                <div style={rows}>
                    <div style={{...cell, color:'#06805B', fontSize:'11px'}} className='cell'>PMS</div>
                    <div style={{...cell, marginRight:'0px', fontSize:'11px'}} className='cell'>4,234.00</div>
                </div>

                <div style={rows}>
                    <div style={{...cell, color:'#06805B', fontSize:'11px'}} className='cell'>AGO</div>
                    <div style={{...cell, marginRight:'0px', fontSize:'11px'}} className='cell'>4,234.00</div>
                </div>

                <div style={rows}>
                    <div style={{...cell, color:'#06805B', fontSize:'11px'}} className='cell'>DPK</div>
                    <div style={{...cell, marginRight:'0px', fontSize:'11px'}} className='cell'>4,234.00</div>
                </div>
            </div>
        </div>
    )
}

const MiddleTableView = () => {
    return(
        <div style={columnHead2}>
            <div style={header2}>
                <span style={{marginLeft:'10px'}}>Supply</span>
            </div>
            <div style={rowCont}>
                <div style={rows}>
                    <div style={cell}>Product Type</div>
                    <div style={cell}>Truck No</div>
                    <div style={cell}>Litre Qty</div>
                    <div style={cell}>Transportation</div>
                    <div style={{...cell, marginRight:'0px'}}>Shortage</div>
                </div>

                <div style={rows}>
                    <div style={{...cell, color:'#06805B', fontSize:'11px'}} >PMS</div>
                    <div style={{...cell, fontSize:'11px'}} >Truck No</div>
                    <div style={{...cell, fontSize:'11px'}} >Litre Qty</div>
                    <div style={{...cell, fontSize:'11px'}} ></div>
                    <div style={{...cell, marginRight:'0px', fontSize:'11px'}} >Shortage</div>
                </div>

                <div style={rows}>
                    <div style={{...cell, color:'#06805B', fontSize:'11px'}}>AGO</div>
                    <div style={{...cell, fontSize:'11px'}}>Truck No</div>
                    <div style={{...cell, fontSize:'11px'}}>Litre Qty</div>
                    <div style={{...cell, fontSize:'11px'}}></div>
                    <div style={{...cell, marginRight:'0px', fontSize:'11px'}}>Shortage</div>
                </div>

                <div style={rows}>
                    <div style={{...cell, color:'#06805B', fontSize:'11px'}}>AGO</div>
                    <div style={{...cell, fontSize:'11px'}}>Truck No</div>
                    <div style={{...cell, fontSize:'11px'}}>Litre Qty</div>
                    <div style={{...cell, fontSize:'11px'}}></div>
                    <div style={{...cell, marginRight:'0px', fontSize:'11px'}}>Shortage</div>
                </div>
            </div>
        </div>
    )
}

const RightTableView = () => {
    return(
        <div style={{...columnHead1, marginRight:'0px', marginLeft:'5px'}}>
            <div style={header1}>
                <span style={{marginLeft:'10px'}}>Available Balance</span>
            </div>
            <div style={rowCont}>
                <div style={rowCont}>
                    <div style={rows}>
                        <div style={cell}>Product Type</div>
                        <div style={{...cell, marginRight:'0px'}}>Litre Qty</div>
                    </div>

                    <div style={rows}>
                        <div style={{...cell, color:'#06805B', fontSize:'11px'}} >PMS</div>
                        <div style={{...cell, marginRight:'0px', fontSize:'11px'}} >4,234.00</div>
                    </div>

                    <div style={rows}>
                        <div style={{...cell, color:'#06805B', fontSize:'11px'}} >AGO</div>
                        <div style={{...cell, marginRight:'0px', fontSize:'11px'}} >4,234.00</div>
                    </div>

                    <div style={rows}>
                        <div style={{...cell, color:'#06805B', fontSize:'11px'}}>DPK</div>
                        <div style={{...cell, marginRight:'0px', fontSize:'11px'}}>4,234.00</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const LPODailySales = () => {
    return(
        <div>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}>LPO</div>
            <div style={mainSales}>
                <div style={inner}>
                    <div style={tableHeads}>
                        <div style={col}>S/N</div>
                        <div style={col}>Amount Name</div>
                        <div style={col}>Products</div>
                        <div style={col}>Truck No</div>
                        <div style={col}>Litre (Qty)</div>
                        <div style={col}>Rate</div>
                        <div style={{...col, marginRight:'0px'}}>Amount</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>1</div>
                        <div style={col2}>Opening</div>
                        <div style={col2}>Closing</div>
                        <div style={col2}>Difference</div>
                        <div style={col2}>LPO</div>
                        <div style={col2}>Rate</div>
                        <div style={{...col2, marginRight:'0px'}} >Amount</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>1</div>
                        <div style={col2}>Opening</div>
                        <div style={col2}>Closing</div>
                        <div style={col2}>Difference</div>
                        <div style={col2}>LPO</div>
                        <div style={col2}>Rate</div>
                        <div style={{...col2, marginRight:'0px'}} >Amount</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>1</div>
                        <div style={col2}>Opening</div>
                        <div style={col2}>Closing</div>
                        <div style={col2}>Difference</div>
                        <div style={col2}>LPO</div>
                        <div style={col2}>Rate</div>
                        <div style={{...col2, marginRight:'0px'}} >Amount</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={{...col2, background: "transparent"}} ></div>
                        <div style={{...col2, background: "transparent"}}></div>
                        <div style={{...col2, background: "transparent"}}></div>
                        <div style={{...col2, background: "transparent"}}></div>
                        <div style={{...col2, background: "transparent"}}></div>
                        <div style={col2}>Total</div>
                        <div style={{...col2, marginRight:'0px'}}>435, 000</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ExpensesDailySales = () => {
    return(
        <div>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}>Expenses</div>
            <div style={{...mainSales, width:'350px'}}>
                <div style={inner}>
                    <div style={tableHeads}>
                        <div style={col}>S/N</div>
                        <div style={col}>Expense Name</div>
                        <div style={{...col, marginRight:'0px'}} >Amount</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>1</div>
                        <div style={col2}>Rate</div>
                        <div style={{...col2, marginRight:'0px'}}>Amount</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>2</div>
                        <div style={col2}>Rate</div>
                        <div style={{...col2, marginRight:'0px'}}>Amount</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>3</div>
                        <div style={col2}>Rate</div>
                        <div style={{...col2, marginRight:'0px'}}>Amount</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={{...col2, background: "transparent"}}></div>
                        <div style={col2}>Total</div>
                        <div style={{...col2, marginRight:'0px'}}>435, 000</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ExpensesSummary = () => {
    return(
        <div>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}></div>
            <div style={{...mainSales, width:'350px'}}>
                <div style={inner}>
                    <div style={tableHeads}>
                        <div style={{...col, width:'70%', display:'flex', justifyContent:'flex-start'}}>
                            <span style={{marginLeft:'10px'}}>Total Amount of sales (NGN)</span>
                        </div>
                        <div style={{...col, marginRight:'0px', width:'30%', background:'#EDEDED', color:'#000'}}>Amount</div>
                    </div>

                    <div style={{...tableHeads, marginTop:'5px'}}>
                        <div style={{...col, width:'70%', display:'flex', justifyContent:'flex-start'}}>
                            <span style={{marginLeft:'10px'}}>Total Amount of Expenses (NGN)</span>
                        </div>
                        <div style={{...col, marginRight:'0px', width:'30%', background:'#EDEDED', color:'#000'}}>Amount</div>
                    </div>

                    <div style={{...tableHeads2, marginTop:'5px'}}>
                        <div style={{...col, width:'70%', display:'flex', justifyContent:'flex-end'}}>
                            <span style={{marginRight:'20px'}}>Total</span>
                        </div>
                        <div style={{...col2, marginRight:'0px', width:'30%'}}>Amount</div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const PaymentDailySales = () => {
    return(
        <div>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}>Payments</div>
            <div style={{...mainSales, width:'350px'}}>
                <div style={inner}>
                    <div style={tableHeads}>
                        <div style={{...col, marginRight:'5px', width:'50%', background:'#EDEDED', color:'#000'}}>Bank Name</div>
                        <div style={{...col, width:'50%', display:'flex', justifyContent:'flex-start'}}>
                            <span style={{marginLeft:'10px'}}>Wema Bank</span>
                        </div>
                    </div>

                    <div style={{...tableHeads, marginTop:'5px'}}>
                        <div style={{...col, marginRight:'5px', width:'50%', background:'#EDEDED', color:'#000'}}>Teller No</div>
                        <div style={{...col, width:'50%', display:'flex', justifyContent:'flex-start'}}>
                            <span style={{marginLeft:'10px'}}>892783876564</span>
                        </div>
                    </div>

                    <div style={{...tableHeads, marginTop:'5px'}}>
                        <div style={{...col, marginRight:'5px', width:'50%', background:'#EDEDED', color:'#000'}}>Teller</div>
                        <div style={{...col, width:'50%', display:'flex', justifyContent:'flex-start'}}>
                            <span style={{marginLeft:'10px'}}>25,000</span>
                        </div>
                    </div>

                    <div style={{...tableHeads, marginTop:'5px'}}>
                        <div style={{...col, marginRight:'5px', width:'50%', background:'#EDEDED', color:'#000'}}>POS</div>
                        <div style={{...col, width:'50%', display:'flex', justifyContent:'flex-start'}}>
                            <span style={{marginLeft:'10px'}}>250,000</span>
                        </div>
                    </div>

                    <div style={{...tableHeads, marginTop:'5px'}}>
                        <div style={{...col, marginRight:'5px', width:'50%', background:'#EDEDED', color:'#000'}}>Teller No</div>
                        <div style={{...col, width:'50%', display:'flex', background:'#EDEDED', color:'#000', justifyContent:'flex-start'}}>
                            <span style={{marginLeft:'10px'}}>892783876564</span>
                        </div>
                    </div>

                    <div style={{...tableHeads, marginTop:'5px'}}>
                        <div style={{...col, marginRight:'5px', width:'50%', background:'#EDEDED', color:'#000'}}>Teller No</div>
                        <div style={{...col, width:'50%', display:'flex', background:'#EDEDED', color:'#000', justifyContent:'flex-start'}}>
                            <span style={{marginLeft:'10px'}}>892783876564</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ProductDailySales = () => {
    return(
        <div>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}>
                Product Balance Carried Forward
            </div>
            <div style={{...mainSales, width:'350px'}}>
                <div style={inner}>
                    <div style={tableHeads}>
                        <div style={col}>Product Type</div>
                        <div style={col}>Litre (Qty)</div>
                        <div style={{...col, marginRight:'0px'}}>Confirmed by</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>PMS</div>
                        <div style={col2}>10,000</div>
                        <div style={{...col2, marginRight:'0px'}}></div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>AGO</div>
                        <div style={col2}>10,000</div>
                        <div style={{...col2, marginRight:'0px'}}></div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>DPK</div>
                        <div style={col2}>10,000</div>
                        <div style={{...col2, marginRight:'0px'}}></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DippingDailySales = () => {
    return(
        <div style={{width:'100%'}}>
            <div style={{width:'100%', textAlign:'left', marginBottom:'10px', color:'#06805B', fontSize:'12px', fontWeight:'900'}}>
                Dipping
            </div>
            <div style={{...mainSales, width:'100%'}}>
                <div style={inner}>
                    <div style={tableHeads}>
                        <div style={col}>Product Type</div>
                        <div style={col} className='col'>PMS</div>
                        <div style={col}>AGO</div>
                        <div style={{...col, marginRight:'0px'}} >DPK</div>
                    </div>
                    
                    <div style={tableHeads2}>
                        <div style={col2}>Pump 1</div>
                        <div style={col2}>10,000</div>
                        <div style={col2}>12,000</div>
                        <div style={{...col2, marginRight:'0px'}}>5,000</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>Pump 2</div>
                        <div style={col2}>10,000</div>
                        <div style={col2}>12,000</div>
                        <div style={{...col2, marginRight:'0px'}}>5,000</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>Pump 3</div>
                        <div style={col2}>10,000</div>
                        <div style={col2}>12,000</div>
                        <div style={{...col2, marginRight:'0px'}}>5,000</div>
                    </div>

                    <div style={tableHeads2}>
                        <div style={col2}>Total</div>
                        <div style={col2}>10,000</div>
                        <div style={col2}>12,000</div>
                        <div style={{...col2, marginRight:'0px'}}>5,000</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ComprehensiveReports = (props) => {
    const printTable = useRef();
    const iframe = useRef();
    const [dom, setDom] = useState('');
    const [loading, setLoading] = useState(false);
    const dailySales = useSelector(state => state.dailySalesReducer.dailySales);
    const lpoRecords = useSelector(state => state.dailySalesReducer.lpoRecords);
    const paymentRecords = useSelector(state => state.dailySalesReducer.paymentRecords);
    const bulkReports = useSelector(state => state.dailySalesReducer.bulkReports);

    const handleClose = () => {
        props.close(false);
    }

    const setTheDomHere = () => {
        setDom(printTable.current);
        setLoading(false);
    }

    useEffect(()=>{
        setLoading(true);
        setTimeout(()=>{
            setTheDomHere();
        }, 3000)
    },[])

    const Table = () => {
        return(
            <div ref={printTable} style={tableContainer}>
                <div style={main}>
                    <div style={left}>
                        <div style={innerMain}>
                            <div style={tableCont}>
                                <LeftTableView supply={props.forwardBalance?.supply} data={props.tanks} sales={props.forwardBalance?.sales} />
                                <MiddleTableView data={props.forwardBalance?.supply} />
                                <RightTableView supply={props.forwardBalance?.supply} data={props.tanks} sales={props.forwardBalance?.sales} />
                            </div>

                            <PMSDailySales rep={false} />
                            <AGODailySales rep={false} />
                            <DPKDailySales rep={false} />
                            <LPODailySales data={lpoRecords} />
                            <ExpensesDailySales data = {paymentRecords.expenses} />

                            <div style={paym}>
                                <div style={pleft}>
                                    <ExpensesSummary expenses={paymentRecords.expenses} sales={dailySales} />
                                </div>
                                <div style={pleft}>
                                    <PaymentDailySales data={paymentRecords} />
                                </div>
                            </div>

                            <div style={paym2}>
                                <div style={pleft}>
                                    <ProductDailySales supply={props.forwardBalance?.supply} data={props.tanks} sales={props.forwardBalance?.sales} />
                                </div>
                                <div style={pleft}>
                                    <DippingDailySales data={bulkReports?.dipping} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const handlePrint = () => {
        let wspFrame = iframe.current.contentWindow;
        wspFrame.focus();
        wspFrame.print();
    }

    return(
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
            <div style={contain}>
                <div style={{position:'absolute', zIndex:'10', visibility:'hidden'}}>
                    <Table />
                </div>
                <div style={frame}>
                    <iframe ref={iframe} srcDoc={dom.outerHTML} title='documents' height="100%" width="100%" />
                    <div style={{marginTop:'10px'}}>
                        <button onClick={()=>{handlePrint()}} style={prints}>Print</button>
                        <button onClick={handleClose} style={closes}>close</button>
                    </div>
                </div>
                <ThreeDots 
                    height="60" 
                    width="50" 
                    radius="9"
                    color="#076146" 
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{position:'absolute', zIndex:'30'}}
                    wrapperClassName=""
                    visible={loading}
                />
            </div>
        </Modal>
    )
}

const pleft = {
    width: '50%',
    height: 'auto'
}

const paym = {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
}

const paym2 = {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
}

const mainSales = {
    width: '100%',
    height: 'auto',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: '30px',
    marginTop:'20px'
}

const inner = {
    width: '100%',
    height: 'auto',
}

const tableHeads = {
    width: '100%',
    height: '30px',
    display: 'flex',
    flexDirection: 'row',
}

const col = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(266.48deg, #525252 8.34%, #525252 52.9%)',
    borderRadius: '4px',
    color: '#fff',
    marginRight: '5px',
    fontSize: '12px',
    fontFamily: 'Nunito-Regular',
}

const tableHeads2 = {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
}

const col2 = {
    width: '100%',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#EDEDED',
    borderRadius: '4px',
    color: '#000',
    marginRight: '5px',
    fontSize: '12px',
    fontFamily: 'Nunito-Regular',
    marginTop: '5px',
}

const header2 ={
    width: '100%',
    height: '30px',
    background: 'linear-gradient(266.48deg, #525252 8.34%, #525252 52.9%)',
    borderRadius: '4px',
    color: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: '12px',
}

const columnHead2 = {
    width: '60%',
    height: '100%',
    borderRadius: '4px',
}

const cell = {
    width: '100%',
    height: '30px',
    backgroundColor: '#EDEDED',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: '5px',
    borderRadius: '5px',
}

const rows = {
    width: '100%',
    height: '30px',
    marginTop: '5px',
    display: 'flex',
    flexDirection: 'row',
}

const rowCont = {
    width: '100%',
    fontSize: '12px',
    color: '#000',
}

const header1 = {
    width: '100%',
    height: '30px',
    background: 'linear-gradient(266.48deg, #525252 8.34%, #525252 52.9%)',
    borderRadius: '4px',
    color: '#fff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: '12px',
}

const columnHead1 = {
    width: '20%',
    height: '100%',
    borderRadius: '4px',
    marginRight: '5px',
}

const main = {
    width: '100%',
    marginTop: '10px',
    display: 'flex',
    flexDirection: 'row',
}

const left = {
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F5F199',
}

const innerMain = {
    margin: '10px',
    width: '100%',
    marginTop: '10px',
}

const tableCont = {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
}

const prints = {
    width:'100px',
    height:'30px',
    background:'green',
    color:'#fff',
    marginRight:'20px'
}

const closes = {
    width:'100px',
    height:'30px',
    background:'red',
    color:'#fff'
}

const frame = {
    width: mediaMatch.matches? '96%': '1000px',
    height:'600px',
    background:'#fff',
    position:'absolute',
    zIndex:'20',
}

const contain = {
    width:'100%', 
    height:'100vh', 
    display:'flex', 
    justifyContent:'center', 
    alignItems:'center', 
    position:'relative',
}

const tableContainer = {
    width: '100%',
    minWidth: '980px',
    height: 'auto',
    margintop: '20px',
}

export default ComprehensiveReports;