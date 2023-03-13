import { Button } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useRef } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import UserService from "../../services/user";
import { updateUser } from "../../store/actions/auth";
import config from '../../constants';

const Logo = () => {
    const logos = useRef();
    const [saveFile, setSaveFile] = useState(null);
    const [loadingSpinner, setLoaadingSpinner] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector(state => state.authReducer.user);

    const browseGallery = () => {
        logos.current.click();
    }

    const fileInputHandler = (e) => {
        let file = e.target.files[0];
        console.log(file)
        setSaveFile(file);
    }

    const updateLogo = () => {
        if(saveFile === null){
            swal("Warning!", "Please select a file to upload!", "info");
        }else{
            if(saveFile.type.split('/')[0] === "image"){
                setLoaadingSpinner(true);
                const formData = new FormData();
                formData.append("file", saveFile);
                formData.append("id", user._id);
                const httpConfig = {
                    headers: {
                        "content-type": "multipart/form-data",
                        "Authorization": "Bearer "+ localStorage.getItem('token'),
                    }
                };
                const url = config.BASE_URL+"/360-station/api/uploadLogoFile";
                axios.post(url, formData, httpConfig).then((data) => {
                    swal("Success!", "Logo updated successfully!", "success");
                }).then(()=>{
                    UserService.getOneUser({id: user._id}).then(data => {
                        localStorage.setItem("user", JSON.stringify(data.user));
                        dispatch(updateUser(data.user));
                    }).then(()=>{
                        setLoaadingSpinner(false);
                    });
                });
            }else{
                swal("Warning!", "Only image files are supported!", "info");
            }
        }
    }

    return(
        <div className='appearance'>
            <div className='app'>
                <div className='head'>Logo (Branding)</div>
            </div>
            <div className='details'>
                <div style={{
                    fontSize:'12px',
                    display:'flex',
                    flexDirection:'row',
                    justifyContent:'flex-start',
                    marginTop:'40px',
                    fontWeight:'bold'
                }}>
                    Logo
                </div>
                <div style={{marginTop:'10px'}} className='detail-text'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Posuere
                </div>

                <div className='browse'>
                    <Button 
                        variant="contained" 
                        sx={{
                            width:'110px',
                            height:'30px',
                            background:'#06805B',
                            fontSize:'11px',
                            '&:hover': {
                                backgroundColor: '#06805B'
                            }
                        }}
                        onClick={browseGallery}
                    >
                        Browse
                    </Button>
                    <span>{saveFile && saveFile.name}</span>

                    <Button 
                        variant="contained" 
                        sx={{
                            width:'100%',
                            height:'30px',
                            background:'#054834',
                            fontSize:'11px',
                            marginTop:'30px',
                            marginBottom:'20px',
                            '&:hover': {
                                backgroundColor: '#054834'
                            }
                        }}
                        onClick={updateLogo}
                    >
                        Save
                    </Button>
                    <input onChange={fileInputHandler} ref={logos} type="file" style={{visibility:'hidden'}} />
                    {loadingSpinner &&
                        <ThreeDots 
                            height="60" 
                            width="50" 
                            radius="9"
                            color="#076146" 
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default Logo;