import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import AutoComplete from 'material-ui/AutoComplete';
import IconButton from 'material-ui/IconButton';

// import { AutoComplete } from 'redux-form-material-ui';
import { fetchSuggestions, fetchUserProfile, updateInput } from '../../actions/userActions';
import styles from './SearchProfile.scss';


@connect(
    state => ({
        inputTime: state.user.inputTime,
        loading: state.user.loading,
        suggestions: state.user.suggestions,
        value: state.user.value,
        userProfile: state.user.userProfile
    }),
    dispatch => bindActionCreators({
        fetchSuggestions,
        fetchUserProfile,
        updateInput
    }, dispatch)
)
class SearchProfile extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdateInput = this.onUpdateInput.bind(this);
    }

    componentDidMount() {
        if (this.searchInterval) return;
        this.searchInterval = setInterval(() => {
            if (!this.props.loading || new Date() - this.props.inputTime < 100) return;

            this.props.fetchSuggestions(this.props.value);
        }, 100);
    }

    onSubmit(chosenRequest, index) {
        //NOTE: index=-1 if enter
        if (!chosenRequest) return;
        const chosenUser = this.props.suggestions[index];
        if (!chosenUser) return;

        if (this.props.userProfile) {
            this.props.fetchUserProfile(1, chosenUser._id);
        }

        browserHistory.push('/user/' + chosenUser._id);
    }

    onUpdateInput(searchText, dataSource, params) {
        this.props.updateInput(searchText);
    }

    render() {
        const { suggestions } = this.props;
        //config for Object list i.e. suggestions = [{name, _id}]
        const dataSourceConfig = {
            text: 'name',
            value: '_id',
        };

        return (
            <form className="navbar-form navbar-left" onSubmit={this.onSubmit}>
                <div className={"input-group input-group-sm " + styles.inputGroup}>
                    <AutoComplete
                        className={styles.inputSearch}
                        onNewRequest={this.onSubmit}
                        onUpdateInput={this.onUpdateInput}
                        hintText="Rechercher un membre"
                        dataSource={suggestions}
                        dataSourceConfig={dataSourceConfig}
                        filter={AutoComplete.noFilter}
                        openOnFocus
                        fullWidth
                    />

                    <span className="input-group-btn">
                        <div>
                            <IconButton
                                iconClassName={"fa fa-search " + styles.iconButton}
                            />
                        </div>
                    </span>
                </div>
            </form>
        );
    }
}

export default SearchProfile;
