import React from 'react';
// import styles from './RenderField.scss';

export default ({ input, name, className, placeholder, maxLength, type, meta: { active, touched, error }, errorAsync}) => (
    <div className="margin-t10">
        <div className={(touched && error) || errorAsync ? "form-group has-error" : "form-group"}>
            <input {...input}
                type={type}
                name={name}
                className={className}
                placeholder={placeholder}
                maxLength={maxLength}
            />
            {touched && error && !errorAsync && <span className="error text-danger"> <i className="fa fa-exclamation-circle"/> {error}</span>}
            {errorAsync && <span className="error text-danger"> <i className="fa fa-exclamation-circle"/> {errorAsync}</span>}
        </div>
    </div>
);
