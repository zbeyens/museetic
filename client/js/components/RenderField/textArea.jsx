import React from 'react';

export default ({
    input, label, name, className, id,
    maxLength, minLength, cols, rows, placeholder,
    meta: { active, touched, error },
}) => {
    return (
        <div className={(touched && error) ? "form-group has-error" : "form-group"}>
            { label &&
                <label>{label}</label>
            }
            <textarea {...input}
                className={className}
                id={id}
                name={name}
                placeholder={placeholder}
                maxLength={maxLength}
                minLength={minLength}
                rows={rows}
            />
            <div>
                {touched && error && <span className="error text-danger"> <i className="fa fa-exclamation-circle"/> {error}</span>}
            </div>
        </div>
    );
};
