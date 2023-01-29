import { Button } from '@mui/material';
import React from 'react';
import doubleArrow from '../../assets/landing/doubleArrow.png';
import {useHistory} from 'react-router-dom'

const HeroArea = () => {

    const history = useHistory();
    
    return(
        <React.Fragment>
            <div className='hero'>
                <div className='text'>
                    <div className='text-container'>
                        <p className='header-text'>
                            Manage your fueling outlets in a <span className='col'>digitized way</span>
                        </p>
                        <p className='body-text'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Pulvinar non amet, proin sed consequat. Quisque quis massa 
                            nullam ornare fusce eget massa sed. Phasellus tempus nulla non, 
                            facilisi ullamcorper Lorem ipsum dolor sit amet, consectetur 
                            adipiscing elit. Pulvinar non amet, proin sed consequat. Quisque 
                            quis massa nullam ornare fusce eget massa sed. Phasellus tempus nulla non, .
                        </p>

                        <Button sx={{
                            width:'200px', 
                            height:'40px',  
                            background: '#266910',
                            borderRadius: '0px',
                            fontFamily: 'Nunito',
                            fontStyle: 'normal',
                            fontWeight: '700',
                            fontSize: '12px',
                            color: '#fff',
                            marginTop:'20px',
                            '&:hover': {
                                backgroundColor: '#266910'
                            }
                            }}  
                            onClick={()=>{history.push('/login')}}
                            variant="contained"> 
                            <span style={{marginRight:'20px'}}>Getting started</span>
                            <img style={{width:'20px', height:'20px'}} src={doubleArrow} alt="icon" />
                        </Button>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default HeroArea;