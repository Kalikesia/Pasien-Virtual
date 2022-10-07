import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import { databaseDisplay, findBestMatch } from './reducers/wordReducers';

const reducer = combineReducers({
    databaseList: databaseDisplay,
    bestAccuracy: findBestMatch
});

const initialState = {};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;