import {
    createValidator,
    required,
} from '../../utils/validation';

const validator = createValidator({
    search: [required]
});
export default validator;
