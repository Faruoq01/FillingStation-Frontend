import React from 'react';
import close from '../../assets/close.png';
import Modal from '@mui/material/Modal';
import '../../styles/lpo.scss';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import RecordSalesService from '../../services/DailyRecordSales';
import swal from 'sweetalert';
import { passRecordSales } from '../../store/actions/dailySales';
import {useHistory} from 'react-router-dom'

function DoublyLinkedListNode(data){
    this.data = data;
    this.next = null;
    this.prev = null;
    this.data.ago = [];
    this.data.pms = [];
    this.data.dpk = [];
    this.data.selectedPumps = [];
    this.data.selectedTanks = [];
    this.data.lpo = [];
    this.data.supply = [];
    this.data.expenses = [];
    this.data.pay = [];
    this.data.dipping = [];
}

function DoublyLinkedList(){
    this.head = null;
    this.currentDate = null;
    this.size = 0;
    this.page = 1;

    this.isEmpty = function(){
        return this.size === 0;
    }

    this.addNode = function(value){
        if(this.head === null){
            this.head = new DoublyLinkedListNode(value);
        }else{
            var temp = new DoublyLinkedListNode(value);
            temp.next = this.head;
            this.head.prev = temp;
            this.head = temp;
        }
        this.size++;
    }

    this.nextPage = function(){
        this.head = this.head.next
    }

    this.previousPage = function(){
        this.head = this.head.prev
    }
}

const SummaryRecord = (props) => {

    const handleClose = () => props.close(false);
    const history = useHistory();
    const dispatch = useDispatch();
    const records = useSelector(state => state.recordsReducer.load);
    const currentDate = useSelector(state => state.recordsReducer.currentDate);
    console.log(records, "summary")


    const saveRecordSales = () => {
        props.clops(true);
        RecordSalesService.saveRecordSales({load: records, currentDate: currentDate}).then(data => {
            swal("Success!", "Daily sales recorded successfully!", "success");
        }).then(()=>{
            const list = new DoublyLinkedList();
            for(let i=6; i > 0 ; i--){
                list.addNode({
                    currentPage: String(i),
                    payload: [],
                });
            }
            dispatch(passRecordSales(list));
            history.push("/home/daily-sales");
            props.clops(false);
        })
    }

    return(
        <Modal
            open={props.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{display:'flex', justifyContent:'center', alignItems:'center'}}
        >
                <div className='modalContainer2'>
                    <div className='inner'>
                        <div className='head'>
                            <div className='head-text'>Summary Daily Sales</div>
                            <img onClick={handleClose} style={{width:'18px', height:'18px'}} src={close} alt={'icon'} />
                        </div>

                       <div className='middleDiv' style={inner}>
                            <div style={conts}>
                                <div style={nums}>1</div>
                                <div style={texts}>Pump updates and Sales</div>
                            </div>
                            {
                                records['1']?.length === 0?
                                <div style={men}>No records</div>:
                                records['1']?.map((data, index)=> {
                                    return(
                                        <div key={index} style={tankContainer}>
                                            <div style={tankProps}>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px', fontSize:'14px', fontWeight:'bold', color:'#FFA010'}}>{data.productType} ({data.tankName})</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Tank Capacity: {data.tankCapacity} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Current Level: {data.currentLevel} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Total sales: {data.sales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Level Before Sales: {data.beforeSales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Level After Sales: {data.afterSales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                            </div>

                                            {
                                                data?.pumps?.length === 0?
                                                <div style={men}>No records</div>:
                                                data?.pumps?.map((item, index) => {
                                                    return(
                                                        <div key={index} style={{...wide, width:'96%'}}>
                                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {item.pumpName}</div>
                                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {item.sales} Ltrs</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }

                            <div style={conts}>
                                <div style={nums}>2</div>
                                <div style={texts}>Return to Tank</div>
                            </div>
                            {
                                records['2']?.length === 0?
                                <div style={men}>No records</div>:
                                records['2']?.map((data, index)=> {
                                    return(
                                        <div key={index} style={tankContainer}>
                                            <div style={tankProps}>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px', fontSize:'14px', fontWeight:'bold', color:'#FFA010'}}>{data.productType} ({data.tankName})</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Tank Capacity: {data.tankCapacity} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Current Level: {data.currentLevel} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Total sales: {data.sales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Level Before Sales: {data.beforeSales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Level After Sales: {data.afterSales} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                                <div style={line}>
                                                    <span style={{marginLeft:'10px'}}>Total Return to tank: {data.RTlitre} ltrs</span>
                                                    <span style={{marginRight:'10px'}}></span>
                                                </div>
                                            </div>

                                            {
                                                data?.pumps?.length === 0?
                                                <div style={men}>No records</div>:
                                                data?.pumps?.map((item, index) => {
                                                    return(
                                                        <div key={index} style={{...wide, width:'96%'}}>
                                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {item.pumpName}</div>
                                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {item.RTlitre} Ltrs</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    )
                                })
                            }

                            <div style={conts}>
                                <div style={nums}>3</div>
                                <div style={texts}>LPO (Corporate Sales)</div>
                            </div>
                            {
                                records['3']?.length === 0?
                                <div style={men}>No records</div>:
                                records['3']?.map((data, index) => {
                                    return(
                                        <div key={index} style={wide}>
                                            <div style={firstBox}>&nbsp;&nbsp;&nbsp; {data.truckNo}</div>
                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {data.lpoLitre} Ltrs</div>
                                        </div>
                                    )
                                })
                            }

                            <div style={conts}>
                                <div style={nums}>4</div>
                                <div style={texts}>Expenses</div>
                            </div>
                            {
                                records['4']?.length === 0?
                                <div style={men}>No records</div>:
                                records['4']?.map((data, index) => {
                                    return(
                                        <div key={index} style={wide}>
                                            <div style={firstBox}>&nbsp;&nbsp;&nbsp; {data.expenseName}</div>
                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {data.expenseAmount} Ltrs</div>
                                        </div>
                                    )
                                })
                            }

                            <div style={conts}>
                                <div style={nums}>5</div>
                                <div style={texts}>Payments</div>
                            </div>
                            {
                                records['5']?.length === 0?
                                <div style={men}>No records</div>:
                                records['5']?.map((data, index) => {
                                    return(
                                        <div key={index} style={wide}>
                                            <div style={firstBox}>&nbsp;&nbsp;&nbsp; {data.bankName}</div>
                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {data.amountPaid} Ltrs</div>
                                        </div>
                                    )
                                })
                            }

                            <div style={conts}>
                                <div style={nums}>6</div>
                                <div style={texts}>Dipping</div>
                            </div>
                            {
                                records['6']?.length === 0?
                                <div style={men}>No records</div>:
                                records['6']?.map((data, index) => {
                                    return(
                                        <div key={index} style={wide}>
                                            <div style={firstBox}>&nbsp;&nbsp;&nbsp; {data.tankName}</div>
                                            <div style={secondBox}>&nbsp;&nbsp;&nbsp; {data.dippingValue} Ltrs</div>
                                        </div>
                                    )
                                })
                            }
                       </div>

                       <div style={{...add, justifyContent:'flex-end'}}>
                            <Button sx={{
                                width:'100px', 
                                height:'30px',  
                                background: '#427BBE',
                                borderRadius: '3px',
                                fontSize:'11px',
                                marginTop:'10px',
                                '&:hover': {
                                    backgroundColor: '#427BBE'
                                }
                                }}  
                                onClick={saveRecordSales}
                                variant="contained"> 
                                Save
                            </Button>
                        </div>
                        
                    </div>
                </div>
        </Modal>
    )
}

const line = {
    width:'100%',
    fontSize:'12px',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    height:'30px',
    background:'#525252',
    alignItems:'center',
    color:'#fff',
    fontWeight:'600'
}

const tankProps = {
    width:'96%',
    height:'auto',
    borderRadius:'5px',
    overflow:'hidden'
}

const tankContainer = {
    width:'100%',
    height:'auto',
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    background:'#E6F5F1',
    paddingTop:'10px',
    paddingBottom:'10px'
}

const add = {
    width:'100%',
    display: 'flex',
    flexDirection:'row',
    justifyContent:'flex-start',
}

const men ={
    fontSize:'12px',
    fontWeight:'bold',
    marginBottom:'20px'
}

const texts = {
    fontSize:'14px',
    color:'#06805B',
    fontWeight:'bold'
}

const firstBox = {
    width: '40%',
    height:'30px',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    background:'#d7d7d7',
    fontSize:'12px',
    color:'#000',
    fontWeight:'700'
}

const secondBox = {
    width: '60%',
    height:'30px',
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    background:'#d7d7d7',
    fontSize:'12px',
    fontWeight:'bold'
}

const nums = {
    width: '20px',
    height: '20px',
    display:'flex',
    justifyContent:'center',
    alightItems:'center',
    background:'#525252',
    borderRadius:'20px',
    color:'#fff',
    fontSize:'12px',
    marginRight: '10px'
}

const conts = {
    width:'100%',
    display:'flex',
    flexDirection:'row',
    alightItems:'center',
    marginTop:'30px',
    marginBottom:'5px',
    justifyContent:'flex-start'
}

const wide = {
    width:'100%',
    height:'30px',
    display:'flex',
    marginTop:'5px',
    flexDirection:'row',
    alignItems:'center'
}

const inner = {
    width:'100%',
    height:'510px',
    overflowY: 'scroll',
    display:'flex',
    flexDirection:'column',
    alignItems:'center'
}

export default SummaryRecord;