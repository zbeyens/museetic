import {
    createValidator,
    required,
    // maxLength,
    email
} from '../../utils/validation';

const validator = createValidator({
    email: [required, email],
    password: [required]
});
export default validator;
