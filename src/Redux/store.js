// Import necessary functions and modules
import { applyMiddleware, legacy_createStore, combineReducers } from "redux";
import {thunk} from 'redux-thunk';
import { AllListReducer } from "./AllListReducer/reducer"; // Adjust the path if necessary

// Combine reducers (uncomment if you have multiple reducers)
const rootReducer = combineReducers({
    AllListReducer
});

// Create store with the combined reducers and middleware
const store = legacy_createStore(rootReducer, applyMiddleware(thunk));

// Export the store
export { store };
