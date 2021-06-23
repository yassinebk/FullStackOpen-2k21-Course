import React from "react"

const Notif = ({ message,type }) =>
{
    let style = {
        display: 'none',
        borderStyle:'solid',
        position:'sticky',
            borderRadius:10,
            padding:10,
            marginBottom:10,

    }
    if (type === "success") {
        style = {
            ...style,
            display: 'block',
            color:'#52b69a',
            borderColor: '#99d98c',
               }
        }
    else if (type === 'error')
    {
            style = {
            display: 'block',
            color:'#ef233c',
            borderColor:'#e63946'
        }
        }
    if (message === null)
        return null; 
    return (
        <div style={style}>
            {message}
        </div>
    )
}

export default Notif;