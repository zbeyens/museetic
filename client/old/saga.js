import {
    call,
    put,
    takeEvery,
    takeLatest
} from 'redux-saga/effects';
// each entity defines 3 creators { request, success, failure }
import * as Api from '../actions/authActions';
// import Api from '...'

/**
 * generator function* = return an iterator.
 * iterator.next(): function executed till the next yield (paused).
 * return {value: yield or return, done: Boolean}. done = true if last value yielded.
 * can be paused (yield) / resumed (.next())
 * when promise is resolved, the saga is resumed
 *
 * Effects: Object interpreted by the middleware
 * call(fn, args[]): creates a description of the effect for the middleware. return Object.
 * put({}): dispatch an action. return Object.
 */
function* login(action) {
    console.log("LOGIN_REQUEST");
    console.log(action.payload);
    try {
        const res = yield call(Api.login, action.payload);
        console.log("succeed");
        console.log(res.data);
        yield put({
            type: "LOGIN_SUCCEED"
        });
    } catch (e) {
        console.log(e.response.data);
        yield put({
            type: "LOGIN_FAIL",
            message: e.response.data
        });
    }
}

/**
 * Starts ... on each dispatched `LOGIN_REQUESTED` action.
 * takeEvery: Allows concurrent fetches of user, like redux-thunk.
 * @return {Generator}
 */
export function* watchLogin() {
    console.log("watching");
    yield takeEvery("LOGIN_REQUEST", login);
}


export default function* rootSaga() {
    yield [
        watchLogin()
    ];
    // yield takeEvery("USER_FETCH_REQUESTED", fetchUser);
}

/*
Alternatively you may use takeLatest.

Does not allow concurrent fetches of user. If "USER_FETCH_REQUESTED" gets
dispatched while a fetch is already pending, that pending fetch is cancelled
and only the latest one will be run.
*/
// function* mySaga() {
//     yield takeLatest("USER_FETCH_REQUESTED", fetchUser);
// }
