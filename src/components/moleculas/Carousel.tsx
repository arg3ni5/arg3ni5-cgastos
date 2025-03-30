
import styled from "styled-components";
import {
  EffectCards,
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useEffect, FC, useRef } from "react";
// Import Swiper styles
import img1 from "../../assets/Ruleta/ruleta9.png";
import img2 from "../../assets/Ruleta/ruleta8.png";
import img3 from "../../assets/Ruleta/ruleta5.png";
import img4 from "../../assets/Ruleta/ruleta6.png";
import img5 from "../../assets/Ruleta/ruleta7.png";
import Arrow from "../../assets/Arrow.svg";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
console.log("Ruta del Arrow SVG:", Arrow);


export const Carousel: FC = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    import("swiper/css");
    import("swiper/css/navigation");
    import("swiper/css/pagination");
    import("swiper/css/scrollbar");
    import("swiper/css/effect-cards");
  }, []);

  return (
    <CarouselContainer>
      
      <div className="custom-button-prev" ref={prevRef}>
        <IoIosArrowBack />
      </div>
      <div className="custom-button-next" ref={nextRef}>
        <IoIosArrowForward />
      </div>

      <Swiper
        autoplay={{ delay: 1500, disableOnInteraction: false }}
        modules={[
          EffectCards,
          Navigation,
          Pagination,
          Scrollbar,
          A11y,
          Autoplay,
        ]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={(swiper) => {
          const navigation = swiper.params.navigation as any;
          navigation.prevEl = prevRef.current;
          navigation.nextEl = nextRef.current;

          swiper.navigation.init();
          swiper.navigation.update();
        }}

        pagination={{ type: "fraction" }}
        scrollbar={{ draggable: true }}
        effect={"cards"}
      >
        {[img1, img2, img3, img4, img5].map((img, i) => (
          <SwiperSlide key={i}>
            <img src={img} alt={`slide-${i + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>

    </CarouselContainer>
  );
}
const CarouselContainer = styled.div`
  width: 20vw;
  height: 50vh;

  @media (max-width: 70em) {
    height: 40vh;
    padding: 15px 0;
  }
  @media (max-width: 64em) {
    height: 50vh;
    width: 30vw;
  }
  @media (max-width: 48em) {
    height: 35vh;
    width: 40vw;
  }
  @media (max-width: 30em) {
    height: 35vh;
    width: 40vw;
  }

  .swiper {
    width: 100%;
    height: 100%;
  }

  .swiper-slide {
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    img {
      display: block;
      height: 100%;
      object-fit: contain;
    }
  }

  .swiper-pagination-fraction {
    color: ${(props) => props.theme.text};
    font-size: 1.5rem;
    font-weight: 600;
  }

  .custom-button-prev,
  .custom-button-next {
    position: absolute;
    right: 0;
    top: 60%;
    padding-top: 5px;
    color: ${(props) => props.theme.text};
    
    background: #21252B;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    background-position: center;
    background-size: cover;

    &:after {
      display: none;
    }
  }

  .custom-button-prev {
    left: 0;
  }

  .custom-button-next {
    right: 0;
  }
`;
