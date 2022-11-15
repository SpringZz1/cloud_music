import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '../application/Recommend/store/index'; // recommend模块的reducer

// 将所有reducer注册到全局store
export default combineReducers({
  // 等到开发具体模块的时候添加reducer
  recommend: recommendReducer,
});
