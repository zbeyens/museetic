import {
    createValidator,
    required,
    // maxLength,
} from '../../utils/validation';

const validator = createValidator({
    picture: [],
    name: [required],
    url: [],
    address: [required],
    tel: [],
    fax: [],
    open: [],
    close: [],
    tarif: [],
    desc: [],
});
export default validator;
