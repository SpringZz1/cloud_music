import React, { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { getName } from '../../../api/utils';
import { MiniPlayerContainer } from './style';
import ProgressCircle from '../../../baseUI/progress-circle';

function MiniPlayer(props) {
  const { song, fullScreen, playing, percent } = props;
  const {
    toggleFullScreenDispatch,
    clickPlaying,
    setFullScreen,
    togglePlayList,
  } = props;
  // 先 mock 一份 percent 数据
  // let percent = 0.2;

  const miniPlayerRef = useRef();

  const handleTogglePlayList = (e) => {
    togglePlayList(true);
    e.stopPropagation();
  };
  return (
    <CSSTransition
      in={!fullScreen}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        miniPlayerRef.current.style.display = 'flex';
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = 'none';
      }}
    >
      <MiniPlayerContainer
        ref={miniPlayerRef}
        onClick={() => toggleFullScreenDispatch(true)}
      >
        <div className="icon">
          <div className="imgWrapper">
            <img
              className={`play ${playing ? '' : 'pause'}`}
              src={song.al.picUrl}
              width="40"
              height="40"
              alt="img"
            />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <h2 className="desc">{getName(song.ar)}</h2>
        </div>
        <div className="control">
          <ProgressCircle radius={32} percent={percent}>
            {playing ? (
              <i
                className="icon-mini iconfont icon-play"
                onClick={(e) => clickPlaying(e)}
              >
                &#xe650;
              </i>
            ) : (
              <i
                className="icon-mini iconfont icon-pause"
                onClick={(e) => clickPlaying(e)}
              >
                &#xe61e;
              </i>
            )}{' '}
          </ProgressCircle>
        </div>
        <div className="control" onClick={handleTogglePlayList}>
          <i className="iconfont">&#xe640;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  );
}

export default React.memo(MiniPlayer);
