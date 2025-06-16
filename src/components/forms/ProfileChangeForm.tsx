import React, {useEffect, useState} from "react";
import {Person} from "../../models/Person";
import "../../styles/personal_page/profile_change_form.css";
import Form from "../forms/Form";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import userPhoto from "../../static/user-profile.jpg";
import {fetchWithAuthRetry} from "../auth";

const apiUrl = process.env.REACT_APP_API_URL;

interface ProfileChangeFormProps {
    person: Person;
    openSecondPopup: any
}

const ProfileChangeForm: React.FC<ProfileChangeFormProps> = ({person, openSecondPopup}) => {

    const [emailError, setEmailError] = useState("");
    const [nameValid, setNameValid] = useState(true);
    const [surnameValid, setSurnameValid] = useState(true);

    const [emailText, setEmailText] = useState(person.email);
    const [nameText, setNameText] = useState("");
    const [surnameText, setSurnameText] = useState("");
    let [birthdate, setBirthdate] = useState<Date | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setEmailText(person.email);
        setNameText(person.name  ?? "");
        setSurnameText(person.surname ?? "")
        setBirthdate(person.birthdate ?? new Date())
    }, [person.email, person.name, person.surname, person.birthdate])

    function checkEmail() {
        if(!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+$/.test(emailText))) {
            setEmailError("Неправильная электронная почта");
            return false;
        }
        return true;
    }

    function checkName() {
        if (nameText.length === 0) {
            setNameValid(false);
            return false;
        }
        return true;
    }

    function checksSurname() {
        if (surnameText.length === 0) {
            setSurnameValid(false);
            return false;
        }
        return true;
    }

    function handleChanges() {
        if (!checkEmail() || !checkName() || !checksSurname()) {
            return;
        }
        if (birthdate == null) return;
        const person = new Person(emailText, undefined, birthdate, nameText, surnameText)

        fetchWithAuthRetry(`${apiUrl}/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(person)
        }).then(function (resp) {
            resp.json()
                .then(function (data) {
                    if (data["header"] === "error") {
                        setEmailError(data["content"]);
                        return;
                    } else {
                        localStorage.setItem("jwt", data["content"]);
                        setSuccess(true);
                    }
                })
        });
    }

    function handleNameInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        let lastChar = inputValue.charAt(inputValue.length - 1);
        if(!(/^[a-zA-Zа-яА-Я-]+$/.test(lastChar))) {
            e.target.value = inputValue.slice(0, -1);
        }
        setNameValid(true);
        setNameText(inputValue);
    }

    function handleSurnameInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        let lastChar = inputValue.charAt(inputValue.length - 1);
        if(!(/^[a-zA-Zа-яА-Я-]+$/.test(lastChar))) {
            e.target.value = inputValue.slice(0, -1);
        }
        setSurnameValid(true);
        setSurnameText(inputValue);
    }

    function handleEmailInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        setEmailError("");
        setEmailText(inputValue);
    }

    return (

        <div className="profile_change_div_form">
            <label style={{fontWeight: 600}}>Изменить профиль</label>
            <form className="change_profile_form">
                <div className="change_photo_div">
                    <img src={person.photoUrl == "" ? userPhoto : person.photoUrl} style={{borderRadius: '100%', width: 100, height: 100}}
                         alt="user profile"/>
                    <div className="input_wrapper">
                        <input type="file" className="change_photo_input" id="change_photo_input" accept="image/*"/>
                        <label htmlFor="change_photo_input" className="input_file_button">
                            <span className="change_photo_input_text">Загрузить</span>
                        </label>
                    </div>
                </div>
                <Form handleInput={handleNameInput} error={nameValid ? "" : "Поле не может быть пустым"} text={nameText}
                      label="Имя" name="name" defaultValue={person.name}/>
                <Form handleInput={handleSurnameInput} error={surnameValid ? "" : "Поле не может быть пустым"} text={surnameText}
                      label="Фамилия" name="surname" defaultValue={person.surname}/>
                <Form handleInput={handleEmailInput} error={emailError} text={emailText} label="Email" name="email"
                defaultValue={person.email}/>
                <DatePicker
                    selected={person.birthdate}
                    onChange={(date) => setBirthdate(date)}
                    maxDate={moment().subtract(18, 'years').toDate()}
                    dateFormat={"dd.MM.yyyy"}
                    required={true}
                    placeholderText="Дата рождения"
                    className="custom-datepicker"
                    wrapperClassName="custom-datepicker-wrapper"
                />


                <div className="change_password_div">
                    Пароль
                    <label className="change_password_button" onClick={openSecondPopup}>Изменить</label>
                </div>

                <div className="change_profile_buttons" >
                    <label className="cancel_changes">Отмена</label>
                    <label className="submit_changes" onClick={handleChanges}>Сохранить</label>
                </div>
                <label style={{display: success ? 'initial' : 'none', color: 'green', marginTop: 25,
                    textAlign: "center", fontSize: 17}}>Данные успешно изменены</label>

            </form>
        </div>
    )
}

export default ProfileChangeForm;