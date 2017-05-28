import {
    createValidator,
    required,
    // maxLength,
} from '../../utils/validation';

const validator = createValidator({
    name: [required],
    bio: [],
    picture: [],
    location: [],
    profession: [],
    gender: [],
});
export default validator;
