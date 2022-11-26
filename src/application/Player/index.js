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

  //mock一份playList，后面直接从 redux 拿，现在只是为了调试播放效果。
  // const playList = [
  //   {
  //     ftype: 0,
  //     djId: 0,
  //     a: null,
  //     cd: '01',
  //     crbt: null,
  //     no: 1,
  //     st: 0,
  //     rt: '',
  //     cf: '',
  //     alia: ['手游《梦幻花园》苏州园林版推广曲'],
  //     rtUrls: [],
  //     fee: 0,
  //     s_id: 0,
  //     copyright: 0,
  //     h: {
  //       br: 320000,
  //       fid: 0,
  //       size: 9400365,
  //       vd: -45814,
  //     },
  //     mv: 0,
  //     al: {
  //       id: 84991301,
  //       name: '拾梦纪',
  //       picUrl:
  //         'http://p1.music.126.net/M19SOoRMkcHmJvmGflXjXQ==/109951164627180052.jpg',
  //       tns: [],
  //       pic_str: '109951164627180052',
  //       pic: 109951164627180050,
  //     },
  //     name: '拾梦纪',
  //     l: {
  //       br: 128000,
  //       fid: 0,
  //       size: 3760173,
  //       vd: -41672,
  //     },
  //     rtype: 0,
  //     m: {
  //       br: 192000,
  //       fid: 0,
  //       size: 5640237,
  //       vd: -43277,
  //     },
  //     cp: 1416668,
  //     mark: 0,
  //     rtUrl: null,
  //     mst: 9,
  //     dt: 234947,
  //     ar: [
  //       {
  //         id: 12084589,
  //         name: '妖扬',
  //         tns: [],
  //         alias: [],
  //       },
  //       {
  //         id: 12578371,
  //         name: '金天',
  //         tns: [],
  //         alias: [],
  //       },
  //     ],
  //     pop: 5,
  //     pst: 0,
  //     t: 0,
  //     v: 3,
  //     id: 1416767593,
  //     publishTime: 0,
  //     rurl: null,
  //   },
  // ];

  // 绑定ref
  const audioRef = useRef();

  // mock数据
  // const currentSong = {
  //   al: {
  //     picUrl:
  //       'https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg',
  //   },
  //   name: '木偶人',
  //   ar: [{ name: '薛之谦' }],
  // };

  // let current = playList[0];

  //先mock一份currentIndex
  useEffect(() => {
    changeCurrentIndexDispatch(0);
    // console.log(playList);
  }, []);

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
    audioRef.current.src = getSongUrl(current.id);
    // setTimeout(() => {
    //   audioRef.current.play();
    // });
    togglePlayingDispatch(false); //播放状态
    setCurrentTime(0); //从头开始播放
    setDuration((current.dt / 1000) | 0); //时长
  }, [currentIndex]);

  // useEffect(() => {
  //   playing ? audioRef.current.play() : audioRef.current.pause();
  // }, [playing]);

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
    playing ? audioRef.current.pause() : audioRef.current.play();
    // audioRef.current.src = getSongUrl(current.id);
    // if (state === true) {
    //   audioRef.current.play();
    // } else {
    //   audioRef.current.pause();
    // }
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
        />
      )}

      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
      ></audio>
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