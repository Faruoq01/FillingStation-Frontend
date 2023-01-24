import React, { useState } from 'react';
import '../styles/login.scss';
import station from '../assets/station.png';
import Register from '../components/Login/register';
import Login from '../components/Login/login';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';

const LoginScreen = () => {

    const [gotToRegister, setToRegister] = useState(false);
    const history = useHistory();
    const online = useSelector(data => data.authReducer.connection);

    useEffect(()=>{

        if(!online){
            history.push('/connection');
        }
    });
    
    return(
        <div className='container'>
            <div className='left-block'>
                <div style={{flexDirection:'column'}} className='upper-block'>
                    { gotToRegister || <Login history={history} reg={setToRegister} />}
                    { gotToRegister && <Register reg={setToRegister} />}
                </div>
                {/*<div className='lower-block'></div>*/}
            </div>
            <div className='right-block'>
                <img className='station' src={station} alt="icon" />
            </div>
        </div>
    )
}

export default LoginScreen;