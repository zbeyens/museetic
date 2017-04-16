import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import Divider from 'material-ui/Divider';

import { deleteComment, fetchComments } from '../../actions/artActions';
import styles from './ListComment.scss';

@connect(
    state => ({
        user: state.auth.user,
        comments: state.art.comments,
    }),
    dispatch => bindActionCreators({
        fetchComments,
        deleteComment
    }, dispatch)
)
class ListComment extends Component {
    constructor(props) {
        super(props);
        this.state = {now: new Date()};
        this.onAuthorClick = this.onAuthorClick.bind(this);
        this.handleDeleteCom = this.handleDeleteCom.bind(this);
    }

    componentDidMount() {
        this.props.fetchComments(this.props.art._id);

        this.time = setInterval(() => {
            this.setState({now: new Date()});
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.time);
    }

    onAuthorClick(userId) {
        browserHistory.push('/user/' + userId);
    }

    handleDeleteCom(comId) {
        this.props.deleteComment(this.props.art._id, comId);
    }

    render() {
        const { comments, user} = this.props;
        moment.locale('fr');

        return (
            <div>
                {comments.slice(0).reverse().map((com, i) => (
                    <div key={com._id}>
                        <Divider />
                        <div className={styles.comContainer} >
                            <div className={styles.comLeft}>
                                <img src="client/img/user-image32.png" alt="" />
                            </div>
                            <div className={styles.comRight}>
                                <div className={styles.comAuthor}>
                                    <a className={styles.a}
                                        href="javascript:void(0)"
                                        onClick={() => this.onAuthorClick(com.author._id)} >
                                        <strong>{com.author.name}</strong>
                                    </a>
                                    <span className={styles.comDate}> · {moment(com.date).from(this.state.now)}</span>

                                    {user._id === com.author._id &&
                                        <button type="button"
                                            className="close"
                                            aria-label="Close"
                                            onClick={() => this.handleDeleteCom(com._id)}>
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    }
                                </div>
                                <div>{com.content}</div>

                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default ListComment;
