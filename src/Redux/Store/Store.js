import { applyMiddleware, createStore } from 'redux'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import { Reducer } from '../Reducer/Reducer';

const persistConfig = {
    key: "Token",
    storage,
};

const persistedReducer = persistReducer(persistConfig, Reducer);

const Store = createStore(persistedReducer, applyMiddleware(thunk))
export default Store;
export const persistor = persistStore(Store);
