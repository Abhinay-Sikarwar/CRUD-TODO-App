const initialState = {
    user: {}
}

export const userReducer = (state = initialState, action) => {
   
    switch (action.type) {
        case "LOGIN_SUCCESS":
            return {
                ...state, user: action.payload
            }
        case "LOGIN_ERROR":
            return initialState;
        case "LOGOUT":
            return initialState;
        default:
            return state;
    }
}


// User Login state reducer