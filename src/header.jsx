import React from "react";
import logo from './images/logo.webp'
import Navbar from "./navbar";

function Header() {
    var headerStyle = {
        fontSize : "30px",
        fontWeight :900
    }

    return (
        <header>
            <div className="headerDiv"> <img src={logo} className='headerLogo'></img>
                <h1 style={headerStyle}>Sahyadri</h1> <span style={{color : '#007bff'}}> beta</span>
            </div>

            <Navbar></Navbar>
        </header>
    )
}

export default Header;