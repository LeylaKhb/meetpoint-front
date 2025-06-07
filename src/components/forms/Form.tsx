import React from "react";

interface FormProps {
    handleInput: any;
    error: string;
    text: string;
    label: string;
    name: string;
    defaultValue?: string;
}

const Form: React.FC<FormProps> = ({handleInput, error, text, label, name,
                                   defaultValue}) => {

    return (
        <div style={{width: '100%'}}>
            <input type="text" className="registration_input" onInput={handleInput} name={name}
                   defaultValue={defaultValue} id="email_input"/>
            <div className="login_form_label" style={{transform: text !== "" ?
                    'translate(-20px, -50px) scale(0.8)' : "translate(20px, -30px)"}}>{label}</div>
            <div className="login_form_error" style={{visibility: error === "" ? "hidden" : "visible"}}>{error}</div>
        </div>
    )
}

export default Form;