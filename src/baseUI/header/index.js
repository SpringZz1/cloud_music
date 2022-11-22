import React from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import PropTypes from 'prop-types';

const HeaderContainer = styled.div`
  position: fixed;
  padding: 5px 10px;
  padding-top: 0;
  height: 40px;
  width: 100%;
  z-index: 100;
  display: flex;
  line-height: 40px;
  color: ${style['font-color-light']};

  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
    position: absolute;
    top: 0px;
    left: 10px;
    z-index: 999;
  }
  > h1 {
    font-size: ${style['font-size-l']};
    font-weight: 700;
    color: white;
    position: absolute;
    z-index: 999;
    top: 0px;
    left: 40px;
  }
`;
const Bg = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: url(${(props) => props.background}) top left no-repeat;
  background-size: 100%;
  opacity: 0.8;
  backdrop-filter: saturate(180%) blur(20px);
`;

const Header = React.forwardRef((props, ref) => {
  const { handleClick, title, background } = props;
  return (
    <HeaderContainer ref={ref}>
      <Bg className="bg" background={background}></Bg>
      <i className="iconfont back" onClick={handleClick}>
        &#xe655;
      </i>
      <h1>{title}</h1>
    </HeaderContainer>
  );
});

Header.defaultProps = {
  handleClick: () => {},
  title: '标题',
};

Header.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string,
  background: PropTypes.string,
};

export default React.memo(Header);
