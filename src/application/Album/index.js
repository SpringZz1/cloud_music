import React, { useState, useCallback, useRef, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import Header from './../../baseUI/header/index';
import { useNavigate } from 'react-router';
import { Container, TopDesc, Menu, SongList, SongItem } from './style';
import Scroll from '../../baseUI/scroll';
import { getCount, getName, isEmptyObject } from '../../api/utils';
import { connect } from 'react-redux';
import { changeEnterLoading, getAlbumList } from './store/actionCreators';
import { useParams } from 'react-router-dom';
import Loading from '../../baseUI/loading/index';
import MusicNote from '../../baseUI/music-note/index';
import SongsList from '../SongsList';

function Album(props) {
  const [showStatus, setShowStatus] = useState(true);
  // 从路由拿到歌单的id
  // const id = props.match.params.id;
  const { id } = useParams();

  const { currentAlbum: currentAlbumImmutable, enterLoading } = props;
  const { getAlbumDataDispatch } = props;
  const { songCount } = props;
  const musicNoteRef = useRef();

  useEffect(() => {
    getAlbumDataDispatch(id);
  }, [getAlbumDataDispatch, id]);

  let currentAlbum = currentAlbumImmutable.toJS();

  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  const navigate = useNavigate();

  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="music" />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span className="count">
              {Math.floor(currentAlbum.subscribedCount / 1000) / 10}万
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    );
  };

  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    );
  };

  const renderSongList = () => {
    return (
      <SongList>
        <div className="first_line">
          <div className="play_all">
            <i className="iconfont">&#xe6e3;</i>
            <span>
              播放全部
              <span className="sum">(共{currentAlbum.tracks.length}首)</span>
            </span>
          </div>
          <div className="add_list">
            <i className="iconfont">&#xe62d;</i>
            <span>收藏({getCount(currentAlbum.subscribedCount)})</span>
          </div>
        </div>
        <SongItem>
          {currentAlbum.tracks.map((item, index) => {
            return (
              <li key={index}>
                <span className="index">{index + 1}</span>
                <div className="info">
                  <span>{item.name}</span>
                  <span>
                    {getName(item.ar)} -{item.al.name}
                  </span>
                </div>
              </li>
            );
          })}
        </SongItem>
      </SongList>
    );
  };

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  };

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames={{
        exitActive: 'animate__animated animate__backOutDown',
      }}
      appear={true}
      unmountOnExit={true}
      onExited={() => navigate(-1)}
    >
      <Container play={songCount}>
        <Header title={'返回'} handleClick={handleBack}></Header>
        {/*这里是具体布局的JSX代码*/}
        {!isEmptyObject(currentAlbum) ? (
          <Scroll bounceTop={false}>
            <div>
              {renderTopDesc()}
              {renderMenu()}
              {/* {renderSongList()} */}
              <SongsList
                songs={currentAlbum.tracks}
                collectCount={currentAlbum.subscribedCount}
                showCollect={true}
                showBackground={true}
                musicAnimation={musicAnimation}
              ></SongsList>
            </div>
          </Scroll>
        ) : null}
        {enterLoading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

// 映射state到props上
const mapStateToProps = (state) => {
  return {
    currentAlbum: state.getIn(['album', 'currentAlbum']),
    enterLoading: state.getIn(['album', 'enterLoading']),
    songCount: state.getIn(['player', 'playList']).size,
  };
};

// 映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getAlbumList(id));
    },
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));
