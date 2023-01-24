import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useState } from 'react';
import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Skeleton } from '@mui/material';
import { useSelector } from 'react-redux';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const monthlyData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#06805B',
      },
      {
        label: 'Dataset 2',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#108CFF',
      },
    ],
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
            grid: {
                display: false,
            }
        },
        y: {
            grid: {
                display: false,
            }
        }
    }
}

const getMonthlyTotals = (exp, expenses) => {
    const dates = exp.createdAt.split('-');
    switch(dates[1]){
        case "01":{
            let currentValue = expenses[0];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[0] = currentValue;
            break;
        }

        case "02":{
            let currentValue = expenses[1];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[1] = currentValue;
            break;
        }

        case "03":{
            let currentValue = expenses[2];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[2] = currentValue;
            break;
        }

        case "04":{
            let currentValue = expenses[3];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[3] = currentValue;
            break;
        }

        case "05":{
            let currentValue = expenses[4];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[4] = currentValue;
            break;
        }

        case "06":{
            let currentValue = expenses[5];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[5] = currentValue;
            break;
        }

        case "07":{
            let currentValue = expenses[6];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[6] = currentValue;
            break;
        }

        case "08":{
            let currentValue = expenses[7];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[7] = currentValue;
            break;
        }

        case "09":{
            let currentValue = expenses[8];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[8] = currentValue;
            break;
        }

        case "10":{
            let currentValue = expenses[9];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[9] = currentValue;
            break;
        }

        case "11":{
            let currentValue = expenses[10];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[10] = currentValue;
            break;
        }

        case "12":{
            let currentValue = expenses[11];
            currentValue = currentValue + Number(exp.expenseAmount);
            expenses[11] = currentValue;
            break;
        }
        default: {}
    }
}

const getMonthlyPayTotals = (exp, payments) => {
    const dates = exp.createdAt.split('-');
    switch(dates[1]){
        case "01":{
            let currentValue = payments[0];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[0] = currentValue;
            break;
        }

        case "02":{
            let currentValue = payments[1];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[1] = currentValue;
            break;
        }

        case "03":{
            let currentValue = payments[2];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[2] = currentValue;
            break;
        }

        case "04":{
            let currentValue = payments[3];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[3] = currentValue;
            break;
        }

        case "05":{
            let currentValue = payments[4];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[4] = currentValue;
            break;
        }

        case "06":{
            let currentValue = payments[5];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[5] = currentValue;
            break;
        }

        case "07":{
            let currentValue = payments[6];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[6] = currentValue;
            break;
        }

        case "08":{
            let currentValue = payments[7];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[7] = currentValue;
            break;
        }

        case "09":{
            let currentValue = payments[8];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[8] = currentValue;
            break;
        }

        case "10":{
            let currentValue = payments[9];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[9] = currentValue;
            break;
        }

        case "11":{
            let currentValue = payments[10];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[10] = currentValue;
            break;
        }

        case "12":{
            let currentValue = payments[11];
            currentValue = currentValue + Number(exp.amountPaid);
            payments[11] = currentValue;
            break;
        }
        default: {}
    }
}

const BarChartGraph = (props) => {

    const [monthlyDataSet, setMonthlyDataSet] = useState(monthlyData);
    const barData = useSelector(data => data.dailySalesReducer.barData);

    const analyseMonthlyData = (expense, payment) => {
        const expenses = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        const payments = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        if(expense){
            for(let exp of expense){
                getMonthlyTotals(exp, expenses);
            }
        }

        if(payment){
            for(let exp of payment){
                getMonthlyPayTotals(exp, payments);
            }
        }

        const monthlyData = {
            labels,
            datasets: [
              {
                label: 'Expenses',
                data: expenses,
                backgroundColor: '#06805B',
              },
              {
                label: 'Payments',
                data: payments,
                backgroundColor: '#108CFF',
              },
            ],
        };

        setMonthlyDataSet(monthlyData);
    }

    useEffect(()=>{
        analyseMonthlyData(barData.expenses, barData.payments)
    }, [barData.expenses, barData.payments])

    return(
        <div className='bar-chart'>
            <div className='bar'>
                {props.load?
                    <Skeleton sx={{borderRadius:'5px', background:'#f7f7f7'}} animation="wave" variant="rectangular" width={'100%'} height={300} />:
                    <Bar options={options} data={monthlyDataSet} />
                }
            </div>
        </div>
    )
}

export default BarChartGraph;