import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';

const styles = {
    width: '100%',
};

const FlatButtonExampleComplex = () => (
    <div>
        <FlatButton
            href="#"
            label="Museetic"
            secondary={true}
            icon={<i className="cafe"/>}
            />
    </div>
);

export default FlatButtonExampleComplex;
