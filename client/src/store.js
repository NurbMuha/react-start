import { createStore, combineReducers } from 'redux';
import authReducer from './authReducer';
import notificationReducer from './notificationReducer';


const rootReducer = combineReducers({
    auth: authReducer,
    notifications: notificationReducer,
});

const store = createStore(rootReducer);

export default store;