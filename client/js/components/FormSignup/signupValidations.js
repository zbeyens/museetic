import {
    createValidator,
    required,
    // maxLength,
    email
} from '../../utils/validation';
// import cfg from '../../../../shared/config';


const signupValidation = createValidator({
    name: [required],
    email: [required, email],
    password: [required]
});
export default signupValidation;
