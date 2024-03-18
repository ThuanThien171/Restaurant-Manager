//action.type: LOGIN, LOGOUT

function reducerLogin(state = 0, action) {
    switch (action.type) {
        case "LOGIN":
            state = action.data;
            return state;
        case "LOGOUT":
            state = action.data;
            return state;
        default:
            return state;
    }
}

export default reducerLogin;