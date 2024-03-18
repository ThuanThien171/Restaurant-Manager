import { combineReducers } from 'redux';

import reducerLogin from "../reducers/reducerLogin";
import reducerUpdateSidebar from './reducerUpdateSidebar';
import reducerOrder from './reducerOrder';
import reducerMenu from './reducerMenu';

const allReducers = combineReducers({
  reducerLogin,
  reducerUpdateSidebar,
  reducerOrder,
  reducerMenu,
  // add more reducers here
});

export default allReducers;