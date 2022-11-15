import React, { useEffect } from 'react';
import Slider from '../../components/slider';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreators';
import RecommendList from '../../components/list';
import { Content } from './style';
import Scroll from '../../baseUI/scroll';
import { forceCheck } from 'react-lazyload';
import Loading from '../../baseUI/loading';

function Recommend(props) {
  const { bannerList, recommendList, enterLoading } = props;
  const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

  useEffect(() => {
    // 如果页面有数据则不发送请求
    // immutable数据结构中长度属性是size
    if (!bannerList.size) {
      getBannerDataDispatch();
    }
    if (!recommendList.size) {
      getRecommendListDataDispatch();
    }
    //eslint-disable-next-line
  }, []);

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];

  // mock数据
  // const bannerList = [1, 2, 3, 4].map((item) => {
  //   return {
  //     imageUrl:
  //       'http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg',
  //   };
  // });

  // const recommendList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
  //   return {
  //     id: 1,
  //     picUrl:
  //       'https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg',
  //     playCount: 17171122,
  //     name: '朴树、许巍、李健、郑钧、老狼、赵雷',
  //   };
  // });

  return (
    <Content>
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}></Slider>
          <RecommendList recommendList={recommendListJS}></RecommendList>
        </div>
      </Scroll>
      {enterLoading ? <Loading></Loading> : null}
    </Content>
  );
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
  // 不要在这里将数据 toJS
  // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  enterLoading: state.getIn(['recommend', 'enterLoading']),
});

// 映射dispatch到props上
const mapDispathToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    },
  };
};

// 将ui组件包装成容器组件
export default connect(
  mapStateToProps,
  mapDispathToProps
)(React.memo(Recommend));
// export default React.memo(Recommend);
