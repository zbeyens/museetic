import React from 'react';

const BtnShare = function(props) {
    return (
        <button className="btn btn-info btn-circle btn-lg dropdown-button"
            disabled="disabled">
            <i className="fa fa-share-alt"/>
        </button>
    );
};

export default BtnShare;
