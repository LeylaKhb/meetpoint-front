import React from "react";
import "../styles/layout/registration.css";
import {Link} from "react-router-dom";
import LoginForm from "../components/layout/LoginForm";
import {Helmet} from "react-helmet";
import {HelmetProvider} from "react-helmet-async";

const Registration: React.FC = () => {
    return (
        <div className="page_content" style={{ height: '90vh'}}>
            <HelmetProvider>
                <Helmet
                    title="Регистрация"
                />
            </HelmetProvider>
            <div className="login_window">
                <div className="modal_window_title">Регистрация</div>
                <div className="popup_desc" style={{color: '#5f5f5f', marginTop: 5}}>Личный кабинет</div>
                <LoginForm location="registration" />
                <Link to="/login" className="login_link">
                    Уже зарегистрированы? Войти тут
                </Link>
            </div>
        </div>
    )
}

export default Registration;