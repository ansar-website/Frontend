import { Empty, Spin } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../../layouts/Dasboard/DashboardLayout';
import CoursesService from '../../../services/courses/courses';

export default function DashboardCourses() {
  const { t } = useTranslation();
  // fetch courses data
  const [loading, setloading] = useState(true);
  const [courses, setcourses] = useState();
  useEffect(() => {
    CoursesService.GetUserCourses().then((res) => {
      setcourses(res.data.results);
      setloading(false);
    });
  }, []);
  return (
    <Spin spinning={loading}>
      <div className="flex gap-31 wrap courses-page">
        {courses && courses?.length > 0 ? (
          courses.map((course) => (
            <div className="courseItem flex_col pnt" key={`${course.id}item`}>
              <Link href={`/course-details/${course.id}`}>
                <img src={course.feature_image} alt="course" className="courseImg" />
              </Link>
              <div className="content flex_col wide">
                {course.lessons_count && (
                  <span className="number crdDark f_10 fw_4">
                    {course.lessons_count} {t('lesson')}
                  </span>
                )}
                <h2 className="f_13 fw_7 dtitle title">{course.title}</h2>
                <div className="flex align_center gap-10">
                  <div className="imgs flex_row_c">
                    <div className="puplisher flex gap-10 align_center mt_7">
                      {[...course.teachers]?.reverse().map((teacher) => (
                        <img src={teacher.image} alt="puplisher" className="puplisher" />
                      ))}
                    </div>
                  </div>
                  <span className="f_10 fw_7 crdDark" style={{ marginTop: '5px' }}>
                    {course.teachers[0].name}
                    {course.teachers.length > 1 && (
                      <span className="pdrl_5 underline others">
                        + {course.teachers.length - 1}
                        {t('others')}
                      </span>
                    )}
                  </span>
                </div>

                <div className="progress mt_12 mb_3 flex">
                  <div className="val" style={{ width: `${100 - course.complete_percent}%` }} />
                </div>
                <span className="crdDark f_10 fw_6">
                  {course.complete_percent}% {t('complete')}
                </span>
                {/* <span className="crdDark f_10 fw_6 mt_5">{t('last_active')} 4 نوفمبر 2022</span> */}
              </div>
            </div>
          ))
        ) : (
          <div className="flex_row_c hvh_70">
            <Empty description={t('no_registerd_courses')} />
          </div>
        )}
      </div>
    </Spin>
  );
}

DashboardCourses.Layout = DashboardLayout;
