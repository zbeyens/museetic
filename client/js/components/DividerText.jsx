import React, {Component} from 'react'

class DividerText extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="or">
                <hr className="orHr" />
                <span className="orSpan">
                    {this.props.text}
                </span>
            </div>
        );
    }

}

export default DividerText;
