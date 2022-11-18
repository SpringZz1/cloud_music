import React, { useState } from 'react';
import { Container } from './style';
import { CSSTransition } from 'react-transition-group';
import Header from './../../baseUI/header/index';
import { useNavigate } from 'react-router';

function Album(props) {
  const [showStatus, setShowStatus] = useState(true);
  const handleBack = () => {
    setShowStatus(false);
  };
  const navigate = useNavigate();

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={navigate(-1)}
    >
      <Container>
        <Header title={'返回'} handleClick={handleBack}></Header>
        123123123
      </Container>
    </CSSTransition>
  );
}

export default React.memo(Album);
