import { applyMiddleware } from "redux";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import counterReducer from '../slices/counterSlice'
import travelReducer from '../slices/travelSlice'
import userReducer from '../slices/userSlice'
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

  // Middleware and store enhancers
  const middlewares = [
    process.env.NODE_ENV !== "production" && logger,
    analytics,
  ].filter(Boolean);
  // const enhancer = compose(applyMiddleware(...middlewares));
  // const composeEnhancers = composeWithDevTools({});
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
