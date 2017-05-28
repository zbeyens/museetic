import {
    createValidator,
    required,
    // maxLength,
} from '../../utils/validation';

const validator = createValidator({
    picture: [required],
    title: [required],
    subtitle: [],
    desc: [],
});
export default validator;
