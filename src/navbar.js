import React from "react";
import { Link } from "react-router-dom";
function Navbar() {
    return (
        <nav className="Navbar">
            <ul>
                <li><Link to="/">Internal</Link></li>
                <li><Link to="/assignment">Assignment</Link></li>
                <li><Link to="/uni">External</Link></li>
                <li><Link to="/feedback">Feedback</Link></li>
                <li><Link to="/overall">Overall</Link></li>
            </ul>
        </nav>  
    )
}

export default Navbar;