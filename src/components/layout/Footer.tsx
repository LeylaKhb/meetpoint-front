import React from "react";
import logo from "../../static/logo.jpeg";
import {Link} from "react-router-dom";

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="logo_and_button">
                <Link to="/">
                    <img src={logo} style={{width: '50%'}} alt="emblem"/>
                </Link>
            </div>
        </footer>
    )
}

export default Footer;