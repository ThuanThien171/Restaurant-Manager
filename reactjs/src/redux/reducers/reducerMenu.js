function reducerMenu(state = 0, action) {
    switch (action.type) {

        case "ADD_MENU":
            state = action.data;
            return state;

        default:
            return state;
    }
}

export default reducerMenu