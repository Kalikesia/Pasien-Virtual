import{
    DATABASE_DISPLAY_REQUEST,
    DATABASE_DISPLAY_SUCCESS,
    DATABASE_DISPLAY_FAIL
} from "../constants/wordConstants"

export const databaseDisplay = (state = {}, action) => {
    switch (action.type){
        case DATABASE_DISPLAY_REQUEST:
            return { loading: true }
        case DATABASE_DISPLAY_SUCCESS:
            return { loading: true, products: action.payload };
        case DATABASE_DISPLAY_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
}