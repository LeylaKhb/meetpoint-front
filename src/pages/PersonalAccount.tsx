import React from "react";
import {Person} from "../models/Person";
import "../styles/personal_page/personal_account.css";
import {Link} from "react-router-dom";
import Popup from "../components/Popup";
import {Helmet, HelmetProvider} from "react-helmet-async";
import {fetchWithAuthRetry} from "../components/auth";
import meetings from "./Meetings";

const apiUrl = process.env.REACT_APP_API_URL;

interface PersonalAccountProps {
}

interface PersonalAccountState {
    person: Person;
    isFirstPopupVisible: boolean;
    isSecondPopupVisible: boolean;
}

class PersonalAccount extends React.Component<PersonalAccountProps, PersonalAccountState> {
    constructor(props: PersonalAccountProps) {
        super(props);
        this.state = {
            person: new Person("", ""),
            isFirstPopupVisible: false,
            isSecondPopupVisible: false,
        };

        this.setFirstPopupFalse = this.setFirstPopupFalse.bind(this);
        this.setFirstPopupTrue = this.setFirstPopupTrue.bind(this);
        this.setSecondPopupFalse = this.setSecondPopupFalse.bind(this);
        this.setSecondPopupTrue = this.setSecondPopupTrue.bind(this);
    }

    componentDidMount() {
        let me = this;

        fetchWithAuthRetry(`${apiUrl}/profile`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("jwt")
            }
        }).then(function (resp) {
            resp.json().then(function (data) {
                me.setState({
                    person: data
                });
            });
        })
            .catch(() => {
                me.setState({
                    person: Person.createMockPerson()
                })
            })
    }

    setFirstPopupFalse() {
        this.setState({isFirstPopupVisible: false});
        document.body.style.overflow = "scroll";
    }

    setFirstPopupTrue() {
        this.setState({isFirstPopupVisible: true});
        document.body.style.overflow = "hidden";
    }

    setSecondPopupFalse() {
        this.setState({isSecondPopupVisible: false});
        document.body.style.overflow = "scroll";
    }

    setSecondPopupTrue() {
        this.setState({isSecondPopupVisible: true});
        document.body.style.overflow = "hidden";
    }

    handleLogout() {
        fetch(apiUrl + '/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({refresh: localStorage.getItem('refresh')})
        }).then(() => {
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            window.location.assign('/login');
        });
    }

    render() {
        let me = this;
        let person = me.state.person;
        const backgroundImage = {
            background: "linear-gradient(45deg, rgb(52, 65, 193), rgb(47, 123, 172))",
            width: '40%',
            height: 200,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 10,
        };

        return (
            <div style={{height: '90vh'}}>

                <HelmetProvider>
                    <Helmet
                        title="Личный кабинет"
                    />
                </HelmetProvider>
                <div className="personal_account_div">
                    <div style={{display: 'flex', flexFlow: 'row'}}>
                        <img src={person.photoUrl} style={{borderRadius: '100%', width: 100, height: 100}}
                             alt="user profile"/>
                        <div className="personal_info_div">
                            <div className="personal_info">{person.name + " " + person.surname}</div>
                            <div className="personal_info" style={{
                                color: 'gray', fontSize: 14,
                                wordBreak: 'break-all'
                            }}>{person.email}
                                <span style={{paddingInline: 10}}>•</span>
                                <span className="personal_info" style={{
                                    color: 'gray', fontSize: 14,
                                    wordBreak: 'break-all'
                                }}>{person.birthdate ? new Date(person.birthdate).toLocaleDateString('ru-RU', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                }).replace(/\//g, '.') : ''}</span>
                                <span style={{paddingInline: 10}}>•</span>
                                <span className="personal_info" style={{
                                    color: 'gray', fontSize: 14,
                                    wordBreak: 'break-all'
                                }}>{person.rating === undefined ? "5.0" : person.rating.toFixed(1)}</span>
                            </div>
                            <Link to="/test">
                            <button className="personal_change_info" style={{marginTop: 6}}>Пройти тест</button>
                            </Link>
                        </div>
                    </div>
                    <div style={{display: 'flex', flexFlow: 'column'}}>
                        <button className="personal_change_info" onClick={me.setFirstPopupTrue}>Изменить данные</button>
                        <button className="personal_logout_button" onClick={me.handleLogout}>Выйти из аккаунта</button>
                    </div>
                </div>

                <div className="personal_orders_links">
                    <Link
                        to="/current_meetings"
                        state={{ meetings: person.nextMeetings }}
                        className="person_order_link"
                        style={backgroundImage}>
                        <div className="person_order_button">Текущие мероприятия</div>
                    </Link>
                    <Link
                        to="/meetings_history"
                        state={{ meetings: mockMeetings }}
                        className="person_order_link"
                        style={backgroundImage}>
                        <div className="person_order_button">История мероприятий</div>
                    </Link>
                </div>
                <Popup isVisible={me.state.isFirstPopupVisible} setVisibleFalse={me.setFirstPopupFalse}
                       content="profile" person={me.state.person} openSecondPopup={this.setSecondPopupTrue}/>
                <Popup isVisible={me.state.isSecondPopupVisible} setVisibleFalse={me.setSecondPopupFalse}
                       content="change_password"/>
            </div>
        )
    }
}

const mockMeetings = [
    {
        id: "1",
        name: "Вечер современного театра",
        description: "Встреча любителей театрального искусства для обсуждения новых постановок и совместного посещения спектаклей в театрах Казани.",
        datetime: '2025-06-20T19:00:00Z',
        photoUrl: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600",
        location: "ул. Петербургская, 57, Казань (у входа в Татарский государственный академический театр)",
        rating: 5.0,
        membersCount: 1,
        maxMembers: 12,
        tags: ["Театр"],
    },
];

export default PersonalAccount;
