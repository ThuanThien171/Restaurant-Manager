function reducerOrder(state = 0, action) {
    switch (action.type) {

        case "ADD_ORDER":
            state = action.data;
            return state;

        default:
            return state;
    }
}

export default reducerOrder