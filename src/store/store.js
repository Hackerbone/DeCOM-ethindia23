import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";

import userReducer from "./user.slice";
const persistConfig = {
  key: "root",
  storage,
  // Add other configuration options if needed
};

const rootReducer = combineReducers({
  user: userReducer,
  // ... add other slices here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // You can add middleware and devTools here
});

export const persistor = persistStore(store);
