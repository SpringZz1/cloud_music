import * as actionTypes from './constants';
import { fromJS } from 'immutable'; // 这里使用到fromJS把JS数据转化为immutable数据结构

const defaultState = fromJS({
  bannerList: [],
  recommendList: [],
  enterLoading: true,
});

// 因为是使用immutable数据结构，所以必须使用set来改变新状态，同时取状态使用get方法

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_BANNER:
      return state.set('bannerList', action.data);
    case actionTypes.CHANGE_RECOMMEND_LIST:
      return state.set('recommendList', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    default:
      return state;
  }
};
