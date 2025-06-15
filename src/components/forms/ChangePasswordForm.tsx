import React, {useState} from "react";
import PasswordForm from "../forms/PasswordForm";

const apiUrl = process.env.REACT_APP_API_URL;

const ChangePasswordForm: React.FC = () => {
    const [secondPasswordError, setSecondPasswordVError] = useState("");
    const [secondPasswordText, setSecondPasswordText] = useState("");

    const [success, setSuccess] = useState(false);


    function handleSecondPasswordInput(e: React.ChangeEvent<HTMLInputElement>) {
        let inputValue = e.target.value;
        setSecondPasswordVError("");
        setSecondPasswordText(inputValue);
        setSuccess(false);
    }

    function checkPassword() {
        const containsLetters = /^.*[a-zA-Z]+.*$/
        const minimum6Chars = /^.{6,}$/
        return containsLetters.test(secondPasswordText) &&
            minimum6Chars.test(secondPasswordText);
    }

    function handleChangeClick() {
        if (!checkPassword()) {
            setSecondPasswordVError("Пароль должен быть от 6 символов и содержать буквы латинского алфавита");
            return;
        }
        fetch(`${apiUrl}/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                "password": secondPasswordText
            })
        }).then(function (resp) {
            resp.json()
                .then(function (data) {
                    if (data["header"] === "error") {
                        setSecondPasswordVError(data["content"]);
                        return;
                    } else {
                        setSuccess(true);
                    }
                })
        });


    }

    return (
        <div className="change_password_form">
            Изменить пароль
            <br/>
            <br/>
            <PasswordForm handleInput={handleSecondPasswordInput} error={secondPasswordError}
                          passwordText={secondPasswordText} label="Новый пароль"/>
            <button type="submit" className="registration_form_button" onClick={handleChangeClick}>Изменить пароль
            </button>
            <label style={{display: success ? 'initial' : 'none', color: 'green', marginTop: 25, fontSize: 17}}>Пароль
                успешно изменён</label>
        </div>
    )
}

export default ChangePasswordForm;