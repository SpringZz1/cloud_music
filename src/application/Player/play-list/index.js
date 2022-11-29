import React, { useRef, useState, useCallback, forwardRef } from 'react';
import { connect } from 'react-redux';
import {
  PlayListWrapper,
  ScrollWrapper,
  ListHeader,
  ListContent,
} from './style';
import { CSSTransition } from 'react-transition-group';
import { prefixStyle, getName, shuffle, findIndex } from '../../../api/utils';
import {
  changeShowPlayList,
  changeCurrentIndex,
  changePlayMode,
  changePlayList,
  deleteSong,
  changeSequecePlayList,
  changeCurrentSong,
  changePlayingState,
} from '../store/actionCreators';
import { playMode } from '../../../api/config';
import Scroll from '../../../baseUI/scroll';
import Confirm from './../../../baseUI/confirm/index';

const PlayList = forwardRef((props, ref) => {
  const {
    currentIndex,
    currentSong: immutableCurrentSong,
    showPlayList,
    playList: immutablePlayList,
    mode,
    sequencePlayList: immutableSequencePlayList,
  } = props;
  const {
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changePlayListDispatch,
    changeModeDispatch,
    deleteSongDispatch,
    clearDispatch,
  } = props;

  const { clearPreSong } = props;

  const currentSong = immutableCurrentSong.toJS();
  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();

  const playListRef = useRef();
  const listWrapperRef = useRef();
  const confirmRef = useRef();
  const listContentRef = useRef();

  const [canTouch, setCanTouch] = useState(true);
  const [isShow, setIsShow] = useState(false);
  // touchStart后记录y值
  const startYRef = useRef(0);
  // touchStart事件是否已经被触发
  // const [initialed, setInitialed] = useState(0);
  const initialedRef = useRef(false);
  // 用户下滑的距离
  // 这里使用useRef存值而不是useState以节省资源, useState每次都要render, 及其浪费
  const distanceRef = useRef(0);

  const transform = prefixStyle('transform');

  const onEnterCB = useCallback(() => {
    // 让列表显示
    setIsShow(true);
    // 最开始是隐藏在下面
    listWrapperRef.current.style[transform] = `translated3d(0, 100%, 0)`;
  }, [transform]);

  const onEnteringCB = useCallback(() => {
    // 让列表显示
    listWrapperRef.current.style['transition'] = 'all 0.3s';
    listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
  }, [transform]);

  const onExitingCB = useCallback(() => {
    listWrapperRef.current.style['transition'] = 'all 0.3s';
    listWrapperRef.current.style[transform] = `translat3d(0px., 100%, 0px)`;
  }, [transform]);

  const onExitedCb = useCallback(() => {
    setIsShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
  }, [transform]);

  const getCurrentIcon = (item) => {
    // 是不是当前正在播放的歌曲
    const current = currentSong.id === item.id;
    const className = current ? 'icon-play' : '';
    const content = current ? '&#xe6e3;' : '';
    return (
      <i
        className={`current iconfont ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      ></i>
    );
  };

  const getPlayMode = () => {
    let content, text;
    if (mode === playMode.sequence) {
      content = '&#xe625;';
      text = '顺序播放';
    } else if (mode === playMode.loop) {
      content = '&#xe653;';
      text = '单曲循环';
    } else {
      content = '&#xe61b;';
      text = '随机播放';
    }
    return (
      <div>
        <i
          className="iconfont"
          onClick={(e) => changeMode(e)}
          dangerouslySetInnerHTML={{ __html: content }}
        ></i>
        <span className="text" onClick={(e) => changeMode(e)}>
          {text}
        </span>
      </div>
    );
  };

  const changeMode = (e) => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      // 顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayList);
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  };

  const handleChangeCurrentIndex = (index) => {
    if (currentIndex === index) return;
    changeCurrentIndexDispatch(index);
  };

  const handleDeleteSong = (e, song) => {
    e.stopPropagation();
    deleteSongDispatch(song);
  };

  const handleShowClear = () => {
    confirmRef.current.show();
  };

  // const clearPreSong = () => {
  //   ref.current = {};
  // };

  const handleConfirmClear = () => {
    clearDispatch();
    clearPreSong();
  };

  const changeDistance = (distance) => {
    distanceRef.current = distance;
  };

  const changeStartY = (startY) => {
    startYRef.current = startY;
  };

  const changeInitialed = (initialed) => {
    initialedRef.current = initialed;
  };

  const handleTouchStart = (e) => {
    changeDistance(0);
    if (!canTouch || initialedRef) return;
    listWrapperRef.current.style['transition'] = '';
    changeStartY(e.nativeEvent.touches[0].pageY); // 记录Y值
    changeInitialed(true);
  };
  const handleTouchMove = (e) => {
    if (!canTouch || initialedRef) return;
    let distance = e.nativeEvent.touches[0].pageY - startYRef;
    if (distanceRef < 0) return;
    changeDistance(distance);
    listWrapperRef.current.style.transform = `translated3d(0, ${distance}px,0)`;
  };
  const handleTouchEnd = (e) => {
    changeInitialed(false);
    // 这里设置阈值为150px
    if (distanceRef >= 150) {
      // 大于150px则关闭playList
      togglePlayListDispatch(false);
    } else {
      // 否则反弹回去
      listWrapperRef.current.style['transition'] = 'all 0.3s';
      listWrapperRef.current.style[transform] = `translate3d(0px, 0px, 0px)`;
    }
  };

  const handleScroll = (pos) => {
    // 只有当内容偏移量为0的时候才能下滑关闭PlayList. 否则一边内容在移动，一边列表在移动，出现bug
    let state = (pos.y = 0);
    setCanTouch(state);
  };

  return (
    <CSSTransition
      in={showPlayList}
      timeout={300}
      classNames="list-fade"
      onEnter={onEnterCB}
      onEntering={onEnteringCB}
      onExiting={onExitingCB}
      onExited={onExitedCb}
    >
      <PlayListWrapper
        ref={playListRef}
        style={isShow === true ? { display: 'block' } : { display: 'none' }}
        onClick={() => togglePlayListDispatch(false)}
      >
        <div
          className="list_wrapper"
          ref={listWrapperRef}
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            <h1 className="title">
              {getPlayMode()}
              <span className="iconfont clear" onClick={handleShowClear}>
                &#xe63d;
              </span>
            </h1>
          </ListHeader>
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScroll={(pos) => handleScroll(pos)}
              bounceTop={false}
            >
              <ListContent>
                {playList.map((item, index) => {
                  return (
                    <li
                      className="item"
                      key={item.id}
                      onClick={() => handleChangeCurrentIndex(index)}
                    >
                      {getCurrentIcon(item)}
                      <span className="text">
                        {item.name} - {getName(item.ar)}
                      </span>
                      <span className="like">
                        <i className="iconfont">&#xe601;</i>
                      </span>
                      <span
                        className="delete"
                        onClick={(e) => handleDeleteSong(e, item)}
                      >
                        <i className="iconfont">&#xe63d;</i>
                      </span>
                    </li>
                  );
                })}
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
        <Confirm
          ref={confirmRef}
          text={'是否删除全部?'}
          cancelBtnText={'取消'}
          confirmBtnText={'确定'}
          handleConfirm={handleConfirmClear}
        ></Confirm>
      </PlayListWrapper>
    </CSSTransition>
  );
});

// 映射state到props上
const mapStateToProps = (state) => ({
  currentIndex: state.getIn(['player', 'currentIndex']),
  currentSong: state.getIn(['player', 'currentSong']),
  playList: state.getIn(['player', 'playList']), // 播放列表
  sequencePlayList: state.getIn(['player', 'sequencePlayList']), // 顺序排列时的播放列表
  showPlayList: state.getIn(['player', 'showPlayList']),
  mode: state.getIn(['player', 'mode']),
});

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    // 修改当前歌曲在列表中的index, 就是切歌
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data));
    },
    // 修改当前的播放模式
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    // 修改当前的歌曲列表
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
    deleteSongDispatch(data) {
      dispatch(deleteSong(data));
    },
    clearDispatch() {
      // 1. 清空两个列表
      dispatch(changePlayList([]));
      dispatch(changeSequecePlayList([]));
      // 2. 初始化currentIndex
      dispatch(changeCurrentIndex(-1));
      // 3. 关闭PlayList的显示
      dispatch(changeShowPlayList(false));
      // 4. 将当前歌曲置空
      dispatch(changeCurrentSong({}));
      // 5. 重置播放状态
      dispatch(changePlayingState(false));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(PlayList));
