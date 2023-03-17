import React, {useRef, useEffect} from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useSelector } from 'react-redux';

const TankComponent = (props) => {

    const canvas = useRef();
    const fuel = useRef();
    const cummulativeTotals = useSelector(state => state.dailySalesReducer.cummulative);

    useEffect(()=>{
        createTankCanvas(cummulativeTotals.totalDPK, cummulativeTotals.DPKTankCapacity, cummulativeTotals.DPKDeadStock);
    }, [cummulativeTotals.DPKDeadStock, cummulativeTotals.DPKTankCapacity, cummulativeTotals.totalDPK]);
    
    const createTankCanvas = (level, capacity, deadstock) => {

        let dpi = window.devicePixelRatio;
        let step = Math.floor((capacity - deadstock)/10);
        let current = (300*level)/capacity;

        const drawLine = (height, label) => {
            ctx.beginPath();
            ctx.moveTo(50*dpi, (height + 3)*dpi);
            ctx.lineWidth = 1*dpi;
            ctx.lineTo(70*dpi, (height + 3)*dpi);
            ctx.stroke();

            ctx.fillStyle = "#000";
            ctx.font = `${10*dpi}px Arial`;
            ctx.fillText(label, 10*dpi, (height + 8)*dpi);
        }

        const drawSmallLine = (height) => {
            ctx.beginPath();
            ctx.moveTo(65*dpi, (height + 3)*dpi);
            ctx.lineWidth = 1;
            ctx.lineTo(70*dpi, (height + 3)*dpi);
            ctx.stroke();
        }

        const ctx = canvas.current.getContext('2d');

        let style_height = +getComputedStyle(canvas.current).getPropertyValue("height").slice(0, -2);
        let style_width = +getComputedStyle(canvas.current).getPropertyValue("width").slice(0, -2);

        canvas.current.setAttribute('height', style_height * dpi);
        canvas.current.setAttribute('width', style_width * dpi);

        ctx.beginPath();
        ctx.strokeRect(70*dpi, 0*dpi, 78*dpi, 300*dpi);

        let label = capacity;
        for(let i= 0; i < 300; i = i + 30){
            drawLine(i, label);
            label = label - step;
        }

        for(let i= 0; i < 300; i = i + 6){
            drawSmallLine(i);
        }

        ctx.fillStyle= "#35393E";

        ctx.fillStyle= "#FFA010";
        fuel.current.style.marginLeft = `70px`;
        fuel.current.style.marginTop = `${300 - current}px`;
        fuel.current.style.width = `79px`;
        fuel.current.style.height = `${current}px`;
        fuel.current.style.background = "#35393E";
    }

    const ApproximateDecimal = (data) => {
        const changeToString = String(data);

        const findIndex = changeToString.indexOf(".");
        if(findIndex === -1){
            return changeToString;
        }

        const splitDataByDecimal = changeToString.split('.');
        const splitFractions = splitDataByDecimal[1].split('');
        if(splitFractions.length <= 2){
            return changeToString;
        }
        
        let fractionBuilder = splitFractions[0];
        if(Number(splitFractions[2] > 5)){
            const tenths = Number(splitFractions[1]) + 1;
            fractionBuilder = fractionBuilder.concat("", tenths);

        }else{
            fractionBuilder = fractionBuilder.concat(splitFractions[1]);
        }

        const approxWithComma = splitDataByDecimal[0].match(/.{1,3}/g).join(',');
        const approxNumber = approxWithComma.concat(".", fractionBuilder);

        return approxNumber;
    }

    return(
        <div className='canvases'>
            <Tooltip title={`${ApproximateDecimal(cummulativeTotals.totalDPK)} Litres`} followCursor>
                <div>
                    <div className='fuel-container'>
                        <canvas style={{width:'150px', height:'300px'}} ref={canvas}></canvas>
                    </div>
                    <div ref={fuel} className='fuel'></div>
                </div>
            </Tooltip>
        </div>
    )
}

export default TankComponent;