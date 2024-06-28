import { Pagination, Radio, Select, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineListBullet } from 'react-icons/hi2';
import ArrangeIcon from '../../components/Common/Icons/layout-arrange';
import RadiusHeader from '../../components/Common/radius-header/radius-header';
import CourseItem from '../../components/course-item/course';
import ClientLayout from '../../layouts/Client/ClientLayout';
import Next from '../../public/images/icons/next-page.svg';
import Prev from '../../public/images/icons/prev-page.svg';
import CoursesService from '../../services/courses/courses';

function Courses() {
  const { t } = useTranslation();
  // topic filter function
  const [topicFilter, settopicFilter] = useState('all');
  const changeTopicFilter = (e) => {
    settopicFilter(e.target.value);
  };
  // change Arrange function
  const [arrange, setarrange] = useState('date_arrange');
  const changeArrangeFilter = (val) => {
    setarrange(val);
  };
  // layout arrange
  const [layoutArrange, setlayoutArrange] = useState('blocks');
  // skelton
  const [loadingSkelton, setLoadingSkeleton] = useState(true);
  // fetch courses
  const [courses, setcourses] = useState();
  const [coursesCount, setcoursesCount] = useState();
  const [pageSize, setPageSize] = useState();

  const getCourses = (filter) => {
    CoursesService.GetCourses(filter).then((res) => {
      const coursesData = res.data.results;
      setcourses(coursesData);
      const coursesCountVal = res.data.count;
      setcoursesCount(coursesCountVal);
      if (!pageSize) setPageSize(coursesData.length);
      setLoadingSkeleton(false);
    });
  };
  useEffect(() => {
    getCourses();
  }, []);
  // pagination
  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return <img src={Prev} alt="prev" />;
    }
    if (type === 'next') {
      return <img src={Next} alt="next" />;
    }
    return originalElement;
  };
  return (
    <div className="cards-page">
      {/* header */}
      <RadiusHeader titleText="courses" pText="courses_text" />
      {/* blogs body */}
      <section className="blogsBody mt_50">
        {/* blogs filter */}
        <div className="container">
          <nav className="blogsFilter dtitle flex_col">
            <h3 className="f_24 blogsFilterTitle">{t('filter_course_title')}</h3>
            {/* topics filter */}
            <Radio.Group
              onChange={changeTopicFilter}
              value={topicFilter}
              className="filterTopics mt_20 mb_24 flex_row gap-10 f_17 fw_6"
            >
              <Radio.Button className="filterBtn" value="all">
                <span className="btnText">{t('all_courses')}</span>
              </Radio.Button>

              {/* {['اخلاق', 'معاملات', 'متون', 'البيت المسلم', 'القدوة'].map((topic) => (
                <Radio.Button className="filterBtn" value={topic} key={topic}>
                  <span className="btnText">{topic}</span>
                </Radio.Button>
              ))} */}
            </Radio.Group>
            {/* arrange filter */}
            <div className="arrangeFilter flex_row gap-10">
              <Select
                width="220px"
                className="arrangeItem arrangeSelect"
                value={arrange}
                onChange={changeArrangeFilter}
                options={[
                  {
                    value: 'date_arrange',
                    label: t('date_arrange'),
                  },
                  {
                    value: 'tutor_arrange',
                    label: t('tutor_arrange'),
                  },
                ]}
              />
              <button
                type="button"
                className={`arrangBtn arrangeItem flex_row_c  ${layoutArrange === 'blocks' ? 'activeArrange' : ''}`}
                onClick={() => {
                  setlayoutArrange('blocks');
                }}
              >
                <ArrangeIcon />
              </button>
              <button
                type="button"
                className={`arrangBtn arrangeItem flex_row_c  ${layoutArrange === 'rows' ? 'activeArrange' : ''}`}
                onClick={() => {
                  setlayoutArrange('rows');
                }}
              >
                <HiOutlineListBullet />
              </button>
            </div>
          </nav>
          {/* blogs body */}
          <div className={`blogsItems ${layoutArrange} flex gap-30 wrap mt_35 stretch`}>
            {loadingSkelton
              ? Array.from({ length: 12 }).map((_, i) => (
                  <div className="flex_col blogItem gap-20" key={`${i * 2}key`}>
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
                ))
              : courses.map((course) => <CourseItem src={course} key={course.id} />)}
          </div>
          {/* pagination */}
          {coursesCount && (
            <div className="flex_row_c mbt_35 paginaion">
              <Pagination
                defaultCurrent={1}
                total={coursesCount}
                itemRender={itemRender}
                className="flex paginaionDiv"
                showSizeChanger={false}
                pageSize={pageSize}
                onChange={(e) => {
                  setLoadingSkeleton(true);
                  getCourses(`?page=${e}`);
                }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
export default Courses;
Courses.Layout = ClientLayout;
