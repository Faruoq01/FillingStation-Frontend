import React, { useState } from 'react';
import '../styles/login.scss';
import station from '../assets/station.png';
import Register from '../components/Login/register';
import Login from '../components/Login/login';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
 const [gotToRegister, setToRegister] = useState(false);
 const navigate = useNavigate();
 const online = useSelector((state) => state.auth.connection);

 useEffect(() => {
  if (!online) {
   navigate('/connection');
  }
 });

 useEffect(() => {
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'login' }));
 }, []);

 return (
  <div className="login-container">
   <div className="left-block">
    <div style={{ flexDirection: 'column' }} className="upper-block">
     {gotToRegister || <Login reg={setToRegister} />}
     {gotToRegister && <Register reg={setToRegister} />}
    </div>
   </div>
   <div className="right-block">
    <img className="station" src={station} alt="icon" />
   </div>
  </div>
 );
};

export default LoginScreen;
