import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import Swiper core and required modules
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import banner1 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.webp";
import banner3 from "../assets/banner3.jpg";

const Banner = () => {
  return (
    <div className="w-[80%] mx-auto border border-neutral-200">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={true}
        className="mySwiper"
      >
        <SwiperSlide>
          <img
            src={banner1}
            alt="Banner 1"
            className="w-full max-h-[500px] object-fit"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={banner2}
            alt="Banner 2"
            className="w-full max-h-[500px] object-fit"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={banner3}
            alt="Banner 3"
            className="w-full max-h-[500px] object-fit"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
