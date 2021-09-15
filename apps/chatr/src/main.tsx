import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { store } from '@chatr/redux';
import App from './App';

ReactDOM.render(
  <StrictMode>
    <Provider {...{ store }}>
      <App />
    </Provider>
  </StrictMode>,
  document.getElementById('root')
);
