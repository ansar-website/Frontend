import { Collapse, Skeleton } from 'antd';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import BlogItem from '../components/blog-item/blog';
import CourseItem from '../components/course-item/course';
import ClientLayout from '../layouts/Client/ClientLayout';
import arrow from '../public/images/icons/arrow.svg';
import LeftShadow from '../public/images/icons/left-shadow.svg';
import Next from '../public/images/icons/next.png';
import Prev from '../public/images/icons/prev.png';
import RightShadow from '../public/images/icons/right-shadow.svg';
import SkeltonImg from '../public/images/skelton-img.png';
import BlogsService from '../services/blogs/blogs';
import CoursesService from '../services/courses/courses';

const { Panel } = Collapse;

function Home(props) {
  const { genInfo } = props;
  const { t } = useTranslation();
  // navbar
  useEffect(() => {
    const Navbar = document.getElementById('home-navbar');
    Navbar.classList.add('activeNav', 'activeTransparent');
    return () => {
      Navbar.classList.remove('activeNav', 'activeTransparent');
    };
  }, []);
  // fetch blogs
  const [Blogs, setBlogs] = useState();
  useEffect(() => {
    BlogsService.GetBlogs().then((res) => {
      const blogs = res.data.results.slice(0, 3);
      setBlogs(blogs);
    });
  }, []);
  // fetch Courses
  const [Courses, setCourses] = useState();
  useEffect(() => {
    CoursesService.GetCourses().then((res) => {
      const coursesVal = res.data.results.slice(0, 3);
      setCourses(coursesVal);
    });
  }, []);
  // swiper
  const [renderRecommendations, setrenderRecommendations] = useState(false);
  useEffect(() => {
    setrenderRecommendations(true);
  }, []);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);
  return (
    <div className="home-page">
      {/* main header */}
      <header
        className="mainHeader flex_row_c"
        style={{ backgroundImage: `url(${genInfo?.home_page.carousel[0].background_image})` }}
      >
        <div className="headerCont flex_btw gap-30">
          <div className="rightContent flex_col">
            <h1 className="f_56 fw_7 mb_17 title"> {genInfo?.home_page.carousel[0].title}</h1>

            <p className="desc fw_4 f_20 mb_32">{genInfo?.home_page.carousel[0].subtitle}</p>

            <div className="flex_row_c gap-20">
              <button type="button" className="toKnowMore mc f_18 fw_7">
                {genInfo && (
                  <Link href={genInfo?.home_page.carousel[0]?.know_more_link}>
                    {genInfo?.home_page.carousel[0]?.know_more_text}
                  </Link>
                )}
              </button>
              <button type="button" className="toKnowMore f_18 mcBg wc fw_7">
                {genInfo && (
                  <Link href={genInfo?.home_page.carousel[0]?.second_button_link}>
                    {genInfo?.home_page.carousel[0]?.second_button_text}
                  </Link>
                )}
              </button>
            </div>
          </div>
          <div className="imgCont">
            <img src={genInfo?.home_page.carousel[0].image || SkeltonImg} alt="header" className="main" />
          </div>
        </div>
      </header>
      {/* recent courses */}
      <section className="courses">
        <div className="container flex_col_c">
          <h2 className="mb_54 f_34 mc fw_7">{t('recent_course')}</h2>
          <div className="flex_row_c gap-30 wrap align_start">
            {Courses
              ? Courses.map((course) => <CourseItem src={course} key={course.id} />)
              : Array.from({ length: 3 }).map((_, i) => (
                  <div className="flex_col blogItem homeBlog gap-20" key={`${i * 2}key`}>
                    <Skeleton.Image active />
                    <div className="content wide flex_col gap-20">
                      <div className="flex_col gap-20 wide">
                        <Skeleton.Input active />
                        <Skeleton.Input size="large" active block />
                        <Skeleton.Input active block />
                        <Skeleton.Input active block />
                      </div>
                      <div className="flex align_center gap-10" style={{ width: 'fit-content' }}>
                        <Skeleton.Avatar size="large" active />
                        <Skeleton.Input active />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
      {/* stats */}
      <section className="stats">
        <div className="container flex_col">
          <h2 className="mb_54 f_34 mc fw_7 center wide">{t('academy_stats')}</h2>
          <div className="statsCont wide flex_btw gap-20 wrap">
            <div className="statItem flex_col_c gap-12">
              <h3 className="f_34 fw_7 mc center wide">6</h3>
              <span className="f_20 fw_7 dc">دورات جديدة</span>
            </div>
            <div className="statItem flex_col_c gap-12">
              <h3 className="f_34 fw_7 mc center wide">{genInfo?.statistics?.students_count}</h3>
              <span className="f_20 fw_7 dc">طالب و طالبة</span>
            </div>
            <div className="statItem flex_col_c gap-12">
              <h3 className="f_34 fw_7 mc center wide">{genInfo?.statistics?.blogs_count}</h3>
              <span className="f_20 fw_7 dc">مقال</span>
            </div>
            <div className="statItem flex_col_c gap-12">
              <h3 className="f_34 fw_7 mc center wide">{genInfo?.statistics?.authors_count}</h3>
              <span className="f_20 fw_7 dc">محاضر</span>
            </div>
            <div className="statItem flex_col_c gap-12">
              <h3 className="f_34 fw_7 mc center wide">{genInfo?.statistics?.focusing_time}</h3>
              <span className="f_20 fw_7 dc">ساعة دراسة عبر المنصة</span>
            </div>
          </div>
        </div>
      </section>
      {/* blogs */}
      <section className="blogs">
        <div className="container flex_col_c">
          <h2 className="mb_54 f_34 mc fw_7">{t('recent_blogs')}</h2>
          <div className="flex_row_c gap-30 wrap align_start">
            {Blogs
              ? Blogs.map((blogItem) => (
                  <BlogItem
                    key={blogItem.id}
                    id={blogItem.id}
                    homeBlog
                    img={blogItem.image}
                    topic={blogItem.categories[0].title}
                    date={blogItem.reading_duration}
                    title={blogItem.title}
                    desc={blogItem.description}
                    blogPuplisherImg={blogItem.author.image} //
                    puplisherName={blogItem.author.name}
                    puplishDate={blogItem.create_date}
                    durationUnit={blogItem.reading_duration_unit}
                  />
                ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <div className="flex_col blogItem homeBlog gap-20" key={`${i * 2}key`}>
                    <Skeleton.Image active />
                    <div className="content wide flex_col gap-20">
                      <div className="flex_col gap-20 wide">
                        <Skeleton.Input active />
                        <Skeleton.Input size="large" active block />
                        <Skeleton.Input active block />
                        <Skeleton.Input active block />
                      </div>
                      <div className="flex align_center gap-10" style={{ width: 'fit-content' }}>
                        <Skeleton.Avatar size="large" active />
                        <Skeleton.Input active />
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </section>
      {/* testimonials */}
      <section className="testimonials flex_col">
        <h2 className="mb_74 f_34 mc fw_7 wide center">{t('writers_testi')}</h2>
        {renderRecommendations && (
          <Swiper
            slidesPerView={2.65}
            spaceBetween={32}
            centeredSlides
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              0: {
                slidesPerView: 1.2,
              },
              640: {
                slidesPerView: 1.4,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 1.6,
              },
              1200: {
                slidesPerView: 2,
              },
            }}
            modules={[Autoplay, Pagination, Navigation]}
            loop
            className="testimonialsSwiper"
            navigation={{
              prevEl: navigationPrevRef.current,
              nextEl: navigationNextRef.current,
            }}
            onBeforeInit={(swiper) => {
              const swiperVal = swiper;
              swiperVal.params.navigation.prevEl = navigationPrevRef.current;
              swiperVal.params.navigation.nextEl = navigationNextRef.current;
            }}
          >
            {genInfo?.home_page.recommendation.map((recommendation) => (
              <SwiperSlide className="testiItem flex_col" key={`${recommendation.who_recommend_us_name} key`}>
                <img src={recommendation.who_recommend_us_image} alt="avatar" className="img" />
                <h3 className="f_30 dc fw_6 mb_16 name"> {recommendation.who_recommend_us_name}</h3>
                <p className="f_16 fw_5 desc">{recommendation.recommendation_in_short}</p>
                {recommendation.recommendation_image && (
                  <a href={recommendation.recommendation_image} className="wide flex_end showTesti f_20 fw_6 dc">
                    {t('show_testi')}
                  </a>
                )}
              </SwiperSlide>
            ))}
            <img src={LeftShadow} alt="shadow" className="shadowSplach leftShadow" />
            <img src={RightShadow} alt="shadow" className="shadowSplach rightShadow" />
            <button type="button">
              <img src={Next} alt="prev" ref={navigationPrevRef} className="prev navEl" />
            </button>
            <button type="button">
              <img src={Prev} alt="next" ref={navigationNextRef} className="Next navEl" />
            </button>
          </Swiper>
        )}
      </section>
      {/* commoneQs */}
      <section className="commonQs mb_100" id="commonQs">
        <h2 className="mb_69 f_34 mc fw_7 wide center">{t('common_qs')}</h2>
        <div className="container commonQsCollapse">
          <Collapse
            bordered={false}
            className="panelCont"
            defaultActiveKey={['1']}
            expandIcon={() => <img src={arrow} alt="arrow" />}
          >
            {genInfo?.home_page.faq.map((q) => (
              <Panel
                header={
                  <div className="flex_btw header align_center">
                    <span className="flex gap-18 f_24 fw_7">{q.question}</span>
                  </div>
                }
                key={q.question}
                className="panelItem"
              >
                <div className="panelContainer">
                  <p className="f_18">{q.answer}</p>
                </div>
              </Panel>
            ))}
          </Collapse>
        </div>
      </section>
    </div>
  );
}
export default Home;
Home.Layout = ClientLayout;
