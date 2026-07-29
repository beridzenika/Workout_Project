import { Link } from "react-router-dom";

import LogoIcon from '../assets/icons/Logo.svg?react';
import LockIcon from '../assets/icons/Lock.svg?react';


const authConfigs = {
    login: {
        buttonText: "Log in",
        footerText: "Don't have an account?",
        footerLink: "Register",
        footerPath: "/register",
        fields: [
            {
                name: "email",
                type: "email",
                placeholder: "email",
            },
            {
                name: "password",
                type: "password",
                placeholder: "password",
                icon: LockIcon
            }
        ]
    },

    register: {
        buttonText: "Sign up",
        footerText: "Already have an account?",
        footerLink: "Login",
        footerPath: "/login",
        fields: [
            {
                name: "email",
                type: "email",
                placeholder: "email",
            },
            {
                name: "username",
                type: "text",
                placeholder: "username",
            },
            {
                name: "password",
                type: "password",
                placeholder: "password",
                icon: LockIcon
            },
            {
                name: "confirmPassword",
                type: "password",
                placeholder: "confirm password",
                icon: LockIcon
            }
        ]
    }
}

function AuthForm({mode}) {
    const config = authConfigs[mode];
    return (
    <div className="auth-container">
        <div className="auth-logo">
            <Link to="/">
                <LogoIcon width={100} height={100} className="logo-box icon"/>
            </Link>
            <div className="text-heading">Planbell</div>
        </div>

        <form className="auth-form">
            {config.fields.map(field => (
            <div className="input-wrapper">
                <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                />
                {field.icon && <field.icon className="field-icon icon" />}
            </div>
            ))}
            
            <button className="primary-btn auth-btn">{config.buttonText}</button>
        </form>

        <div className="auth-footer">
            <span className="text-dark">{config.footerText} </span>
            <Link to={config.footerPath} className="text-link">
                {config.footerLink}
            </Link>
        </div>
        
    </div>
  )
}

export default AuthForm;