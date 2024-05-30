import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import allReducers from "redux/reducers/index";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";

import axios from 'axios';
require('dotenv').config();
//axios.defaults.baseURL = "http://localhost:8080/";
axios.defaults.baseURL = process.env.REACT_APP_BE_URL;

//local storage
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from "redux-persist/lib/integration/react";
import storage from 'redux-persist/lib/storage';


const persistConfig = {
  key: 'root',
  storage: storage,
};
const pReducer = persistReducer(persistConfig, allReducers);

const store = createStore(pReducer);
export default store;

export const persistor = persistStore(store);
// export const persistor = persistStore(store); persistor={persistor}//provider line

ReactDOM.render(
  <HashRouter>
    <Provider store={store} >
      <PersistGate loading={<Switch />} persistor={persistor}>
        <Switch>
          <Route path={`/auth`} component={AuthLayout} />
          <Route path={`/remat`} component={AdminLayout} />
          <Redirect from={`/`} to="/remat/home" />
        </Switch>

      </PersistGate>
    </Provider>
  </HashRouter>,
  document.getElementById("root")
);
