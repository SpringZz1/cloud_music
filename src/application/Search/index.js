import React, { useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Container } from './style';
import { useNavigate } from 'react-router';
import SearchBox from './../../baseUI/search-box/index';

function Search(props) {
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
          <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
        </div>
        {/* <div onClick={() => setShowFalse}>返回</div> */}
      </Container>
    </CSSTransition>
  );
}

export default Search;
