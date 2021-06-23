import React from 'react'

export const Footer= () => {
    const footerStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    }
    return (
        <div style={footerStyle}>
            <br />
           <em>Note app , Yassine Belkhadem , Full Stack Open 2021</em> 
        </div>
    )
}

export default Footer;