const isEmpty = value => value === undefined || value === null || value === '';
// const join = (rules) => (value, data) => rules.map(rule => rule(value, data)).filter(error => !!error)[0 /* first error */ ];

export function email(value) {
    // Let's not start a debate on email regex. This is just for an example app!
    if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
        // return 'Invalid email address';
        return 'E-mail invalide';
    }
}

export function required(value) {
    if (isEmpty(value)) {
        // return 'Required';
        return 'Requis';
    }
}

export function minLength(min) {
    return value => {
        if (!isEmpty(value) && value.length < min) {
            // return `Must be at least ${min} characters`;
            return `Doit avoir au moins ${min} caractères`;
        }
    };
}

export function maxLength(max) {
    return value => {
        if (!isEmpty(value) && value.length > max) {
            // return `Must be no more than ${max} characters`;
            return `Doit avoir au maximum ${max} caractères`;
        }
    };
}

export function integer(value) {
    if (!Number.isInteger(Number(value))) {
        // return 'Must be an integer';
        return 'Doit être un entier';
    }
}

// export function oneOf(enumeration) {
//     return value => {
//         if (!~enumeration.indexOf(value)) {
//             return `Must be one of: ${enumeration.join(', ')}`;
//         }
//     };
// }

/**
 * for email/password confirmation
 * @param  {String} field : email/password,...
 * @return {String}       error
 */
export function match(field) {
    return (value, data) => {
        if (data) {
            if (value !== data[field]) {
                // return 'Do not match';
                return 'Ne correspond pas';
            }
        }
    };
}

/**
 * rules can be function of function
 * test all the validations, last one priority
 * @param  {object} rules : all inputs + array of rules functions
 * @return {object}       errors {key: message}
 */
export function createValidator(rules) {
    //values updates at each event
    return (values = {}) => {
        const errors = {};
        //for each input
        Object.keys(rules).forEach((key) => {
            rules[key].forEach((rule) => {
                //validate if return undefined
                const error = rule(values[key], values);

                if (error) {
                    errors[key] = error;
                }
            });
        });
        return errors;
    };
}
