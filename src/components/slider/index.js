import React from 'react';
import { SliderContainer } from './style';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Pagination } from 'swiper';
import 'swiper/css/bundle';
SwiperCore.use([Autoplay]);

function Slider(props) {
  const { bannerList } = props;

  return (
    <SliderContainer>
      <div className="before"></div>
      <div className="slider-container">
        <div className="swiper-wrapper">
          <Swiper
            modules={[Pagination]}
            autoplay
            pagination={{ type: 'bullets' }}
          >
            {bannerList.map((slider, index) => {
              return (
                <SwiperSlide key={index}>
                  <img
                    src={slider.imageUrl}
                    width="100%"
                    height="100%"
                    alt="推荐"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </SliderContainer>
  );
}

export default React.memo(Slider);
