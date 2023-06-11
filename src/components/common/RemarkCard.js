import { Avatar } from "@mui/material";
import "../../styles/history.scss";

const months = {
    '01' : 'January',
    '02': 'February',
    '03': 'March',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'July',
    '08': 'August',
    '09': 'September',
    '10': 'October',
    '11': 'November',
    '12': 'December',
}

const RemarkCard = (props) => {

    const convertDate = (data) => {
        const date = data.split('-');
        const format = `${date[2]} ${months[date[1]]} ${date[0]}`;
        return format;
    }

    const convertTime = (data) => {
        const time = data.split(" ").pop();
        const getHour = time.split(":");
        if(Number(getHour[0]) < 12){
            return data.replace(time, getHour[0].concat(":", getHour[1]).concat(" ", "AM")) ;

        }else{
            return data.replace(time, getHour[0].concat(":", getHour[1]).concat(" ", "PM")); 
        }
    }

    return(
        <div className="remark_card">
            <div className="name_avatar">
                {
                    props.data.image === "null"?
                    <Avatar sx={{width:'35px', background: 'grey', height:'35px', fontSize:'14px'}} alt="Remy Sharp">{props.data.name.substring(0, 2)}</Avatar>:
                    <Avatar alt="Remy Sharp" src={props.data.image} />
                }
                <div className="rmk_content">
                    <div className="user_rmk">{props.data.name+" ("+ props.data.alias +")"}</div>
                    <div className="content_rmk">{convertTime(props.data.content)}</div>
                    <div className="rmk_date">{convertDate(props.data.createdAt)}.</div>
                </div>
            </div>
        </div>
    )
}

export default RemarkCard;