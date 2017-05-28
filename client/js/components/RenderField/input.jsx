import React from 'react';
// import styles from './RenderField.scss';

export default ({ input, label, name, className, placeholder, maxLength, type, meta: { active, touched, error }, errorAsync}) => (
    <div className={(touched && error) || errorAsync ? "form-group has-error" : "form-group"}>
        { type !== 'radio' && label &&
            <label>{label}</label>
        }
        {
            type !== 'radio' &&
            <input {...input}
                type={type}
                name={name}
                className={className}
                placeholder={placeholder}
                maxLength={maxLength}
            />
        }
        {
            type === 'radio' &&
            <div>
                <label>
                    <input {...input}
                        type={type}
                        name={name}
                        className={className}
                        placeholder={placeholder}
                        maxLength={maxLength}
                    /> {label}
                </label>
            </div>
        }
        {touched && error && !errorAsync && <span className="error text-danger"> <i className="fa fa-exclamation-circle"/> {error}</span>}
        {errorAsync && <span className="error text-danger"> <i className="fa fa-exclamation-circle"/> {errorAsync}</span>}
    </div>
);
