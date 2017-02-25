import React from 'react';

export default ({ input, name, className, placeholder, size, type, meta: { active, touched, error }, errorAsync}) => (
    <div>
        <div className={(touched && error) || errorAsync ? "form-group has-error" : "form-group"}>
            <input {...input}
                type={type}
                name={name}
                className={className}
                placeholder={placeholder}
                size={size}/>
            {touched && error && !errorAsync && <span className="error text-danger"> <i className="fa fa-exclamation-circle"/> {error}</span>}
            {errorAsync && <span className="error text-danger"> <i className="fa fa-exclamation-circle"/> {errorAsync}</span>}
        </div>
    </div>
);
