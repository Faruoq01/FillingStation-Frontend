import { Avatar, Checkbox, MenuItem, OutlinedInput, Select, Switch } from "@mui/material";
import { useEffect } from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OutletService from "../../services/outletService";
import { adminOutlet, getAllStations } from "../../store/actions/outlet";
import "../../styles/permission.scss";
import { styled } from '@mui/material/styles';
import perm from "../../assets/perm.png";

const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&:before, &:after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
      },
      '&:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&:after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
}));

const UserRow = (props) => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const goToList = () => {
        props.nav(7);
    }

    return(
        <div className="user_rows">
            <div style={{justifyContent:'space-between'}} className="perm_cell2">
                <Checkbox sx={{
                    color:'#232759',
                    marginLeft:'20px',
                    '&.Mui-checked': {
                        color: '#1368D8',
                    },
                }} {...label} defaultChecked />
                <div style={{marginRight:'30px'}}>01</div>
            </div>
            <div className="perm_cell2"><Avatar sx={{width:'25px', height:'25px'}} /></div>
            <div className="perm_cell2">Aminu Faruk</div>
            <div style={{color:'#1368D8'}} className="perm_cell2">Enabled</div>
            <div className="perm_cell2">
                <div style={{marginRight:'10px'}}>
                    <Android12Switch defaultChecked />
                </div>
                <img onClick={goToList} style={{width:'25px', height:'25px'}} src={perm} alt="icon" />
            </div>
        </div>
    )
}

const Permissions = (props) => {
    const user = useSelector(state => state.authReducer.user);
    const dispatch = useDispatch();
    const [defaultState, setDefault] = useState(0);
    const allOutlets = useSelector(state => state.outletReducer.allOutlets);
    const oneStationData = useSelector(state => state.outletReducer.adminOutlet);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    const resolveUserID = () => {
        if(user.userType === "superAdmin" || user.userType === "admin"){
            return {id: user._id}
        }else{
            return {id: user.organisationID}
        }
    }

    const getAllLPOData = useCallback(() => {
        const payload = {
            organisation: resolveUserID().id
        }

        if(user.userType === "superAdmin" || user.userType === "admin"){
            OutletService.getAllOutletStations(payload).then(data => {
                dispatch(getAllStations(data.station));
                dispatch(adminOutlet(null));
            });
        }else{
            OutletService.getOneOutletStation({outletID: user.outletID}).then(data => {
                dispatch(adminOutlet(data.station));
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(()=>{
        getAllLPOData();
    },[getAllLPOData])

    const changeMenu = (index, item ) => {
        setDefault(index);
        dispatch(adminOutlet(item));
    }

    return(
        <div className="permissions_container">
            <div className="header_perm_text">Permissions</div>
            <div className="perm_filters">
                <div className="all_stations">
                    {(user.userType === "superAdmin" || user.userType === "admin") &&
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={defaultState}
                            sx={selectStyle2}
                        >
                            <MenuItem style={menu} value={0}>All Stations</MenuItem>
                            {
                                allOutlets.map((item, index) => {
                                    return(
                                        <MenuItem key={index} style={menu} onClick={()=>{changeMenu(index + 1, item)}} value={index + 1}>{item.outletName+ ', ' +item.alias}</MenuItem>
                                    )
                                })  
                            }
                        </Select>
                    }
                    {user.userType === "staff" &&
                        <Select
                            labelId="demo-select-small"
                            id="demo-select-small"
                            value={0}
                            sx={selectStyle2}
                            disabled
                        >
                            <MenuItem style={menu} value={0}>{user.userType === "staff"? oneStationData?.outletName+", "+oneStationData?.alias: "No station created"}</MenuItem>
                        </Select>
                    }
                </div>
                <div className="perm_search">
                    <OutlinedInput
                        sx={{
                            width:'100%',
                            height: '35px',  
                            background:'#EEF2F1', 
                            fontSize:'12px',
                            borderRadius:'0px',
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                border:'1px solid #777777',
                            },
                        }} 
                        type='text'
                        placeholder="Search" 
                        // onChange={(e) => {searchTable(e.target.value)}}
                    />
                </div>
            </div>

            <div className="perm_users">
                <div className="user_header">
                    <div style={{justifyContent:'space-between'}} className="perm_cell">
                        <Checkbox sx={{
                            color:'#fff',
                            marginLeft:'20px',
                            '&.Mui-checked': {
                                color: '#fff',
                            },
                        }} {...label} defaultChecked />
                        <div style={{marginRight:'30px'}}>S/N</div>
                    </div>
                    <div className="perm_cell">Image</div>
                    <div className="perm_cell">Full Name</div>
                    <div className="perm_cell">Status</div>
                    <div className="perm_cell">Action</div>
                </div>

                <div className="row_cell_perm">
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                    <UserRow nav={props.nav} />
                </div>
            </div>
        </div>
    )
}

const selectStyle2 = {
    width:'100%', 
    height:'35px', 
    borderRadius:'0px',
    background: '#F2F1F1B2',
    color:'#000',
    fontSize:'12px',
    outline:'none',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        border:'1px solid #777777',
    },
}

const menu = {
    fontSize:'12px',
}

export default Permissions;