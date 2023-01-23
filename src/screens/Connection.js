import '../styles/connection.scss';
import connection from '../assets/connection.png';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Connection = ({history}) => {

    const online = useSelector(data => data.authReducer.connection);

    const reload = () => {

        if(online){
            history.goBack();
        }
    }

    useEffect(()=>{
        if(online){
            history.goBack();
        }
    });

    return(
        <div className='ConnectionContainer'>
            <img style={{width:'200px', height:'200px'}} src={connection} alt="icon" />
            <div className='oops'>Ooops !!!</div>
            <div className='mssg'>
                Something is temporarily wrong with your network connection. 
                Please make sure you are connected to the internet and 
                then reload your browser
            </div>
            <Button sx={{
                width:'130px', 
                height:'30px',  
                fontSize:'10px',
                marginTop:'20px',
                background: '#263238',
                borderRadius: '0px',
                '&:hover': {
                    background: '#263238',
                }
                }} 
                onClick={reload}
                variant="contained"> Reload
            </Button>
        </div>
    )
}

export default Connection;