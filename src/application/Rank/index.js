import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getRankList } from './store/actionCreators';
import { filterIndex } from '../../api/utils';
import { List, ListItem, SongList, Container } from './style';
import Scroll from '../../baseUI/scroll';
import { Outlet, useNavigate } from 'react-router';
// import { renderRoutes } from 'react-router-config';

function Rank(props) {
  const { rankList: list, loading } = props;
  const { getRankListDispatch } = props;
  const { songCount } = props;
  const navigate = useNavigate();
  let rankList = list ? list.toJS() : [];

  useEffect(() => {
    getRankListDispatch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let globalStartIndex = filterIndex(rankList);
  let officialList = rankList.slice(0, globalStartIndex);
  let globalList = rankList.slice(globalStartIndex);

  const enterDetail = (detail) => {
    navigate(`/rank/${detail.id}`);
  };

  const renderRankList = (list, global) => {
    return (
      <List globalRank={global}>
        {list.map((item, index) => {
          return (
            <ListItem
              key={`${item.coverImgId}${index}`}
              tracks={item.tracks}
              onClick={() => enterDetail(item)}
            >
              <div className="img_wrapper">
                <img src={item.coverImgUrl} alt="" />
                <div className="decorate"></div>
                <span className="update_frequecy">{item.updateFrequency}</span>
              </div>
              {renderSongList(item.tracks)}
            </ListItem>
          );
        })}
      </List>
    );
  };

  const renderSongList = (list) => {
    return list.length ? (
      <SongList>
        {list.map((item, index) => {
          return (
            <li key={index}>
              {index + 1}. {item.first} - {item.second}
            </li>
          );
        })}
      </SongList>
    ) : null;
  };

  // 榜单数据未加载出来之前都给隐藏
  let displayStyle = loading ? { display: 'none' } : { display: '' };

  return (
    <Container play={songCount}>
      <Scroll>
        <div>
          <h1 className="offical" style={displayStyle}>
            {' '}
            官方榜{' '}
          </h1>
          {renderRankList(officialList)}
          <h1 className="global" style={displayStyle}>
            {' '}
            全球榜{' '}
          </h1>
          {renderRankList(globalList, true)}
        </div>
      </Scroll>
      {/* {renderRoutes (props.route.routes)} */}
      <Outlet />
    </Container>
  );
}

const mapStateToProps = (state) => ({
  rankList: state.getIn(['rank', 'rankList']),
  loading: state.getIn(['rank', 'loading']),
  songCount: state.getIn(['player', 'playList']).size,
});

const mapDispatchToProps = (dispatch) => {
  return {
    getRankListDispatch() {
      dispatch(getRankList());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));
