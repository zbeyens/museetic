import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
// import { Form } from 'elements';
import { Field } from 'redux-form';

class FileInput extends Component {
  static defaultProps = {
    className: '',
    cbFunction: () => {},
  };

  render() {
    const { className, input: { onChange }, dropzoneOptions, meta: { error, touched }, label, classNameLabel, children, name, cbFunction } = this.props;

    return (
      <div className={`${className}` + (error && touched ? ' has-error ' : '')}>
        {label && <p className={classNameLabel || ''}>{label}</p>}
        <Dropzone
          {...dropzoneOptions}
          onDrop={(f) => {
            cbFunction(f);
            return onChange(f);
          }}
          className="dropzone-input"
          name={name}
        >
          {children}
        </Dropzone>
        {error && touched ? error : ''}
      </div>
    );
  }
}
export default props => <Field {...props} component={FileInput} />;
