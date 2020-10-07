import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';

import { IApplicationState, createRootReducer } from 'store';

const configureStore = (history: History, startingState: IApplicationState) => {
  // create the composing function for middlewares
  const composeEnhancers = composeWithDevTools({});

  const store = createStore(
    createRootReducer(history),
    startingState,
    composeEnhancers(applyMiddleware(routerMiddleware(history))),
  );

  return store;
};

export default configureStore;
