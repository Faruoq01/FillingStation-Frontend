import { Button, OutlinedInput } from "@mui/material";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useSelector } from "react-redux";
import swal from "sweetalert";
import OutletService from "../../services/outletService";

const OutletInfo = (props) => {
    const oneStation = useSelector(state => state.outletReducer.adminOutlet);
    const [id, setID] = useState('');
    const [outletName, setOutletName] = useState('');
    const [noOfPump, setNoOfPump] = useState('');
    const [noOfTank, setNoOfTank] = useState('');
    const [state, setState] = useState('');
    const [town, setTown] = useState('');
    const [lga, setLga] = useState('');
    const [street, setStreet] = useState('');
    const [loadingSpinner, setLoadingSpinner] = useState(false);

    useEffect(()=>{
        setOutletName(oneStation?.outletName);
        setNoOfPump(oneStation?.noOfPumps);
        setNoOfTank(oneStation?.noOfTanks);
        setState(oneStation?.state);
        setTown(oneStation?.city);
        setLga(oneStation?.lga);
        setStreet(oneStation?.alias);
        setID(oneStation?._id);
    }, [
        oneStation?.outletName,
        oneStation?.noOfPumps,
        oneStation?.noOfTanks,
        oneStation?.state,
        oneStation?.city,
        oneStation?.lga,
        oneStation?.alias,
        oneStation?._id
    ]);

    const updateOutlet = () => {
        if(outletName === "") return swal("Warning!", "Outlet name field cannot be empty", "info");
        if(noOfPump === "") return swal("Warning!", "No of pump name field cannot be empty", "info");
        if(noOfTank === "") return swal("Warning!", "No of tank name field cannot be empty", "info");
        if(state === "") return swal("Warning!", "State name field cannot be empty", "info");
        if(town === "") return swal("Warning!", "Town name field cannot be empty", "info");
        if(lga === "") return swal("Warning!", "LGA name field cannot be empty", "info");
        if(street === "") return swal("Warning!", "Street name field cannot be empty", "info");
        setLoadingSpinner(true);

        const payload = {
            id: id,
            outletName: outletName,
            state: state,
            city: state,
            lga: lga,
            area: town,
            alias: street,
            noOfTanks: noOfTank,
            noOfPumps: noOfPump,
            activeState: oneStation.activeState,
        }

        OutletService.updateStation(payload).then(data => {
            swal("Success", "Station updated successfully!", "success");
        }).then(()=>{
            setLoadingSpinner(false);
            props.refresh();
        })
    }

    return(
        <div className='outlet'>
            <div className='lef'>
                <div className='title'>Outlet Information</div>
                <div className='text-group'>
                    <div className='form-text'>Outlet Name</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={outletName}
                        onChange={e => setOutletName(e.target.value)}
                        placeholder="" 
                    />
                </div>
                <div className='text-group'>
                    <div className='form-text'>No Of Tanks</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={noOfTank}
                        onChange={e => setNoOfTank(e.target.value)}
                        placeholder="" 
                    />
                </div>
                <div className='text-group'>
                    <div className='form-text'>No Of Pumps</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={noOfPump}
                        onChange={e => setNoOfPump(e.target.value)}
                        placeholder="" 
                    />
                </div>
                <div className='text-group'>
                    <div className='form-text'>State</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={state}
                        onChange={e => setState(e.target.value)}
                        placeholder="" 
                    />
                </div>
                <div className='text-group'>
                    <div className='form-text'>Town</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={town}
                        onChange={e => setTown(e.target.value)}
                        placeholder="" 
                    />
                </div>
            </div>
            <div className='rig'>
                <div style={{marginTop:'50px'}} className='text-group'>
                    <div className='form-text'>LGA</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            fontSize:'12px'
                        }} 
                        value={lga}
                        onChange={e => setLga(e.target.value)}
                        placeholder="" 
                    />
                </div>

                <div className='text-group'>
                    <div className='form-text'>Alias</div>
                    <OutlinedInput 
                        sx={{
                            height: '35px', 
                            marginTop:'5px', 
                            background:'#EEF2F1', 
                            border:'1px solid #777777',
                            marginBottom:'30px',
                            fontSize:'12px'
                        }} 
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                        placeholder="" 
                    />
                </div>

                <Button 
                    variant="contained" 
                    sx={{
                        width:'100%',
                        height:'30px',
                        background:'#054834',
                        fontSize:'11px',
                        marginBottom:'20px',
                        '&:hover': {
                            backgroundColor: '#054834'
                        }
                    }}
                    onClick={updateOutlet}
                >
                    Save
                </Button>

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
    )
}

export default OutletInfo;