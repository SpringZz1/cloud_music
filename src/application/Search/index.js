import React, { useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Container, ShortcutWrapper, HotKey } from './style';
import { useNavigate } from 'react-router';
import SearchBox from './../../baseUI/search-box/index';
import { connect } from 'react-redux';
import {
  changeEnterLoading,
  getHotKeyWords,
  getSuggestList,
} from './store/actionCreators';
import Scroll from '../../baseUI/scroll';

function Search(props) {
  const {
    hotList,
    enterLoading,
    suggestList: immutableSuggestList,
    songCount,
    songList: immutableSongsList,
  } = props;

  const suggestList = immutableSongsList.toJS();
  const songList = immutableSongsList.toJS();

  const {
    getHotKeyWordsDispatch,
    changeEnterLoadingDispatch,
    getSuggestListDispatch,
    getSongDetailDispatch,
  } = props;
  // 控制动画
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setShow(true);
  }, []);

  const setShowFalse = () => {
    console.log('setShowFalse function');
  };

  // 由于是传给子组件的方法, 尽量使用useCallBack包裹, 使得在依赖未改变, 始终给子组件传递给的是相同的引用
  const searchBack = useCallback(() => {
    setShow(false);
  }, []);

  const handleQuery = (q) => {
    setQuery(q);
  };

  return (
    <CSSTransition
      in={show}
      timeout={300}
      appear={true}
      classNames="fly"
      unmountOnExit
      onExit={() => navigate(-1)}
    >
      <Container>
        <div className="search_box_wrapper">
          <SearchBox
            back={searchBack}
            newQuery={query}
            handleQuery={handleQuery}
          ></SearchBox>
        </div>
        {/* <div onClick={() => setShowFalse}>返回</div> */}
      </Container>
    </CSSTransition>
  );
}

// 映射Redux全局的state到组件props上
const mapStateToProps = (state) => ({
  hotList: state.getIn(['search', 'hotList']),
  suggestList: state.getIn(['search', 'suggestList']),
  songList: state.getIn(['search', 'songList']),
  enterLoading: state.getIn(['search', 'enterLoading']),
  songCount: state.getIn(['player', 'playList']).size,
});

// 映射Redux的dispatch到组件props上
const mapDispatchToProps = (dispatch) => {
  return {
    getHotKeyWordsDispatch() {
      dispatch(getHotKeyWords());
    },
    changeEnterLoadingDispatch(data) {
      dispatch(changeEnterLoading(data));
    },
    getSuggestListDispatch(data) {
      dispatch(getSuggestList(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search));
