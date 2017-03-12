import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import AutoComplete from 'material-ui/AutoComplete';

// import { AutoComplete } from 'redux-form-material-ui';
import { search, updateInput } from '../../actions/searchActions';
import searchValidation from './searchValidation';
import styles from './InputSearch.scss';

@reduxForm({
    form: 'search',
    validate: searchValidation,
})
@connect(
    state => ({
        inputTime: state.search.inputTime,
        loading: state.search.loading,
        users: state.search.users,
        value: state.search.value,
    }),
    dispatch => bindActionCreators({
        search,
        updateInput
    }, dispatch)
)
class InputSearch extends Component {
    constructor(props) {
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
        this.onUpdateInput = this.onUpdateInput.bind(this);
    }

    componentDidMount() {
        if (this.searchInterval) return;
        this.searchInterval = setInterval(() => {
            if (!this.props.loading || new Date() - this.props.inputTime < 350) return;

            this.props.search(this.props.value);
        }, 100);
    }

    onSubmit(values) {
        // this.props.reset();
        console.log(values);
        this.props.search(values);
    }

    onUpdateInput(value) {
        this.props.updateInput(value);
    }

    render() {
        const { handleSubmit, users } = this.props;
        console.log(users);

        // <Field
        //     name="search"
        //     component={AutoComplete}
        //     hintText="Rechercher"
        //     dataSource={users}
        //     onUpdateInput={this.onUpdateInput}
        //     className={"form-control " + styles.inputSearch}
        //     type="text"
        //     placeholder="Rechercher"
        //     size="30"
        // />
        return (
            <form className="navbar-form navbar-left" onSubmit={handleSubmit(this.onSubmit)}>
                <div className={"input-group input-group-sm " + styles.inputGroup}>
                    <AutoComplete
                        className={styles.inputSearch}
                        onUpdateInput={this.onUpdateInput}
                        hintText="Rechercher"
                        dataSource={users}
                        filter={AutoComplete.noFilter}
                        openOnFocus
                        fullWidth
                    />

                    <span className="input-group-btn">
                        <button className="btn btn-info" type="submit">
                            <i className="fa fa-search"/>
                        </button>
                    </span>
                </div>
            </form>
        );
    }
}

export default InputSearch;
