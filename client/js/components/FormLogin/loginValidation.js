import {
    createValidator,
    required,
    maxLength,
    email
} from '../../utils/validation';

const validator = createValidator({
    email: [required, email],
    password: [required, maxLength(20)]
});
export default validator;
