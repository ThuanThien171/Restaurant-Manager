function reducerUpdateSidebar(state = 0, action) {
    switch (action.type) {
        case "UPDATE_SIDEBAR":
            state = action.data;
            return state;
        default:
            return state;
    }
}

export default reducerUpdateSidebar;