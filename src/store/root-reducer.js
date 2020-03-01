import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "localforage";
import authReducer from "store/auth/auth.reducer";
import currentUserReducer from "store/current-user/current-user.reducer";

const persistConfig = {
  key: "cah",
  storage,
  whitelist: ["auth"]
};

const rootReducer = combineReducers({
  auth: authReducer,
  currentUser: currentUserReducer
});

export default persistReducer(persistConfig, rootReducer);
