import React from 'react';

const BtnInfo = function(props) {
    return (
        <button
            className="btn btn-info btn-circle btn-lg dropdown-button"
            data-toggle="modal"
            data-target="#modalArt">
            <i className="fa fa-info"/>
        </button>
    );
};

export default BtnInfo;
