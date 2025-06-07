import React from "react";
import "../styles/popup.css"
import {Link} from "react-router-dom";

interface PopupProps {
    isVisible: boolean,
    setVisibleFalse: any;
}

interface PopupState {
    key: number;
}

class Popup extends React.Component<PopupProps, PopupState> {
    constructor(props: PopupProps) {
        super(props);
        this.state = {
            key: 1
        };
    }

    handleClose(e: React.MouseEvent) {
        const target = e.target as Element;
        const classList = target.classList;
        if (classList.contains("consultation_popup") || classList.contains("popup_cross") || classList.contains("cancel_changes")) {
            this.props.setVisibleFalse();
            this.setState({key: this.state.key + 1});
        }
    }

    render() {
        return (
            <div className="consultation_popup" style={{
                display: this.props.isVisible ? "initial" : "none",
                opacity: this.props.isVisible ? 1 : 0
            }}
                 onClick={(e) => {
                     this.handleClose(e)
                 }}>
                <div className="popup_window" style={{
                    opacity: this.props.isVisible ? 1 : 0,
                    transform: "translateY(-50%)", alignItems: 'center', justifyContent: 'center', display: "flex",
                    flexFlow: 'column'
                }}>
                    <div className="schedule_login_text">
                        Пожалуйста войдите в личный кабинет
                    </div>
                    <Link to="/login">
                        <button className="login_schedule">Войти</button>
                    </Link>
                </div>

                <div className="popup_cross" onClick={this.props.setVisibleFalse}>
                    <svg role="presentation" className="t-popup__close-icon" width="23px" height="23px"
                         viewBox="0 0 23 23" version="1.1" xmlns="https://www.w3.org/2000/svg">
                        <g stroke="none" strokeWidth="1" fill="#3441c1" fillRule="evenodd">
                            <rect
                                transform="translate(11.313708, 11.313708) rotate(-45.000000) translate(-11.313708, -11.313708) "
                                x="10.3137085" y="-3.6862915" width="2" height="30"></rect>
                            <rect
                                transform="translate(11.313708, 11.313708) rotate(-315.000000) translate(-11.313708, -11.313708) "
                                x="10.3137085" y="-3.6862915" width="2" height="30"></rect>
                        </g>
                    </svg>
                </div>
            </div>
        )
    }
}

export default Popup;