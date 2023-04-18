import "../../styles/map.scss";
import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import Geocode from "react-geocode";
import config from "../../constants";
import swal from "sweetalert";

const AddStationLocationMap = (props) => {

    Geocode.setApiKey(config.API_KEY);
    Geocode.enableDebug();

    const getLocation = () => {
        if(props.lt !== "" && props.ln !== "") return swal("Warning!", "Latitude and longitude field already set", "info");
        // Get latitude & longitude from address.
        Geocode.fromAddress(props.city).then(
            (response) => {
                const { lat, lng } = response.results[0].geometry.location;
                props.long(lng);
                props.lat(lat);
            },
            (error) => {
            console.error(error);
            }
        );
    }

    return(
        <div className="initStyle">
            <div onClick={getLocation} className="info-map">
                <AddIcon sx={{color:'green'}} />
                <div>Click to compute location from address information.</div>
            </div>
        </div>
    )
}

export default AddStationLocationMap;