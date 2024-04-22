import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faCode, faLaptopCode } from '@fortawesome/free-solid-svg-icons';

function Footer() {
    return (
        <footer>
            &copy; mohdraheez
            <div >
                <h4>For more queries</h4>
                <a href="https://www.instagram.com/mohdraheez/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} size="2x" className="instagram"/>
                </a>
                <a href="https://www.linkedin.com/in/mohammed-raheez/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} size="2x" className="linkedin"/>
                </a>

                <a href="https://mohdraheez.github.io/Portfolio/" target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faCode} size="2x"  className="weblink"/>
                </a>
            </div>
        </footer>
    )
}

export default Footer;