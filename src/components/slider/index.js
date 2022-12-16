import React from 'react';
import { SliderContainer } from './style';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper';
// import 'swiper/css/bundle';
import 'swiper/css';
import 'swiper/css/pagination';

function Slider(props) {
  const { bannerList } = props;

  return (
    <SliderContainer>
      <div className="before"></div>
      <div className="slider-container">
        <div className="swiper-wrapper">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            pagination={{ el: '.swiper-pagination', clickable: true }}
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
