import React from 'react';

const BtnLike = function(props) {
    return (
        <button className="btn btn-primary btn-circle btn-lg dropdown-button"
            disabled="disabled">
            <i className="fa fa-heart"/>
        </button>
    );
};

export default BtnLike;
