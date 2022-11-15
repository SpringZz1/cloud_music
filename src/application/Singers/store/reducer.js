import { fromJS } from 'immutable';

const defaultState = fromJS({
  singerList: [],
  enterLoading: true, // 控制进场Loading
  pullUpLoading: false, // 控制上拉加载动画
  pullDownLoading: false, // 控制下拉加载动画
  pageCount: 0, // 当前页数, 接下来要做一个分页功能
});
