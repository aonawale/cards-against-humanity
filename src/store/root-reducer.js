import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'localforage';
import authReducer from 'store/auth/auth.reducer';

const persistConfig = {
  key: 'cah',
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers({
  auth: authReducer,
});

export default persistReducer(persistConfig, rootReducer);
