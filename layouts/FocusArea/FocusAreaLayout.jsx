import { Collapse, message, Spin } from 'antd';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RxChevronLeft, RxChevronRight } from 'react-icons/rx';
import { Context } from '../../components/Common/Context/Context';
import TransitionEffect from '../../components/Common/transition/transition';
import Navbar from '../../components/main-navbar/navbar';
import GetAllLessonsAndQs from '../../helpers/courses/helpers';
import arrow from '../../public/images/icons/arrow.svg';
import check from '../../public/images/icons/check.svg';
import lessonVid from '../../public/images/icons/lessonVid.svg';
import lock from '../../public/images/icons/lock.svg';
import question from '../../public/images/icons/question.svg';
import CoursesService from '../../services/courses/courses';

const { Panel } = Collapse;

function ClientLayout({ children, genInfo }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { courseId } = router.query;
  const CourseId = Number(courseId);
  const { lessonId } = router.query;
  const LessonId = Number(lessonId);
  const { quizId } = router.query;
  const QuizId = Number(quizId);

  const { type } = router.query;
  // next and prev btns logic function
  const [unitKey, setunitKey] = useState();
  const [nextItem, setnextItem] = useState();
  const [prevItem, setprevItem] = useState();
  const proccessNextAccess = (Data, gonext) => {
    Data.units.filter((unit, unitIndex) => {
      let cond;
      GetAllLessonsAndQs(unit.lessons).map((lesson, index) => {
        cond = (lesson.id === LessonId && lesson.type === 'lesson') || (lesson.id === QuizId && lesson.type === 'quiz');
        if (cond) {
          setunitKey(unit.title);
          if (GetAllLessonsAndQs(unit.lessons)[index + 1]) {
            const next = GetAllLessonsAndQs(unit.lessons)[index + 1];
            setnextItem(next);
            if (gonext && next.has_access)
              router.push(`/course-details/${CourseId}/focus-area/${next.type}/${next.id}`);
          } else if (Data.units[unitIndex + 1]) {
            const next = GetAllLessonsAndQs(Data.units[unitIndex + 1].lessons)[0];
            setnextItem(next);
            if (gonext && next.has_access)
              router.push(`/course-details/${CourseId}/focus-area/${next.type}/${next.id}`);
          } else {
            setnextItem(null);
          }
          if (GetAllLessonsAndQs(unit.lessons)[index - 1]) {
            setprevItem(GetAllLessonsAndQs(unit.lessons)[index - 1]);
          } else if (Data.units[unitIndex - 1]) {
            setprevItem(
              GetAllLessonsAndQs(Data.units[unitIndex - 1].lessons)[Data.units[unitIndex - 1].lessons.length - 1]
            );
          } else {
            setprevItem(null);
          }
        }
        return cond;
      });
      return cond;
    });
  };
  // fetching course data and navigating function
  const [areaSpin, setareaSpin] = useState(false);
  const { setCourseData, goNext, setgoNext } = useContext(Context);
  const [courseDataSt, setcourseDataSt] = useState();
  const getSignleCourse = (gonext) => {
    if (gonext) setareaSpin(true);
    CoursesService.GetSingleCourse(CourseId)
      .then((res) => {
        const { data } = res;
        setCourseData(data);
        setcourseDataSt(data);
        proccessNextAccess(data, gonext);
        if (goNext) setareaSpin(false);
      })
      .catch((err) => {
        const errorObj = err?.response?.data;
        if (errorObj) {
          message.error({ content: t(errorObj), duration: 4 });
          router.push('/');
        }
      });
  };
  useEffect(() => {
    if (CourseId) {
      getSignleCourse();
      setgoNext(false);
    }
  }, [router.asPath]);
  useEffect(() => {
    if (goNext) getSignleCourse(true); // true param refers to navigating to next route
  }, [goNext]);
  const [rerendrArea, setrerendrArea] = useState(true);
  useEffect(() => {
    setrerendrArea(false);
    document.querySelector('.layoutSidebar').classList.remove('activeFocus');
    setTimeout(() => {
      setrerendrArea(true);
    }, 100);
  }, [router.asPath]);
  return (
    <>
      <Navbar activeNav dsNavbar focusLayout genInfo={genInfo} />
      {/* fetching cdn video.js css */}
      <Head>
        <link href="//vjs.zencdn.net/7.10.2/video-js.min.css" rel="stylesheet" />
      </Head>
      <div className="wide">
        <div className="focusAreaCont flex">
          {/* layout sidebar */}
          <div className="layoutSidebar">
            {courseDataSt && (
              <aside className="sidebar">
                <div className="flex_col pdr_56 pdl_40 headSide">
                  <h1 className="f_20 fw_7 bc"> {courseDataSt.title}</h1>
                  <div className="proggres mb_13">
                    <div className="val" style={{ width: `${100 - courseDataSt.complete_percent}%` }} />
                  </div>
                  <span className="crdDark  fw_6 f_10">{courseDataSt.complete_percent}% مكتمل</span>
                </div>

                <Collapse
                  bordered={false}
                  className="panelCont"
                  defaultActiveKey={unitKey}
                  expandIcon={() => <img src={arrow} alt="arrow" />}
                >
                  {courseDataSt.units.map((unit) => (
                    <Panel
                      header={
                        <span className="flex_btw header align_center">
                          <span
                            className={`flex gap-18 unitTitle ${
                              unit.lessons[unit.lessons.length - 1].is_completed ? 'mc' : ''
                            }`}
                          >
                            {unit.title}
                          </span>
                          <div className="flex_row_c gap">
                            <div className="flex">
                              <span
                                className={`status flex_row_c ${
                                  unit.lessons[unit.lessons.length - 1].is_completed ? 'complete' : ''
                                }`}
                              >
                                {unit.lessons[unit.lessons.length - 1].is_completed && <img src={check} alt="check" />}
                              </span>
                            </div>
                          </div>
                        </span>
                      }
                      key={unit.title}
                      className="panelItem"
                    >
                      {GetAllLessonsAndQs(unit.lessons).map((lesson, index) => (
                        <div className="panelContainer flex_col" key={lesson.title}>
                          <div
                            className={`lessonItem flex_btw 
                          ${lesson.id === LessonId && lesson.type === 'lesson' ? 'activeLesson' : null} 
                          ${lesson.id === QuizId && lesson.type === 'quiz' ? 'activeLesson' : null}
                          ${lesson.has_access ? 'allowdLesson' : 'blockedLesson'}`}
                            id={`${index}`}
                          >
                            <Link
                              href={`${
                                lesson.has_access
                                  ? lesson.type === 'lesson'
                                    ? `/course-details/${CourseId}/focus-area/lesson/${lesson.id}`
                                    : `/course-details/${CourseId}/focus-area/quiz/${lesson.id}`
                                  : window.location.href
                              }`}
                              className="wide flex_btw anch"
                              id={`anch-${index}`}
                            >
                              <div className="lessonDetails flex gap-26">
                                <img src={lesson.type === 'lesson' ? lessonVid : question} alt="lesson" />
                                <span className="flex gap-12 lessonTitle">
                                  <span className={`f_13 fw_7 ${lesson.is_completed ? 'complete' : ''}`}>
                                    {lesson.title}
                                  </span>
                                </span>
                              </div>
                              {!lesson.has_access && <img src={lock} alt="lock" width="18px" />}
                              <span
                                className={`status ${lesson.is_completed ? 'complete' : ''} flex_row_c`}
                                style={{ marginRight: '10px' }}
                              >
                                {lesson.is_completed && <img src={check} alt="check" />}
                              </span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </Panel>
                  ))}

                  {courseDataSt.final_exam && (
                    <Panel
                      header={
                        <span className="flex_btw header align_center">
                          <span className={`flex gap-18 unitTitle ${courseDataSt.final_exam.is_completed ? 'mc' : ''}`}>
                            {courseDataSt.final_exam.title}
                          </span>
                          <div className="flex_row_c gap">
                            <div className="flex">
                              <span
                                className={`status flex_row_c ${
                                  courseDataSt.final_exam.is_completed ? 'complete' : ''
                                }`}
                              >
                                {courseDataSt.final_exam.is_completed && <img src={check} alt="check" />}
                              </span>
                            </div>
                          </div>
                        </span>
                      }
                      key={courseDataSt.final_exam.title}
                      className="panelItem"
                    >
                      <div className="panelContainer flex_col">
                        <div
                          className={`lessonItem flex_btw 
                          ${type === 'final-exam' ? 'activeLesson' : null} 
                          ${courseDataSt.final_exam.id.has_access ? 'allowdLesson' : 'blockedLesson'}`}
                          id={`${courseDataSt.final_exam.id}`}
                        >
                          <Link
                            href={
                              courseDataSt.final_exam.has_access
                                ? `/course-details/${CourseId}/focus-area/quiz/${courseDataSt.final_exam.id}?type=final-exam`
                                : window.location.href
                            }
                            className="wide flex_btw anch"
                          >
                            <div className="lessonDetails flex gap-26">
                              <img src={question} alt="Exam" />
                              <span className="flex gap-12 lessonTitle">
                                <span className={`f_13 fw_7 ${courseDataSt.final_exam.is_completed ? 'complete' : ''}`}>
                                  {courseDataSt.final_exam.title}
                                </span>
                              </span>

                              {!courseDataSt.final_exam.has_access && <img src={lock} alt="lock" width="18px" />}
                              <span
                                className={`status ${
                                  courseDataSt.final_exam.is_completed ? 'complete' : ''
                                } flex_row_c`}
                                style={{ marginRight: '10px' }}
                              >
                                {courseDataSt.final_exam.is_completed && <img src={check} alt="check" />}
                              </span>
                            </div>
                          </Link>
                        </div>
                      </div>
                    </Panel>
                  )}
                </Collapse>
              </aside>
            )}
          </div>
          {/* layout main container */}
          <div className="layoutMainCont flex_grow">
            <div className="head flex_btw align_center wide">
              <Link href={`/course-details/${CourseId}`}>
                <span className="f_15 fw_6"> {courseDataSt?.title} </span>
              </Link>
              <div className="flex gap-26 leftBtns">
                <span className="mcBg wc f_13 fw_6 pdrl_18 inProgress">فى تقدم</span>
                <div className="navigate flex">
                  <button
                    type="button"
                    className={`navigateItem mcBg next ${nextItem?.has_access ? '' : 'blocked'}`}
                    id="nav-next-focus"
                    onClick={() => {
                      if (nextItem?.has_access) {
                        router.push(`/course-details/${CourseId}/focus-area/${nextItem.type}/${nextItem.id}`);
                      }
                    }}
                  >
                    <RxChevronRight />
                  </button>
                  <button
                    type="button"
                    className={`navigateItem mcBg prev ${prevItem?.has_access ? '' : 'blocked'}`}
                    onClick={() => {
                      if (prevItem?.has_access) {
                        router.push(`/course-details/${CourseId}/focus-area/${prevItem.type}/${prevItem.id}`);
                      }
                    }}
                  >
                    <RxChevronLeft />
                  </button>
                </div>
              </div>
            </div>
            <Spin spinning={areaSpin}>{rerendrArea && <TransitionEffect>{children}</TransitionEffect>}</Spin>
          </div>
        </div>
      </div>
    </>
  );
}
export default ClientLayout;
