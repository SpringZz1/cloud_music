import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
  hotList: [], // 热门关键词列表
  suggestList: [], // 列表, 包括歌单和歌手
  songList: [], // 歌曲列表
  enterLoading: false,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_HOT_KEYWORDS:
      return state.set(['hotList', action.data]);
    case actionTypes.SET_SUGGEST_LIST:
      return state.set(['hotList', action.data]);
    case actionTypes.SET_RESULT_SONGS:
      return state.set(['hotList', action.data]);
    case actionTypes.SET_ENTER_LOADING:
      return state.set('hotList', action.data);
    default:
      return state;
  }
};