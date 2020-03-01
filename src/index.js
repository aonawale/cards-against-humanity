import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';
import 'firebaseui/dist/firebaseui.css';
import './index.css';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from 'store/store';
import { createTheme, ThemeProvider } from 'lib/theme';
import Root from 'root';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={createTheme()}>
          <Root />
        </ThemeProvider>
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
