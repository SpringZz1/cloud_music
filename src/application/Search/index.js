import React, { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Container } from './style';
import { useNavigate } from 'react-router';

function Search(props) {
  // 控制动画
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setShow(true);
  }, []);

  const setShowFalse = () => {
    console.log('setShowFalse function');
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
        <div onClick={() => setShowFalse}>返回</div>
      </Container>
    </CSSTransition>
  );
}

export default Search;
