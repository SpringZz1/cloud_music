import { combineReducers } from 'redux-immutable';
import { reducer as recommendReducer } from '../application/Recommend/store/index'; // recommend模块的reducer
import { reducer as singerReducer } from '../application/Singers/store/index'; // singers模块的reducer
import { reducer as rankReducer } from '../application/Rank/store/index'; // rank模块的reducer
import { reducer as albumReducer } from '../application/Album/store/index'; // album模块的reducer
import { reducer as singerInfoReducer } from '../application/Singer/store/index'; // singer模块的reducer
import { reducer as playerReducer } from '../application/Player/store/index'; // player模块的reducer

// 将所有reducer注册到全局store
export default combineReducers({
  // 等到开发具体模块的时候添加reducer
  recommend: recommendReducer,
  singers: singerReducer,
  rank: rankReducer,
  album: albumReducer,
  singerInfo: singerInfoReducer,
  player: playerReducer,
});
