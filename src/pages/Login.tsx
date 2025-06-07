import React from "react";
import {Link} from "react-router-dom";
import LoginForm from "../components/layout/LoginForm";
import {Helmet} from "react-helmet";
import {HelmetProvider} from "react-helmet-async";

const Login: React.FC = () => {
    return (
        <div className="page_content" style={{height: '90vh'}}>
            <HelmetProvider>
                <Helmet
                    title="Авторизация"
                />
            </HelmetProvider>

            <div className="login_window" style={{height: 410}}>
                <div className="modal_window_title">Авторизация</div>
                <LoginForm location="login"/>
                <Link to="/registration" className="login_link">
                    Зарегистрироваться
                </Link>
            </div>
        </div>
    )
}
export default Login;