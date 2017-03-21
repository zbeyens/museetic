import React from 'react';

const BtnInfo = function(props) {
    return (
        <button
            className="btn btn-info btn-circle btn-lg dropdown-button"
            data-toggle="modal"
            data-target={"#" + props.art._id}>
            <i className="fa fa-info"/>
        </button>
    );
};

export default BtnInfo;
