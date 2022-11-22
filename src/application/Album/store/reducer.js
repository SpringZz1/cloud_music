import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultStatus = fromJS({
  currentAlbum: {},
  enterLoading: false,
});

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = defaultStatus, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_CURRENT_ALBUM:
      return state.set('currentAlbum', action.data);
    case actionTypes.CHANGE_ENTER_LOADING:
      return state.set('enterLoading', action.data);
    default:
      return state;
  }
};
