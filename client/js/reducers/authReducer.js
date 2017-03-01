const initialState = {
    loading: false,
    loaded: false, //true if user != null
    user: null,
    loginError: null,
    signupError: null,
    // loggedIn: false, error: null
};


export default function reducer(state = initialState, action) {
    switch (action.type) {
        case "LOAD_REQUEST":
            return {
                ...state,
                loading: true,
            };
        case "LOAD_SUCCESS":
            return {
                ...state,
                loading: false,
                loaded: true,
                user: action.payload
            };
        case "SIGNUP_ERROR":
            return {
                ...state,
                signupError: action.payload
            };
        case "LOGIN_SUCCESS":
            return {
                ...state,
                loaded: true,
                user: action.payload
            };
        case "LOGIN_ERROR":
            return {
                ...state,
                loginError: action.payload
            };

        case "LOGOUT_SUCCESS":
            return {
                ...state,
                loaded: true,
                user: false
            };
    }
    //return initial state!
    return state;
}
