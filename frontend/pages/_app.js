import '../styles/globals.css'
import '../styles/login.scss'
import { store } from "../store"
import { Provider } from "react-redux"
import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import { databaseDisplay } from '../reducers/wordReducers';

const reducer = combineReducers({
  databaseList: databaseDisplay
});

const initialState = {};

const middleware = [thunk];

const newstore = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

function MyApp({ Component, pageProps }) {
  return(
    <Provider store = {newstore}>
      <Component {...pageProps} />
    </Provider> 
  )
}

export default MyApp
