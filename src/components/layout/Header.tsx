import {Link} from "react-router-dom";
import logo from "../../static/logo.jpeg"
import React, {useState} from "react";
import MenuHeader from "./MenuHeader";

const apiUrl = process.env.REACT_APP_API_URL;

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
    const [open, setOpen] = useState(false);

    function handleMenu() {
        if (!open) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "scroll";
        }
        setOpen(!open);
    }

    function logout() {
        fetch(apiUrl + '/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: localStorage.getItem('refresh') })
        }).then(() => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            window.location.assign('/login');
        });
    }

    return (
        <header>
            {open && <MenuHeader handleMenuLinks={handleMenu}/>}

            <div className="menu_and_logo">
                <div className="menu_header" onClick={handleMenu}>
                    <span className="menu_header_block" style={{top: 25, display: open ? 'none' : "initial"}}></span>
                    <span className="menu_header_block" style={{top: 33, transform: open ? "rotate(45deg)" : "none"}}></span>
                    <span className="menu_header_block" style={{top: 33, transform: open ? "rotate(-45deg)" : "none"}}></span>
                    <span className="menu_header_block" style={{top: 41, display: open ? 'none' : "initial"}}></span>
                </div>


                <Link to="/">
                    <img src={logo} style={{width: 170}} alt="emblem"/>
                </Link>
            </div>

            {localStorage.getItem("access") === null &&
                <div className="header_footer_buttons">
                    <Link to="/registration"><button className="registration_button">Регистрация</button></Link>
                    <Link to="/login"><button className="login_button">Войти</button></Link>
                </div>
            }

            {localStorage.getItem("access") !== null &&
              <div className="header_footer_buttons">
                <button className="login_button" onClick={logout}>Выйти из аккаунта</button>
              </div>
            }
        </header>
    )
}

export default Header;