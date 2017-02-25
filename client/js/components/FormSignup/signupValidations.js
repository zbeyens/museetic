import {
    createValidator,
    required,
    maxLength,
    email
} from '../../utils/validation';

const signupValidation = createValidator({
    name: [required, maxLength(15)],
    email: [required, email],
    password: [required, maxLength(20)]
});
export default signupValidation;
