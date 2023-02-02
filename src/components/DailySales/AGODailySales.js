import React from 'react';
import '../../styles/dailySales.scss';
import { useSelector } from 'react-redux';

const mobile = window.matchMedia('(max-width: 950px)');

const AGODailySales = (props) => {

    const dailySales = useSelector(state => state.dailySalesReducer.dailySales);

    const getMasterRows = () => {
        const newRows = [];

        if(dailySales?.AGO?.sales){
            for(let row of dailySales?.AGO?.sales){

                const findID = newRows.findIndex(data => data.pumpID === row.pumpID);
                
                if(findID === -1){
                    const filterUniqueRows = dailySales.AGO.sales.filter(data => data.pumpID === row.pumpID);
                    const filterLPORows = dailySales.AGO.lpo.filter(data => data.pumpID === row.pumpID);
                    const filterRTRows = dailySales.AGO.rt.filter(data => data.pumpID === row.pumpID);
    
                    /*#########################
                        Pump totalizer reading
                    ##########################*/
                    const openingMeter = filterUniqueRows.reduce((accum, current) => {
                        return Number(accum) + Number(current.openingMeter);
                    }, 0);
    
                    const closingMeter = filterUniqueRows.reduce((accum, current) => {
                        return Number(accum) + Number(current.closingMeter);
                    }, 0);
    
                    /*#########################
                        PMS sales in litres
                    ##########################*/
                    const totalRate = filterUniqueRows.reduce((accum, current) => {
                        return Number(accum) + Number(current.sales);
                    }, 0);
    
                    const totalLPO = filterLPORows.reduce((accum, current) => {
                        return Number(accum) + Number(current.lpoLitre);
                    }, 0);
    
                    const totalRT = filterRTRows.reduce((accum, current) => {
                        return Number(accum) + Number(current.rtLitre);
                    }, 0);
    
                    /*#########################
                        PMS sales in cash price
                    ##########################*/
                    const totalPrice = filterUniqueRows.reduce((accum, current) => {
                        return Number(accum) + Number(current.sales)*Number(current.PMSSellingPrice);
                    }, 0);
    
                    const totalLPOPrice = filterLPORows.reduce((accum, current) => {
                        return Number(accum) + Number(current.lpoLitre)*Number(current.PMSRate);
                    }, 0);
    
                    const totalRTPrice = filterRTRows.reduce((accum, current) => {
                        return Number(accum) + Number(current.rtLitre)*Number(current.PMSPrice);
                    }, 0);
    
                    const uniqueRow = {
                        id: row.pumpID,
                        pumpName: row.pumpName, 
                        openingMeter: openingMeter, 
                        closingMeter: closingMeter, 
                        difference: closingMeter - openingMeter,
                        PMSRate: totalRate/filterUniqueRows.length,
                        lpoLitre: totalLPO,
                        rtLitre: totalRT,
                        amount: totalPrice - totalLPOPrice + totalRTPrice,
                    }
    
                    newRows.push(uniqueRow);
                }
            }
        }

        const uniq = Array.from(new Set(newRows.map(s => s.id)))
        .map(id => {
            return {
                pumpName: newRows.find(s => s.id === id).pumpName,
                openingMeter: newRows.find(s => s.id === id).openingMeter, 
                closingMeter: newRows.find(s => s.id === id).closingMeter, 
                difference: newRows.find(s => s.id === id).difference,
                PMSRate: newRows.find(s => s.id === id).PMSRate,
                lpoLitre: newRows.find(s => s.id === id).lpoLitre,
                rtLitre: newRows.find(s => s.id === id).rtLitre,
                amount: newRows.find(s => s.id === id).amount,
            }
        })

        return uniq;
    }

    const getTotalSums = () => {
        const rows = getMasterRows();

        const diff = rows.reduce((accum, current) => {
            return accum + current.difference;
        }, 0);

        const lpo = rows.reduce((accum, current) => {
            return accum + current.lpoLitre;
        }, 0);

        const rate = rows.reduce((accum, current) => {
            return accum + current.PMSRate;
        }, 0);

        const rt = rows.reduce((accum, current) => {
            return accum + current.rtLitre;
        }, 0);

        const amount = rows.reduce((accum, current) => {
            return accum + current.amount;
        }, 0);

        const totals = {
            difference: diff,
            lpo: lpo,
            rate: rate,
            rt: rt,
            amount: amount
        }

        return totals;
    }

    return(
        <div style={{width: props.rep === false? '100%': '96%', overflowX: mobile.matches && 'scroll'}}>
            <div style={sales}>
                <div style={top}>
                    <div style={tex}>Total Amount Of Sales (AGO)</div>
                    <div></div>
                </div>

                <div style={mainSales}>
                    <div style={inner}>
                        <div style={tableHeads}>
                            <div style={col}>Pump Name</div>
                            <div style={col}>Opening</div>
                            <div style={col}>Closing</div>
                            <div style={col}>Difference</div>
                            <div style={col}>LPO</div>
                            <div style={col}>Rate</div>
                            <div style={col}>R/T</div>
                            <div style={{...col, marginRight:'0px'}}>Amount</div>
                        </div>

                        {
                            getMasterRows().length === 0?
                            <div style={dats}> No Data </div>:
                            getMasterRows().map((data, index) => {
                                return(
                                    <div key={index} style={tableHeads2}>
                                        <div style={cols}>{data.pumpName}</div>
                                        <div style={cols}>{data.openingMeter}</div>
                                        <div style={cols}>{data.closingMeter}</div>
                                        <div style={cols}>{data.difference}</div>
                                        <div style={cols}>{data.lpoLitre}</div>
                                        <div style={cols}>{data.PMSRate}</div>
                                        <div style={cols}>{data.rtLitre}</div>
                                        <div style={{...cols, marginRight:'0px'}}>
                                            {data.amount}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        {getMasterRows().length === 0 ||
                            <div style={tableHeads2}>
                                <div style={{...cols, background: "transparent"}}></div>
                                <div style={{...cols, background: "transparent"}}></div>
                                <div style={cols}>Total</div>
                                <div style={cols}>{getTotalSums().difference}</div>
                                <div style={cols}>{getTotalSums().lpo}</div>
                                <div style={cols}></div>
                                <div style={cols}>{getTotalSums().rt}</div>
                                <div style={{...cols, marginRight:'0px'}}>{getTotalSums().amount}</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const sales = {
    minWidth:'950px',
    width: '100%',
    height: 'auto',
    marginTop: '10px',
}

const top = {
    width: '100%',
    height: '35px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
}

const tex = {
    width:'100%', 
    textAlign:'left', 
    marginBottom:'10px', 
    color:'#06805B', 
    fontSize:'12px', 
    fontWeight:'900'
}

const mainSales = {
    width: '100%',
    height: 'auto',
    background: 'rgba(230, 245, 241, 0.6)',
    borderRadius: '5px',
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start'
}

const inner ={
    width: '98%',
    height: 'auto',
    marginTop: '10px',
    marginBottom: '10px',
}

const tableHeads = {
    width: '100%',
    height: '30px',
    display: 'flex',
    flexDirection: 'row'
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
}

const tableHeads2 = {
    width: '100%',
    height: 'auto',
    display: 'flex',
    flexDirection: 'row'
}

const cols = {
    width: '100%',
    height:'30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#EDEDEDB2',
    borderRadius: '4px',
    color: '#000',
    marginRight: '5px',
    fontSize: '12px',
    marginTop: '5px'
}

const dats = {
    marginTop:'20px',
    fontSize:'14px',
    fontWeight:'bold',
}

export default AGODailySales;