import { fromJS } from 'immutable';
import React, { useRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer';

import {
  changePlayingState,
  changeShowPlayList,
  changeCurrentIndex,
  changeCurrentSong,
  changePlayList,
  changePlayMode,
  changeFullScreen,
} from './store/actionCreators';
import { getSongUrl, isEmptyObject, shuffle, findIndex } from '../../api/utils';
import Toast from './../../baseUI/toast/index';
import { playMode } from '../../api/config';
import PlayList from './play-list';

function Player(props) {
  // 从redux中取redux数据和dispatch方法
  const {
    playing,
    currentSong: immutableCurrentSong,
    currentIndex,
    playList: immutablePlayList,
    mode, //播放模式
    sequencePlayList: immutableSequencePlayList, //顺序列表
    fullScreen,
  } = props;

  const {
    togglePlayingDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changePlayListDispatch, //改变playList
    changeModeDispatch, //改变mode
    toggleFullScreenDispatch,
    togglePlayListDispatch,
  } = props;

  const playList = immutablePlayList.toJS();
  const sequencePlayList = immutableSequencePlayList.toJS();
  const currentSong = immutableCurrentSong.toJS();

  // 目前播放时间
  const [currentTime, setCurrentTime] = useState(0);
  // 歌曲总时长
  const [duration, setDuration] = useState(0);
  // 歌曲播放进度
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const [modeText, setModeText] = useState('');
  const toastRef = useRef();

  // 绑定ref
  const audioRef = useRef();

  // 记录当前歌曲
  const preSongRef = useRef({});
  // const songReady = useRef(true);

  useEffect(() => {
    // if (!currentSong) return;
    if (
      !playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id
    )
      return;
    let current = playList[currentIndex];
    changeCurrentDispatch(current); //赋值currentSong
    // setPreSong(current);
    preSongRef.current = current;
    audioRef.current.src = getSongUrl(current.id);
    // setTimeout(() => {
    //   audioRef.current.play();
    // });
    togglePlayingDispatch(true); //播放状态

    setCurrentTime(0); //从头开始播放
    setDuration((current.dt / 1000) | 0); //时长
  }, [currentIndex, currentSong.id]);

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    if (!playing) {
      audioRef.current.play();
      togglePlayingDispatch(true);
    } else {
      audioRef.current.pause();
      togglePlayingDispatch(false);
    }
  };

  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const onProgressChange = (curPercent) => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
    if (!playing) {
      togglePlayingDispatch(true);
    }
  };

  //一首歌循环
  const handleLoop = () => {
    audioRef.current.currentTime = 0;
    changePlayingState(true);
    audioRef.current.play();
  };

  const handlePrev = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) index = playList.length - 1;
    console.log('pre');
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const handleNext = () => {
    //播放列表只有一首歌时单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    console.log('next');
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  // 记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
  const [preSong, setPreSong] = useState({});

  const changeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      // 顺序播放
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
      setModeText('顺序循环');
    } else if (newMode === 1) {
      // 单曲循环
      changePlayListDispatch(sequencePlayList);
      setModeText('单曲循环');
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentIndex, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText('随机播放');
    }
    changeModeDispatch(newMode);
    toastRef.current.show();
  };

  const handleEnd = () => {
    if (mode === playMode.loop) {
      handleLoop();
    } else {
      handleNext();
    }
  };

  const clearPreSong = () => {
    preSongRef.current = {};
    // console.log(preSongRef.current);
  };

  return (
    <div>
      {isEmptyObject(currentSong) ? null : (
        <MiniPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          percent={percent} // 进度
          toggleFullScreenDispatch={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          togglePlayList={togglePlayListDispatch}
        />
      )}
      {isEmptyObject(currentSong) ? null : (
        <NormalPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          duration={duration} // 总时长
          currentTime={currentTime} // 播放时间
          percent={percent} // 进度
          toggleFullScreenDispatch={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
          handlePrev={handlePrev}
          handleNext={handleNext}
          mode={mode}
          changeMode={changeMode}
          togglePlayList={togglePlayListDispatch}
        />
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
        autoPlay={true}
      ></audio>
      <PlayList clearPreSong={clearPreSong}></PlayList>
      <Toast text={modeText} ref={toastRef}></Toast>
    </div>
  );
}

// 映射Redux的全局state到组建的props上
const mapStateToProps = (state) => ({
  fullScreen: state.getIn(['player', 'fullScreen']),
  playing: state.getIn(['player', 'playing']),
  currentSong: state.getIn(['player', 'currentSong']),
  showPlayList: state.getIn(['player', 'showPlayList']),
  mode: state.getIn(['player', 'mode']),
  currentIndex: state.getIn(['player', 'currentIndex']),
  playList: state.getIn(['player', 'playList']),
  sequencePlayList: state.getIn(['player', 'sequencePlayList']),
});

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data));
    },
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data));
    },
    togglePlayListDispatch(data) {
      dispatch(changeShowPlayList(data));
    },
    changeCurrentIndexDispatch(index) {
      dispatch(changeCurrentIndex(index));
    },
    changeCurrentDispatch(data) {
      dispatch(changeCurrentSong(data));
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data));
    },
    changePlayListDispatch(data) {
      dispatch(changePlayList(data));
    },
  };
};

// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player));
