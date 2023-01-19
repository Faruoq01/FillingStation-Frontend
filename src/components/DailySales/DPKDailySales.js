import React from 'react';
import '../../styles/dailySales.scss';
import { useSelector } from 'react-redux';

const DPKDailySales = (props) => {

    const dailySales = useSelector(state => state.dailySalesReducer.dailySales);

    const getMasterRows = () => {
        const newRows = [];

        for(let row of dailySales?.DPK?.sales){

            const findID = newRows.findIndex(data => data.pumpID === row.pumpID);
            
            if(findID === -1){
                const filterUniqueRows = dailySales.DPK.sales.filter(data => data.pumpID === row.pumpID);
                const filterLPORows = dailySales.DPK.lpo.filter(data => data.pumpID === row.pumpID);
                const filterRTRows = dailySales.DPK.rt.filter(data => data.pumpID === row.pumpID);

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
                    amount: totalPrice + totalLPOPrice - totalRTPrice,
                }

                newRows.push(uniqueRow);
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
        <div style={{width: props.rep === false? '100%': '96%'}}>
            <div className='sales'>
                <div className='top'>
                    <div className='tex'>Total Amount Of Sales (DPK)</div>
                    <div></div>
                </div>

                <div className='main-sales'>
                    <div className='inner'>
                        <div className='table-heads'>
                            <div className='col'>Pump Name</div>
                            <div className='col'>Opening</div>
                            <div className='col'>Closing</div>
                            <div className='col'>Difference</div>
                            <div className='col'>LPO</div>
                            <div className='col'>Rate</div>
                            <div className='col'>R/T</div>
                            <div style={{marginRight:'0px'}} className='col'>Amount</div>
                        </div>

                        {
                            getMasterRows().length === 0?
                            <div style={dats}> No Data </div>:
                            getMasterRows().map((data, index) => {
                                return(
                                    <div key={index} className='table-heads2'>
                                        <div className='col'>{data.pumpName}</div>
                                        <div className='col'>{data.openingMeter}</div>
                                        <div className='col'>{data.closingMeter + data.lpoLitre}</div>
                                        <div className='col'>{data.difference + data.lpoLitre}</div>
                                        <div className='col'>{data.lpoLitre}</div>
                                        <div className='col'>{data.PMSRate}</div>
                                        <div className='col'>{data.rtLitre}</div>
                                        <div style={{marginRight:'0px'}} className='col'>
                                            {data.amount}
                                        </div>
                                    </div>
                                )
                            })
                        }

                        {getMasterRows().length === 0 ||
                            <div className='table-heads2'>
                                <div style={{background: "transparent"}} className='col'></div>
                                <div style={{background: "transparent"}} className='col'></div>
                                <div className='col'>Total</div>
                                <div className='col'>{getTotalSums().difference}</div>
                                <div className='col'>{getTotalSums().lpo}</div>
                                <div className='col'></div>
                                <div className='col'>{getTotalSums().rt}</div>
                                <div style={{marginRight:'0px'}} className='col'>{getTotalSums().amount}</div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

const dats = {
    marginTop:'20px',
    fontSize:'14px',
    fontWeight:'bold',
    fontFamily:'Nunito-Regular'
}

export default DPKDailySales;