import React from "react";
import logo from './images/logo.webp'
import Navbar from "./navbar";

function Header() {
    return (
        <header>
            <div className="headerDiv"> <img src={logo} className='headerLogo'></img>
                Sahyadri
            </div>

            <Navbar></Navbar>
        </header>
    )
}

export default Header;