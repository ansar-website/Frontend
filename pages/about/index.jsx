import { Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RadiusHeader from '../../components/Common/radius-header/radius-header';
import CourseItem from '../../components/course-item/course';
import ClientLayout from '../../layouts/Client/ClientLayout';
import CoursesService from '../../services/courses/courses';

function About({ genInfo }) {
  const { t } = useTranslation();
  // fetch courses
  const [Courses, setCourses] = useState();
  useEffect(() => {
    CoursesService.GetCourses().then((res) => {
      const coursesVal = res.data.results.slice(0, 3);
      setCourses(coursesVal);
    });
  }, []);
  return (
    <div className="about-page">
      {/* header */}
      <RadiusHeader titleText={genInfo?.about_us.page_title} pText="نصرة النبي علم وعمل" />
      {/* about content */}
      <div className="aboutContentItem textCover">
        <div className="container">
          <div className="flex_row_c itemCont gap-100">
            <div className="title">
              <h3 className="f_50 fw_8 mc">{t('who_we_are')}</h3>
            </div>
            <div className="content">
              {genInfo ? (
                <p className="f_22 fw_5 text">{genInfo?.about_us.who_we_are}</p>
              ) : (
                <Skeleton active size="large" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="aboutContentItem imageCover">
        <div className="container">
          <div className="flex_btw imageCoverItem align_center gap-25">
            <div className="content flex_col gap-15">
              <h3 className="f_50 fw_8 mc">{t('who_we_are_msg')}</h3>
              {genInfo ? (
                <p className="f_22 fw_4 text">{genInfo?.about_us.our_mission}</p>
              ) : (
                <Skeleton active size="large" />
              )}
            </div>
            <div className="flex">
              {genInfo ? (
                <img src={genInfo?.about_us.our_mission_image} alt="about message" className="sectionImage" />
              ) : (
                <Skeleton.Image active size="large" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="aboutContentItem textCover">
        <div className="container">
          <div className="flex_row_c itemCont gap-100">
            <div className="title">
              <h3 className="f_50 fw_8 mc">{t('vision')}</h3>
            </div>
            <div className="content">
              {genInfo ? (
                <p className="f_22 fw_5 text">{genInfo?.about_us.our_vision}</p>
              ) : (
                <Skeleton active size="large" />
              )}
            </div>
          </div>
        </div>
      </div>
      <section className="teachers">
        <div className="container">
          <div className="flex_col gap-110 align_center teachContent">
            <h3 className="f_50 fw_8 mc center">{t('teachers')}</h3>
            <div className="flex_btw wrap teachCont gap-72">
              {genInfo?.about_us.staff.map((teacher) => (
                <div className="teacherItem flex_col_c gap-40" key={`${teacher.name}`}>
                  <img src={teacher.image} alt="teacher" className="avatar" />
                  <h4 className="f_35 fw_7 name">{teacher.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="courses">
        <div className="container">
          <div className="flex_btw gap-30 wrap align_start justify_center">
            {Courses?.map((course) => (
              <CourseItem src={course} key={course.id} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
About.Layout = ClientLayout;
