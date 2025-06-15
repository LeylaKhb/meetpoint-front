import React, {useState} from "react";
import {Person} from "../../models/Person";
import PasswordForm from "../forms/PasswordForm";
import Form from "../forms/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';

const apiUrl = process.env.REACT_APP_API_URL;
const appUrl = process.env.REACT_APP_URL;

interface LoginFormProps {
    location: string
}

const LoginForm: React.FC<LoginFormProps> = ({location}) => {
    const [passwordError, setPasswordError] = useState("");
    const [nameError, setNameError] = useState("");
    const [surnameError, setSurnameError] = useState("");
    const [emailError, setEmailError] = useState("");

    let buttonText = location === "registration" ? 'Зарегистрироваться' : 'Войти';
    let [passwordText, setPasswordText] = useState("");
    let [emailText, setEmailText] = useState("");
    let [nameText, setNameText] = useState("");
    let [surnameText, setSurnameText] = useState("");
    let [birthdate, setBirthdate] = useState<Date | null>(null);


    function checkEmail() {
        if (!(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+$/.test(emailText))) {
            setEmailError("Неправильная электронная почта");
            return false;
        }
        return true;
    }

    function checkName() {
        if (nameText.length === 0) {
            setNameError("Поле не может быть пустым");
            return false;
        }
        return true;
    }

    function checkSurname() {
        if (surnameText.length === 0) {
            setSurnameError("Поле не может быть пустым");
            return false;
        }
        return true;
    }

    function checkPassword() {
        const containsLetters = /^.*[a-zA-Z]+.*$/
        const minimum6Chars = /^.{6,}$/
        if (!(containsLetters.test(passwordText) &&
            minimum6Chars.test(passwordText))) {
            setPasswordError("Пароль должен быть от 6 символов и содержать буквы латинского алфавита");
            return false;
        }
        return true;
    }

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        let email = checkEmail();
        let password = checkPassword();
        let name = checkName();
        let surname = checkSurname();

        if (!email || !password) return;
        let person;
        if (location === "registration") {
            if (!name || !surname) return;
            if (birthdate == null) return;
            person = new Person(emailText, passwordText, birthdate, nameText, surnameText)
        } else {
            person = new Person(emailText, passwordText);
        }

        let url = apiUrl + (location === "registration" ? '/register' : '/login');
        fetch(url, {
            method: 'POST',
            credentials: "same-origin",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(person),
        })
            .then(function (response) {
                return response.json().then(function (data) {
                    if (response.ok) {
                        localStorage.setItem("access", data.accessToken);
                        localStorage.setItem("refresh", data.refreshToken);
                        window.location.assign(appUrl + (location === "registration" ? '/test' : ''));
                    } else {
                        let errorMessage = "Ошибка входа или регистрации";
                        switch (response.status) {
                            case 400:
                                errorMessage = "Некорректные данные запроса";
                                break;
                            case 401:
                                errorMessage = "Неверные учетные данные";
                                break;
                            case 409:
                                errorMessage = "Пользователь с таким email уже существует";
                                break;
                        }

                        setPasswordError(errorMessage);
                    }
                });
            })
            .catch(function (error) {
                console.log('There has been a problem with your fetch operation: ' + error.message);
                setPasswordError("Ошибка сети или сервера");
            });
    }

    function handlePasswordInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        setPasswordError("");
        setPasswordText(inputValue);
    }

    function handleEmailInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        setEmailError("");
        setEmailText(inputValue);
    }

    function handleNameInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        let lastChar = inputValue.charAt(inputValue.length - 1);
        if (!(/^[a-zA-Zа-яА-Я-]+$/.test(lastChar))) {
            e.target.value = inputValue.slice(0, -1);
        }
        setNameError("");
        setNameText(inputValue);
    }

    function handleSurnameInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        let lastChar = inputValue.charAt(inputValue.length - 1);
        if (!(/^[a-zA-Zа-яА-Я-]+$/.test(lastChar))) {
            e.target.value = inputValue.slice(0, -1);
        }
        setSurnameError("");
        setSurnameText(inputValue);
    }

    return (
        <form action="" method="POST" className="registration_form" onSubmit={handleSubmit}>
            {location === "registration" &&
              <><Form handleInput={handleNameInput} error={nameError}
                      text={nameText} label="Имя" name="name"/>
                <Form handleInput={handleSurnameInput} error={surnameError}
                      text={surnameText} label="Фамилия" name="surname"/>
                <DatePicker
                  selected={birthdate}
                  onChange={(date) => setBirthdate(date)}
                  maxDate={moment().subtract(18, 'years').toDate()}
                  dateFormat={"dd.MM.yyyy"}
                  required={true}
                  placeholderText="Дата рождения"
                  className="custom-datepicker"
                  wrapperClassName="custom-datepicker-wrapper"
                />
              </>
            }
            <Form handleInput={handleEmailInput} error={emailError}
                  text={emailText} label="Email" name="email"/>
            <PasswordForm handleInput={handlePasswordInput} error={passwordError}
                          passwordText={passwordText} label="Пароль"/>
            <button type="submit" className="registration_form_button">{buttonText}</button>
        </form>
    )
}

export default LoginForm;