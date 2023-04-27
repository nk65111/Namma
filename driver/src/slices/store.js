import { applyMiddleware } from "redux";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import counterReducer from './counterSlice'
import travelReducer from './travelSlice'
import userReducer from './userSlice'
import { configureStore } from "@reduxjs/toolkit";

const analytics = () => (next) => (action) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: action.type,
    payload: action.payload,
  });
  return next(action);
};

// Redux store config
const createStore = () => {
  const middlewares = [
    process.env.NODE_ENV !== "production" && logger,
    analytics,
  ].filter(Boolean);

  const store = configureStore(
    {
      reducer: {
        counter: counterReducer,
        travel: travelReducer,
        user: userReducer
      }
    },
    composeWithDevTools(applyMiddleware(...middlewares))
  );
  return store;
};

const store = createStore();

export default store;
