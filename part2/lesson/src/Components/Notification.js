import React from 'react'
const Notificiation = ({ message,type }) =>
{

    let NotificationStyle = {
        display:"none"
    };  
    if (type == 'error') {
         NotificationStyle = {
            color: "red",
            background: "lightgray",
            fontSize: 20,
            borderStyle: "solid",
            borderRadius: 5,
            padding: 10,
            marginBottom: 10,
        }
    }
    else if (type==="success"){
        NotificationStyle = {
            color: "green",
            background: "lightgray",
            borderStyle: "solid",
            borderRadius: 5,
            padding: 10,
            borderColor: "green",
            marginBottom:6,
        }
    }
    if (message === null)
        return null; 
    return (
        <div style={NotificationStyle}>
            {message}
        </div>
    )
}
export default Notificiation