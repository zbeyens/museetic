import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AutoComplete from 'material-ui/AutoComplete';

import { setDestMessage } from '../../actions/chatActions';
import { fetchSuggestions, fetchUserProfile, updateInput } from '../../actions/userActions';
import styles from './SearchName.scss';


@connect(
    state => ({
        user: state.auth.user,
        inputTime: state.user.inputTime,
        loading: state.user.loading,
        suggestions: state.user.suggestions,
        value: state.user.value,
    }),
    dispatch => bindActionCreators({
        fetchSuggestions,
        fetchUserProfile,
        updateInput,
        setDestMessage
    }, dispatch)
)
//NOTE: nearly same as SearchProfile
class SearchName extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdateInput = this.onUpdateInput.bind(this);
    }

    componentDidMount() {
        this.props.setDestMessage(null);

        if (this.searchInterval) return;
        this.searchInterval = setInterval(() => {
            if (!this.props.loading || new Date() - this.props.inputTime < 100) return;

            this.props.fetchSuggestions(this.props.value);
        }, 100);
    }

    onSubmit(chosenRequest, index) {
        if (!chosenRequest) return;
        const chosenUser = this.props.suggestions[index];

        this.props.setDestMessage(chosenUser);
    }

    onUpdateInput(searchText, dataSource, params) {
        this.props.updateInput(searchText);
    }

    render() {
        const suggestions = [];
        for (let i = 0; i < this.props.suggestions.length; i++) {
            if (this.props.suggestions[i]._id !== this.props.user._id) {
                suggestions.push(this.props.suggestions[i]);
            }
        }
        //config for Object list i.e. suggestions = [{name, _id}]
        const dataSourceConfig = {
            text: 'name',
            value: '_id',
        };

        return (
            <form className="navbar-form navbar-left" onSubmit={this.onSubmit}>
                <div className={"input-group input-group-sm margin-t10 padding-t5"}>
                    <strong>Envoyer à:</strong>
                    <AutoComplete
                        className={styles.inputSearch}
                        onNewRequest={this.onSubmit}
                        onUpdateInput={this.onUpdateInput}
                        hintText="Entrez un nom"
                        dataSource={suggestions}
                        dataSourceConfig={dataSourceConfig}
                        filter={AutoComplete.noFilter}
                        openOnFocus
                        fullWidth
                    />
                </div>
            </form>
        );
    }
}

export default SearchName;
