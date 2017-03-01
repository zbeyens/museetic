import React from 'react';

const BtnComment = function(props) {
    return (
        <button className="btn btn-info btn-circle btn-lg dropdown-button"
            disabled="disabled">
            <i className="fa fa-comments"/>
        </button>
    );
};

export default BtnComment;
