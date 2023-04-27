import { Button, Skeleton } from "@mui/material";
import { Line } from "react-chartjs-2";
import DashboardService from "../../services/dashboard";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { isSafari } from "react-device-detect";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const months = {
    '01' : 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'Apr',
    '05': 'May',
    '06': 'Jun',
    '07': 'Jul',
    '08': 'Aug',
    '09': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec',
}

const labels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
];

const weekLabels = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const annualLabels = [
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022',
    '2023',
    '2024',
    '2025',
    '2026',
    '2027',
];

const weeklyData = {
    labels: weekLabels,
    datasets: [
        {
            label: 'AGO',
            borderColor: '#399A19',
            data: [0, 0, 0, 0, 0, 0, 0],
        },
        {
            label: 'PMS',
            borderColor: '#FFA010',
            data: [0, 0, 0, 0, 0, 0, 0],
        },
        {
            label: 'DPK',
            borderColor: '#000',
            data: [0, 0, 0, 0, 0, 0, 0],
        }
    ]
};

const monthlyData = {
    labels: labels,
    datasets: [
        {
            label: 'AGO',
            borderColor: '#399A19',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            label: 'PMS',
            borderColor: '#FFA010',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            label: 'DPK',
            borderColor: '#000',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    ]
};

const annualData = {
    labels: annualLabels,
    datasets: [
        {
            label: 'AGO',
            borderColor: '#399A19',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            label: 'PMS',
            borderColor: '#FFA010',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        {
            label: 'DPK',
            borderColor: '#000',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        }
    ]
};

const options = {
    plugins: {
        legend: {
            display: false,
        }
    },
    maintainAspectRatio: false,
    scales: {
        x: {
            min: 0
        },
        y: {
            min: 0
        }
    }
}

const getMonthlyTotals = (day, dataList) => {
    const dates = day.createdAt.split('-');
    switch(dates[1]){
        case "01":{
            let currentValue = dataList[0];
            currentValue = currentValue + Number(day.sales);
            dataList[0] = currentValue;
            break;
        }

        case "02":{
            let currentValue = dataList[1];
            currentValue = currentValue + Number(day.sales);
            dataList[1] = currentValue;
            for(let i = 0; i < 1; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case "03":{
            let currentValue = dataList[2];
            currentValue = currentValue + Number(day.sales);
            dataList[2] = currentValue;
            for(let i = 0; i < 2; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case "04":{
            let currentValue = dataList[3];
            currentValue = currentValue + Number(day.sales);
            dataList[3] = currentValue;
            for(let i = 0; i < 3; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case "05":{
            let currentValue = dataList[4];
            currentValue = currentValue + Number(day.sales);
            dataList[4] = currentValue;
            for(let i = 0; i < 4; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case "06":{
            let currentValue = dataList[5];
            currentValue = currentValue + Number(day.sales);
            dataList[5] = currentValue;
            for(let i = 0; i < 5; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case "07":{
            let currentValue = dataList[6];
            currentValue = currentValue + Number(day.sales);
            dataList[6] = currentValue;
            for(let i = 0; i < 6; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case "08":{
            let currentValue = dataList[7];
            currentValue = currentValue + Number(day.sales);
            dataList[7] = currentValue;
            for(let i = 0; i < 7; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case "09":{
            let currentValue = dataList[8];
            currentValue = currentValue + Number(day.sales);
            dataList[8] = currentValue;
            for(let i = 0; i < 8; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case "10":{
            let currentValue = dataList[9];
            currentValue = currentValue + Number(day.sales);
            dataList[9] = currentValue;
            for(let i = 0; i < 9; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case "11":{
            let currentValue = dataList[10];
            currentValue = currentValue + Number(day.sales);
            dataList[10] = currentValue;
            for(let i = 0; i < 10; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case "12":{
            let currentValue = dataList[11];
            currentValue = currentValue + Number(day.sales);
            dataList[11] = currentValue;
            for(let i = 0; i < 11; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }
        default: {}
    }
}

const getAnnualTotals = (day, dataList, years) => {
    const dates = day.createdAt.split('-');
    
    switch(dates[0].toString()){
        case years[0].toString():{
            let currentValue = dataList[0];
            currentValue = currentValue + Number(day.sales);
            dataList[0] = currentValue;
            break;
        }

        case years[1].toString():{
            let currentValue = dataList[1];
            currentValue = currentValue + Number(day.sales);
            dataList[1] = currentValue;
            for(let i = 0; i < 1; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case years[2].toString():{
            let currentValue = dataList[2];
            currentValue = currentValue + Number(day.sales);
            dataList[2] = currentValue;
            for(let i = 0; i < 2; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case years[3].toString():{
            let currentValue = dataList[3];
            currentValue = currentValue + Number(day.sales);
            dataList[3] = currentValue;
            for(let i = 0; i < 3; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case years[4].toString():{
            let currentValue = dataList[4];
            currentValue = currentValue + Number(day.sales);
            dataList[4] = currentValue;
            for(let i = 0; i < 4; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case years[5].toString():{
            let currentValue = dataList[5];
            currentValue = currentValue + Number(day.sales);
            dataList[5] = currentValue;
            for(let i = 0; i < 5; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case years[6].toString():{
            let currentValue = dataList[6];
            currentValue = currentValue + Number(day.sales);
            dataList[6] = currentValue;
            for(let i = 0; i < 6; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case years[7].toString():{
            let currentValue = dataList[7];
            currentValue = currentValue + Number(day.sales);
            dataList[7] = currentValue;
            for(let i = 0; i < 7; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case years[8].toString():{
            let currentValue = dataList[8];
            currentValue = currentValue + Number(day.sales);
            dataList[8] = currentValue;
            for(let i = 0; i < 8; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case years[9].toString():{
            let currentValue = dataList[9];
            currentValue = currentValue + Number(day.sales);
            dataList[9] = currentValue;
            for(let i = 0; i < 9; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case years[10].toString():{
            let currentValue = dataList[10];
            currentValue = currentValue + Number(day.sales);
            dataList[10] = currentValue;
            for(let i = 0; i < 10; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }

        case years[11].toString():{
            let currentValue = dataList[11];
            currentValue = currentValue + Number(day.sales);
            dataList[11] = currentValue;
            for(let i = 0; i < 11; i++){
                if(dataList[i] === null){
                    dataList[i] = 0;
                }
            }
            break;
        }
        default: {}
    }
}

const DashboardGraph = (props) => {
    const moment = require('moment-timezone');

    const [weeklyDataSet, setWeeklyDataSet] = useState(weeklyData);
    const [monthlyDataSet, setMonthlyDataSet] = useState(monthlyData);
    const [annualDataSet, setAnnualDataSet] = useState(annualData);
    const [currentDate, setCurrentDate] = useState();
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const user = useSelector(state => state.authReducer.user);

    const [currentSelection, setCurrentSelection] = useState(0);
    const dateHandle = useRef();

    const resolveUserID = () => {
        if(user.userType === "superAdmin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const updateDate = async(e) => {

        const date = e.target.value.split('-');
        const format = `${date[2]} ${months[date[1]]} ${date[0]}`;
        setCurrentDate(format);

        const firstDayOfTheWeek = getLastSunday(e.target.value);
        const lastDayOfTheWeek = getUpcomingSunday(e.target.value);

        const payload = {
            organisation: resolveUserID().id,
            outletID: oneStationData === null? "None": oneStationData?._id,
            startRange: firstDayOfTheWeek,
            endRange: lastDayOfTheWeek
        }

        DashboardService.getWeeklyDataFromApi(payload).then(data => {
            analyseWeeklyData(data);
        })
    }

    function getUpcomingSunday(data) {
        const end = moment(data).endOf('week').format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        return end;
    }

    function getLastSunday(data) {
        const last = moment(data).startOf('week').format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        return last;
    }

    function getFirstAndLastDayOfTheYear(){
        const currentYear = new Date().getFullYear();
        const firstDay = new Date(currentYear, 0, 1).toLocaleDateString();
        const year = firstDay.split('/')[2];
    
        const firstRange =  moment([year]).format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        const secondRange = moment([year]).endOf('year').format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
    
        return {firstDay: firstRange, lastDay: secondRange};
    }

    function getYearRange(){
        const currentYear = new Date().getFullYear();
        const firstDay = new Date(currentYear, 0, 1).toLocaleDateString();
        const year = firstDay.split('/')[2];
    
        const firstRange =  moment([year]).format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
        const secondRange = moment([year]).endOf('year').format('YYYY-MM-DD HH:mm:ss').split(' ')[0];
    
        return {firstRange: firstRange, secondRange: secondRange};
    }

    const analyseWeeklyData = (data) => {
        let dataListPMS = [null, null, null, null, null, null, null];
        let dataListAGO = [null, null, null, null, null, null, null];
        let dataListDPK = [null, null, null, null, null, null, null];

        for(let day of data.sales){
            if(day.productType === "PMS"){
                const dates = new Date(day.createdAt);
                const exactDay = dates.getDay();
                dataListPMS[exactDay] = Number(day.sales);
                for(let i = 0; i < exactDay; i++){
                    if(dataListPMS[i] === null){
                        dataListPMS[i] = 0;
                    }
                }

            }else if(day.productType === "AGO"){
                const dates = new Date(day.createdAt);
                const exactDay = dates.getDay();
                dataListAGO[exactDay] = Number(day.sales);
                for(let i = 0; i < exactDay; i++){
                    if(dataListAGO[i] === null){
                        dataListAGO[i] = 0;
                    }
                }

            }else if(day.productType === "DPK"){
                const dates = new Date(day.createdAt);
                const exactDay = dates.getDay();
                dataListDPK[exactDay] = Number(day.sales);
                for(let i = 0; i < exactDay; i++){
                    if(dataListDPK[i] === null){
                        dataListDPK[i] = 0;
                    }
                }
            }
        }

        const weeklyData = {
            labels: weekLabels,
            datasets: [
                {
                    label: 'AGO',
                    borderColor: '#FFA010',
                    data: dataListAGO,
                },
                {
                    label: 'PMS',
                    borderColor: '#399A19',
                    data: dataListPMS,
                },
                {
                    label: 'DPK',
                    borderColor: '#000',
                    data: dataListDPK,
                }
            ]
        };
        setWeeklyDataSet(weeklyData);
    }

    const analyseMonthlyData = (data) => {
        const dataListPMS = [null, null, null, null, null, null, null, null, null, null, null, null];
        const dataListAGO = [null, null, null, null, null, null, null, null, null, null, null, null];
        const dataListDPK = [null, null, null, null, null, null, null, null, null, null, null, null];

        for(let day of data.sales){
            if(day.productType === "PMS"){
                getMonthlyTotals(day, dataListPMS);

            }else if(day.productType === "AGO"){
                getMonthlyTotals(day, dataListAGO);

            }else if(day.productType === "DPK"){
                getMonthlyTotals(day, dataListDPK);
            }
        }

        const monthlyData = {
            labels: labels,
            datasets: [
                {
                    label: 'AGO',
                    borderColor: '#FFA010',
                    data: dataListAGO,
                },
                {
                    label: 'PMS',
                    borderColor: '#399A19',
                    data: dataListPMS,
                },
                {
                    label: 'DPK',
                    borderColor: '#000',
                    data: dataListDPK,
                }
            ]
        };

        setMonthlyDataSet(monthlyData);
    }

    const analyseAnnualData = (data, range) => {
        const dataListPMS = [null, null, null, null, null, null, null, null, null, null, null, null, null];
        const dataListAGO = [null, null, null, null, null, null, null, null, null, null, null, null, null];
        const dataListDPK = [null, null, null, null, null, null, null, null, null, null, null, null, null];

        const years = [];
        const getTheYear = range.firstRange.split('-')[0];
        
        const firstRange = Number(getTheYear) - 5;
        const lastRangeRange = Number(getTheYear) + 5;
        console.log(firstRange, 'range')
        console.log(lastRangeRange, 'range')

        for(let i = firstRange; i <= lastRangeRange; i++){
            years.push(i);
        }

        for(let day of data.sales){
            if(day.productType === "PMS"){
                getAnnualTotals(day, dataListPMS, years);

            }else if(day.productType === "AGO"){
                getAnnualTotals(day, dataListAGO, years);

            }else if(day.productType === "DPK"){
                getAnnualTotals(day, dataListDPK, years);
            }
        }

        const annualData = {
            labels: years,
            datasets: [
                {
                    label: 'AGO',
                    borderColor: '#FFA010',
                    data: dataListAGO,
                },
                {
                    label: 'PMS',
                    borderColor: '#399A19',
                    data: dataListPMS,
                },
                {
                    label: 'DPK',
                    borderColor: '#000',
                    data: dataListDPK,
                }
            ]
        };

        setAnnualDataSet(annualData);
    }

    const getAllCurrentWeekData = useCallback(() => {
        const gate = new Date();
        const firstDayOfTheWeek = getLastSunday(gate);
        const lastDayOfTheWeek = getUpcomingSunday(gate);

        const payload = {
            organisation: resolveUserID().id,
            outletID: oneStationData === null? "None": oneStationData?._id,
            startRange: firstDayOfTheWeek,
            endRange: lastDayOfTheWeek
        }

        DashboardService.getWeeklyDataFromApi(payload).then(data => {
            analyseWeeklyData(data);
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAllWeeklyData = () => {
        const gate = new Date();
        const firstDayOfTheWeek = getLastSunday(gate);
        const lastDayOfTheWeek = getUpcomingSunday(gate);

        const payload = {
            organisation: resolveUserID().id,
            outletID: oneStationData === null? "None": oneStationData?._id,
            startRange: firstDayOfTheWeek,
            endRange: lastDayOfTheWeek
        }

        DashboardService.getWeeklyDataFromApi(payload).then(data => {
            analyseWeeklyData(data);
        })
    }

    const getAllMonthlyData = () => {
        const dateRange = getFirstAndLastDayOfTheYear();

        const payload = {
            organisation: resolveUserID().id,
            outletID: oneStationData === null? "None": oneStationData?._id,
            startRange: dateRange.firstDay,
            endRange: dateRange.lastDay
        }

        DashboardService.getMonthlyDataFromApi(payload).then(data => {
            analyseMonthlyData(data);
        });
    }

    const getAllAnnualData = () => {
        const dateRange = getYearRange();
        
        const payload = {
            organisation: resolveUserID().id,
            outletID: oneStationData === null? "None": oneStationData?._id,
            startRange: dateRange.firstRange,
            endRange: dateRange.secondRange
        }

        DashboardService.getAnnualDataFromApi(payload).then(data => {
            analyseAnnualData(data, dateRange);
        })
    }

    const switchGraphTab = (data) => {
        switch(data){
            case "week":{
                setCurrentSelection(0);
                getAllWeeklyData();
                break;
            }

            case "month":{
                setCurrentSelection(1);
                getAllMonthlyData();
                break;
            }

            case "year":{
                setCurrentSelection(2);
                getAllAnnualData();
                break;
            }
            default:{}
        }
    }

    useEffect(()=>{
        const date = new Date();
        const toString = date.toDateString();
        const [month, day, year] = toString.split(' ');
        const date2 = `${day} ${month} ${year}`;
        setCurrentDate(date2);

        getAllCurrentWeekData();
    }, [getAllCurrentWeekData]);

    const changeSalesDate = () => {
        dateHandle.current.showPicker();
    }

    return(
        <div style={{marginTop:'10px'}} className='dash-records'>
            {props.load?
                <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={450} />:
                <div className='padding-container'>
                    <div className='week'>
                        <div className='butts'>
                            <Button onClick={()=>{switchGraphTab("week")}} sx={currentSelection === 0? activeButton: inActive}  variant="contained"> Week </Button>
                            <Button onClick={()=>{switchGraphTab("month")}} sx={currentSelection === 1? activeButton: inActive}  variant="contained"> Month </Button>
                            <Button onClick={()=>{switchGraphTab("year")}} sx={currentSelection === 2? activeButton: inActive}  variant="contained"> Year </Button>
                        </div>
                        {!isSafari?
                            <div 
                                style={{
                                    height:'auto', 
                                    position:'relative',
                                    display:'flex',
                                    flexDirection:'row',
                                    alignItems:'center',
                                    justifyContent:'flex-end',
                                }}>
                                <input 
                                    onChange={updateDate} 
                                    ref={dateHandle} 
                                    style={{visibility:'hidden', marginRight:'20px'}} 
                                    type="date"
                                />
                                <Button 
                                    variant="contained" 
                                    sx={{
                                        width:'100px',
                                        height:'30px',
                                        background:'#06805B',
                                        fontSize:'11px',
                                        marginLeft:'10px',
                                        borderRadius:'0px',
                                        textTransform:'capitalize',
                                        position:'absolute',
                                        zIndex:'20',
                                        display: 'flex',
                                        flexDirection:'row',
                                        alignItems: 'center',
                                        '&:hover': {
                                            backgroundColor: '#06805B'
                                        }
                                    }}
                                    onClick={changeSalesDate}
                                >
                                    <div>{currentDate}</div>
                                </Button>
                            </div>:

                            <div style={{width:'100%', display:'flex', flexDirection:'row', justifyContent:'flex-end'}}>
                                <input onChange={updateDate} ref={dateHandle} style={{
                                    width:'170px',
                                    height:'30px',
                                    background:'#06805B',
                                    fontSize:'12px',
                                    borderRadius:'0px',
                                    textTransform:'capitalize',
                                    display:'flex',
                                    flexDirection:'row',
                                    alignItems:'center',
                                    color:'#fff'
                                }} type="date" />
                            </div>
                        }
                    </div>
                    <div className='type'>
                        <div className='single-type'>
                            <div className='color'></div>
                            <div className='name'>PMS</div>
                        </div>
                        <div style={{marginLeft:'10px'}} className='single-type'>
                            <div style={{background:'#FFA010'}} className='color'></div>
                            <div className='name'>AGO</div>
                        </div>
                        <div style={{marginLeft:'10px'}} className='single-type'>
                            <div style={{background:'#35393E'}} className='color'></div>
                            <div className='name'>DPK</div>
                        </div>
                    </div>
                    <div className='graph'>
                        <Line options={options} data={
                            currentSelection === 0? weeklyDataSet: currentSelection === 1? monthlyDataSet: currentSelection? annualDataSet: []
                        } />
                    </div>
                </div>
            }
        </div>
    )
}

const activeButton = {
    width:'50px', 
    height:'30px',  
    background: '#06805B',
    fontSize:'10px',
    borderRadius:'0px',
    '&:hover': {
        backgroundColor: '#06805B'
    }
}

const inActive = {
    width:'50px', 
    height:'30px',  
    background: '#C1CABE',
    fontSize:'10px',
    color:'#000',
    borderRadius:'0px',
    '&:hover': {
        backgroundColor: '#C1CABE'
    }
}

export default DashboardGraph;