import {
  Avatar,
  Button,
  Collapse,
  Input,
  List,
  message,
  Modal,
  notification,
  Progress,
  Rate,
  Skeleton,
  Spin,
} from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import AuthHelpers from '../../../helpers/auth/helpers';
import GetAllLessonsAndQs from '../../../helpers/courses/helpers';
import ActiveNavClientLayout from '../../../layouts/Client/ActiveNavClientLayout';
import commentImg from '../../../public/images/commentImg.png';
import arrow from '../../../public/images/icons/arrow.svg';
import check from '../../../public/images/icons/check.svg';
import Course from '../../../public/images/icons/course.png';
import DegreePrief from '../../../public/images/icons/degreePrief.png';
import lessonVid from '../../../public/images/icons/lessonVid.svg';
import lock from '../../../public/images/icons/lock.svg';
import question from '../../../public/images/icons/question.svg';
import QuestionPrief from '../../../public/images/icons/questionPrief.png';
import TimePrief from '../../../public/images/icons/timePrief.png';
import VideoPrief from '../../../public/images/icons/videoPrief.png';
import CoursesService from '../../../services/courses/courses';

const { TextArea } = Input;
const { Panel } = Collapse;

function CourseDetails() {
  const { t } = useTranslation();
  const router = useRouter();
  const { courseId } = router.query;
  const ID = Number(courseId);
  const [showAddrate, setshowAddrate] = useState(false);
  const [showLoader, setshowLoader] = useState(false);
  const [loadmore, setloadmore] = useState(false);
  // fetch data
  const [subed, setsubed] = useState(false);
  const [CourseData, setCourseData] = useState();
  const [RatesReviews, setCourseRatesReviews] = useState([]);
  const [RatesRes, setRatesRes] = useState();
  const [RatesStars, setCourseRatesStars] = useState();
  const [fullLoadedRates, setfullLoadedRates] = useState(false);
  const [Teachers, setCoursTeachers] = useState();
  const [loading, setloading] = useState(true);
  const GetRates = (link) => {
    CoursesService.GetSingleCourseRates(link).then((res) => {
      const ratesVal = res.data;
      setRatesRes(ratesVal);
      setCourseRatesReviews([...RatesReviews, ...ratesVal.results]);
      const RatesObj = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };
      for (let index = 0; index < ratesVal.results.length; index += 1) {
        RatesObj[ratesVal.results[index].rate] += 1;
      }
      setCourseRatesStars(RatesObj);
      setshowLoader(false);
      setloadmore(false);
      if (ratesVal.count === [...RatesReviews, ...ratesVal.results].length) {
        setfullLoadedRates(true);
      }
    });
  };
  useEffect(() => {
    if (courseId) {
      CoursesService.GetSingleCourse(ID).then((res) => {
        const Src = res.data;
        setCourseData(Src);
        setCoursTeachers([...Src.teachers].reverse());
        setloading(false);
        if (Src.is_enrolled) {
          setsubed(true);
        }
      });
      GetRates(`/lms/course/${ID}/rate/`);
    }
  }, [courseId]);
  // get unit quiz number
  const GetUnitQuizNumber = (unit) => {
    let Num = 0;
    for (let index = 0; index < unit.lessons.length; index += 1) {
      if (unit.lessons[index].quiz) {
        Num += 1;
      }
    }
    return Num;
  };

  // subscribe function
  const [openSubModal, setOpenSubModal] = useState(false);
  const subscribeNow = () => {
    if (!CourseData.is_enrolled) {
      if (AuthHelpers.CheckAuth()) {
        setloading(true);
        CoursesService.EnrollCourse(Number(courseId))
          .then(() => {
            setOpenSubModal(true);
            setsubed(true);
            setloading(false);
          })
          .catch(() => {});
      } else {
        router.push(`/register`);
        sessionStorage.comingFromCourse = ID;
      }
    }
  };
  // Add reate
  const [rateSpin, setrateSpin] = useState(false);
  const [AddRateNumber, setAddRateNumber] = useState(4);
  const [reviewComment, setreviewComment] = useState();
  const [alreadyRated, setalreadyRated] = useState(false);

  const AddRate = () => {
    setrateSpin(true);
    CoursesService.AddCourseRate(Number(courseId), {
      rate: AddRateNumber,
      comment: reviewComment,
    })
      .then(() => {
        message.success({ content: t('rate_added'), duration: 2 });
      })
      .catch((err) => {
        const errorObj = err.response.data;
        message.error({ content: t(errorObj), duration: 4 });
      })
      .finally(() => {
        setrateSpin(false);
        setshowAddrate(false);
        setreviewComment('');
        setalreadyRated(true);
      });
  };
  return (
    <div className="course-details-page" id="header-ref">
      <Spin spinning={loading}>
        {/* main header */}
        <header className="courseHeader wc">
          <img src={CourseData?.cover_image} alt="cover" className="cover" />
          <div className="containerHead flex_btw">
            <div className="contentHead">
              <h1 className="f_30 fw_7 title">{CourseData?.title}</h1>
              {/* rate */}
              {CourseData && (
                <div className="rate flex align_center gap-16 mb">
                  <Rate disabled value={Math.round(CourseData.rate_avg)} character={<></>} />
                  <span className="f_24 fw_6 yellow">{CourseData.rate_avg.toFixed(1) || 0}</span>
                </div>
              )}
              {/* puplishers */}
              <div className="puplishers flex gap-24 align_center mb_20">
                <div className="imgs flex">
                  {Teachers?.map((teacher) => (
                    <img src={teacher.image} alt="auth1" key={teacher.name} />
                  ))}
                </div>
                <span className="f_20 fw_5 pupNames">
                  {CourseData?.teachers[0].name}
                  {CourseData?.teachers.length > 1 && (
                    <span className="pdrl_5 underline others">
                      + {CourseData.teachers.length - 1}
                      {t('others')}
                    </span>
                  )}
                </span>
              </div>
              {/* course btns */}
              <Modal
                title={t('enrolled_succesfully')}
                open={openSubModal}
                onCancel={() => {
                  setOpenSubModal(false);
                }}
                width={787}
                centered
                closeIcon={<AiOutlineCloseCircle />}
                maskStyle={{ background: 'rgba(255, 255, 255, 0.81)' }}
                wrapClassName="enrolledPopup noFooter"
              >
                <p className="fw_6 pdb_10 f_20 center enrollMsg">{t('enrolled_msg')}</p>
                <div className="flex_end">
                  <Button
                    type="primary"
                    size="large"
                    className="bold submit f_16"
                    onClick={() => {
                      setOpenSubModal(false);
                    }}
                  >
                    {t('ok')}
                  </Button>
                </div>
              </Modal>
              <div className="courseBtns">
                {subed ? (
                  <div className="flex_col gap-11 mb_20">
                    <span className="fw_7 f_16 mb_10">{t('in_progress')}</span>
                    <div className="flex gap-19">
                      <button
                        type="button"
                        className="wc f_20 fw_7 pdtb_4 pdrl_14 mcBg"
                        onClick={() => {
                          let fullFilled = false;
                          const Units = [...CourseData.units].reverse();
                          let firstLessonId;
                          for (let i = 0; i < Units.length; i += 1) {
                            const lessons = [...GetAllLessonsAndQs(Units[i].lessons)].reverse();
                            firstLessonId = lessons[lessons.length - 1].id;
                            for (let index = 0; index < lessons.length; index += 1) {
                              const lesson = lessons[index];
                              if (lesson.is_completed) {
                                if (lesson.type === 'lesson') {
                                  router.push(`/course-details/${ID}/focus-area/lesson/${lesson.id}`);
                                } else {
                                  router.push(`/course-details/${ID}/focus-area/quiz/${lesson.id}`);
                                }
                                fullFilled = true;
                                break;
                              }
                            }
                            if (fullFilled) {
                              break;
                            }
                          }
                          if (!fullFilled) {
                            router.push(`/course-details/${ID}/focus-area/lesson/${firstLessonId}`);
                          }
                        }}
                      >
                        {t('continue_studying')}
                      </button>
                      <Link
                        href={`/dashboard/blogs/${CourseData.course_forum}`}
                        className="mc f_20 fw_7 pdtb_4 pdrl_30 wcBg"
                      >
                        {t('course_blog')}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <button type="button" className="wc f_24 fw_7 pdtb_4 pdrl_40 mcBg mb_34" onClick={subscribeNow}>
                      {t('sub_now')}
                    </button>
                  </>
                )}
              </div>
              {/* subs number */}
              <p className="fw_6 f_15 flex align_center gap-6">
                <span>{CourseData?.enrolled_count}</span>
                <span>{t('subs')}</span>
              </p>
            </div>
            {subed && (
              <div className="progress">
                <Progress
                  type="dashboard"
                  percent={CourseData.complete_percent}
                  gapDegree={0}
                  strokeColor={{
                    '0%': '#BB0000',
                    '6%': '#B61700',
                    '35%': '#A95B00',
                    '66%': '#61DC00',
                    '100%': '#038B29',
                  }}
                  strokeWidth={9}
                  width="208px"
                  trailColor="#BBBBBB"
                />
                <span className="val f_25 fw_9">{CourseData.complete_percent}%</span>
              </div>
            )}
          </div>
        </header>
        {/* course content */}
        <article className="courseContent">
          <div className="courseContainer flex_btw gap-100 align_start">
            <section className="mainContent flex_col">
              {/* about course */}
              {CourseData?.description && (
                <>
                  <h2 className="f_24 fw_7 mb_21">{t('about_course')}</h2>
                  <div className="desc flex_col gap-30 fw_5 f_15 mb_40">
                    <p dangerouslySetInnerHTML={{ __html: CourseData?.description }} />
                  </div>
                </>
              )}

              {CourseData?.goals && (
                <>
                  <h2 className="f_24 fw_7 mb_21">{t('course_goals')}</h2>
                  <div className="goals flex_col gap-30 fw_5 f_15 mb_40">
                    <p dangerouslySetInnerHTML={{ __html: CourseData.goals }} />
                  </div>
                </>
              )}
              {/* instructors */}
              <h2 className="f_24 fw_7 mb_39">{t('instructors')}</h2>
              <div className="flex_btw wrap instCont">
                {CourseData?.teachers.map((instructor) => (
                  <div className="instructor flex gap-20" key={`${instructor.id} key`}>
                    <img src={instructor.image} alt="instructor" className="img" />
                    <div className="flex_col">
                      <h3 className="crdDark fw_7 f_20 mb_6 instName">{instructor.name}</h3>
                      <p className="fw_5 f_14 desc mb_7">{instructor.description}</p>
                      <div className="flex gap-7">
                        <img src={Course} alt="course" />
                        <span className="fw_7">
                          {instructor.course_count} {instructor.course_count <= 1 ? t('program') : t('programs')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* course content collapse */}
              {CourseData?.units?.length > 0 && (
                <h2 className="f_24 fw_7 mt_82 mb_40" id="units">
                  {t('course_content')}
                </h2>
              )}

              <div className="wide courseContentCollpase">
                {CourseData?.units?.length > 0 && (
                  <Collapse
                    bordered={false}
                    className="panelCont"
                    defaultActiveKey={[CourseData?.units[0]?.title]}
                    expandIcon={() => <img src={arrow} alt="arrow" />}
                  >
                    {/* add course content mapping course_content */}
                    {CourseData?.units?.map(
                      (Unit) =>
                        Unit.lessons?.length > 0 && (
                          <Panel
                            header={
                              <span className="flex_btw header align_center">
                                <span className="flex gap-18">
                                  <span
                                    className={`lessonsTitleName ${
                                      Unit.lessons[Unit.lessons.length - 1]?.is_completed ? ' complete ' : ''
                                    }`}
                                  >
                                    {Unit.title}
                                  </span>
                                  {!Unit.lessons[0]?.has_access ? (
                                    <span className="lock" style={{ marginLeft: '20px' }}>
                                      <img src={lock} alt="lock" />
                                    </span>
                                  ) : null}
                                </span>
                                <div className="flex gap-20 statusCont" style={{ marginRight: '20px' }}>
                                  <span className="unitStr">
                                    {Unit.lessons.length} {t('lesson')} , {GetUnitQuizNumber(Unit)} {t('test')}
                                  </span>
                                  <span
                                    className={`status ${
                                      Unit.lessons[Unit.lessons.length - 1]?.is_completed ? ' complete ' : ''
                                    } flex_row_c`}
                                  >
                                    {Unit.lessons[Unit.lessons.length - 1].is_completed ? (
                                      <img src={check} alt="check" />
                                    ) : null}
                                  </span>
                                </div>
                              </span>
                            }
                            key={Unit.title}
                            className="panelItem"
                          >
                            {GetAllLessonsAndQs(Unit.lessons).map((lesson) => (
                              <div className="panelContainer flex_col gap-26" key={`${lesson.title} key${lesson.id}`}>
                                <div className="lessonItem flex_btw">
                                  {!lesson.has_access ? (
                                    <button
                                      type="button"
                                      className="lessonDetails flex gap-26"
                                      onClick={() => {
                                        if (subed) {
                                          notification.open({
                                            message: t("you can't access this lesson"),
                                            type: 'error',
                                            description: t(
                                              'Watch the full lessons in order. Lessons open sequentially if you watch them in their order.'
                                            ),
                                            duration: 8,
                                          });
                                        } else {
                                          window.scrollTo({
                                            top: 0,
                                            behavior: 'smooth',
                                          });
                                        }
                                      }}
                                    >
                                      <img src={lesson.type === 'lesson' ? lessonVid : question} alt="lesson" />
                                      <span className="flex align_center gap-12">
                                        <span className="f_13 fw_6 lessonsTitle midgc">{lesson.title}</span>
                                        <img src={lock} alt="lock" className="lock" />
                                      </span>
                                    </button>
                                  ) : (
                                    <Link
                                      href={`${
                                        lesson.type === 'lesson'
                                          ? `/course-details/${ID}/focus-area/lesson/${lesson.id}`
                                          : `/course-details/${ID}/focus-area/quiz/${lesson.id}`
                                      }`}
                                    >
                                      <div className="lessonDetails flex gap-26">
                                        <img src={lesson.type === 'lesson' ? lessonVid : question} alt="lesson" />
                                        <span className="flex gap-12">
                                          <span
                                            className={`f_13 fw_7 lessonsTitle ${
                                              lesson.is_completed ? 'complete' : ''
                                            }`}
                                          >
                                            {lesson.title}
                                          </span>
                                        </span>
                                      </div>
                                    </Link>
                                  )}

                                  <span className={`status ${lesson.is_completed ? 'complete' : ''} flex_row_c`}>
                                    {lesson.is_completed ? <img src={check} alt="check" /> : null}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </Panel>
                        )
                    )}
                    {CourseData?.final_exam && (
                      <Panel
                        header={
                          <span className="flex_btw header align_center">
                            <span className="flex gap-18">
                              <span
                                className={`lessonsTitleName ${
                                  CourseData?.final_exam?.is_completed ? ' complete ' : ''
                                }`}
                              >
                                {CourseData?.final_exam?.title}
                              </span>
                              {!CourseData?.final_exam?.has_access ? (
                                <span className="lock" style={{ marginLeft: '20px' }}>
                                  <img src={lock} alt="lock" />
                                </span>
                              ) : null}
                            </span>
                            <div className="flex gap-20 statusCont" style={{ marginRight: '20px' }}>
                              <span className="unitStr">
                                {CourseData?.final_exam?.questions_count} {t('final exam')}
                              </span>
                              <span
                                className={`status ${
                                  CourseData?.final_exam?.is_completed ? ' complete ' : ''
                                } flex_row_c`}
                              >
                                {CourseData?.final_exam?.is_completed ? <img src={check} alt="check" /> : null}
                              </span>
                            </div>
                          </span>
                        }
                        key={CourseData?.final_exam?.title}
                        className="panelItem"
                        id="final-exam"
                      >
                        <div
                          className="panelContainer flex_col gap-26"
                          key={`${CourseData?.final_exam.title} key${CourseData?.final_exam.id}`}
                        >
                          <div className="lessonItem flex_btw">
                            {!CourseData?.final_exam.has_access ? (
                              <button
                                type="button"
                                className="lessonDetails flex gap-26"
                                onClick={() => {
                                  if (subed) {
                                    notification.open({
                                      message: t("you can't access this lesson"),
                                      type: 'error',
                                      description: t(
                                        'Watch the full lessons in order. Lessons open sequentially if you watch them in their order.'
                                      ),
                                      duration: 8,
                                    });
                                  } else {
                                    window.scrollTo({
                                      top: 0,
                                      behavior: 'smooth',
                                    });
                                  }
                                }}
                              >
                                <img
                                  src={CourseData?.final_exam.type === 'lesson' ? lessonVid : question}
                                  alt="lesson"
                                />
                                <span className="flex align_center gap-12">
                                  <span className="f_13 fw_6 lessonsTitle midgc">{CourseData?.final_exam.title}</span>
                                  <img src={lock} alt="lock" className="lock" />
                                </span>
                              </button>
                            ) : (
                              <Link
                                href={
                                  CourseData.final_exam.has_access
                                    ? `/course-details/${ID}/focus-area/quiz/${CourseData.final_exam.id}?type=final-exam`
                                    : '/'
                                }
                              >
                                <div className="lessonDetails flex gap-26">
                                  <img src={question} alt="final exam" />
                                  <span className="flex gap-12">
                                    <span
                                      className={`f_13 fw_7 lessonsTitle ${
                                        CourseData?.final_exam.is_completed ? 'complete' : ''
                                      }`}
                                    >
                                      {CourseData?.final_exam.title}
                                    </span>
                                  </span>
                                </div>
                              </Link>
                            )}

                            <span
                              className={`status ${CourseData?.final_exam.is_completed ? 'complete' : ''} flex_row_c`}
                            >
                              {CourseData?.final_exam.is_completed ? <img src={check} alt="check" /> : null}
                            </span>
                          </div>
                        </div>
                      </Panel>
                    )}
                  </Collapse>
                )}
              </div>
              {/* rates */}
              <h2 className="f_24 fw_7 mt_82 mb_40">{t('rates')}</h2>
              <section className="rates flex gap-75">
                <div className="stars">
                  <div className="starsCont flex_col_c">
                    {CourseData && (
                      <>
                        <h2 className="f_30 fw_8 mb_3">{CourseData.rate_avg.toFixed(1)}</h2>
                        <Rate
                          disabled
                          allowHalf
                          count={5}
                          defaultValue={Math.round(CourseData.rate_avg.toFixed(1))}
                          character={<></>}
                        />
                      </>
                    )}

                    <p className="f_16 fw_5 mt_9 whorated">{RatesReviews?.length} قام بتقييم الدورة</p>
                    <section className="ratesValues wide mt_24 flex_col gap-15 mb_40 pdrl_25">
                      {RatesStars &&
                        Object.keys(RatesStars)
                          .reverse()
                          .map((star) => (
                            <div className="rateItem flex_row_c gap-8" key={`${star}key`}>
                              <span className="f_14 fw_4 starNum">
                                {star} {t('star')}
                              </span>
                              <div className="progress">
                                <div
                                  className="val"
                                  style={{ width: `calc(${(RatesStars[star] / RatesReviews.length) * 100}%)` }}
                                />
                              </div>
                              <span className="f_14 fw_5 precent">
                                {RatesReviews.length ? ((RatesStars[star] / RatesReviews.length) * 100).toFixed(1) : 0}%
                              </span>
                            </div>
                          ))}
                    </section>
                    {subed && (
                      <>
                        <button
                          type="button"
                          className="f_15 fw_5 pdtb_6 pdrl_42 addRateBtn mb_45"
                          onClick={() => {
                            setshowAddrate(true);
                          }}
                        >
                          {t('add rate')}
                        </button>
                        {showAddrate && (
                          <div className="wide">
                            {alreadyRated ? (
                              <span className="f_20 fw_7 dc center block">
                                {' '}
                                {t('You have already rated this course')}
                              </span>
                            ) : (
                              <Spin spinning={rateSpin}>
                                <div className="addRateCont flex_col_c">
                                  <span className="f_16 fw_4 mb_8">{t('add_rates_here')}</span>
                                  <Rate
                                    defaultValue={4}
                                    className="addRateStars"
                                    onChange={(rate) => {
                                      setAddRateNumber(rate);
                                    }}
                                  />
                                  <TextArea
                                    className="review mt_28"
                                    value={reviewComment}
                                    onChange={(e) => {
                                      setreviewComment(e.target.value);
                                    }}
                                  />
                                  <button type="button" className="send f_14 fw_6 mt_37 wide pdtb_12" onClick={AddRate}>
                                    {t('send')}
                                  </button>
                                </div>
                              </Spin>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="reviews">
                  <div className="reviewsCont flex_col gap-15">
                    {RatesReviews?.map((review) => (
                      <div className="review flex_col wide gap-14" key={review.id}>
                        <div className="head flex gap-12 wide">
                          <img src={review.profile.profile_picture || commentImg} alt="user" />
                          <div className="flex_col gap-7 flex_grow">
                            <span className="dc fw_7 f_14">
                              {review.profile.user.first_name || t('the_name')} {review.profile.user.last_name}
                            </span>
                            <Rate
                              disabled
                              allowHalf
                              count={5}
                              defaultValue={Math.round(review.rate.toFixed(1))}
                              character={<></>}
                              className="commentRate"
                            />
                          </div>
                        </div>
                        <p className="commentText f_14 fw_4">{review.comment}</p>
                      </div>
                    ))}
                    {showLoader && loadmore && (
                      <>
                        <Skeleton avatar title={false} loading active>
                          <List.Item.Meta
                            avatar={<Avatar src={commentImg} />}
                            title="محمود علي"
                            description=" جزاكم الله خيرًا"
                          />
                        </Skeleton>
                        <br />
                        <Skeleton avatar title={false} loading active>
                          <List.Item.Meta
                            avatar={<Avatar src={commentImg} />}
                            title="محمود علي"
                            description=" جزاكم الله خيرًا"
                          />
                        </Skeleton>
                        <br />
                        <Skeleton avatar title={false} loading active>
                          <List.Item.Meta
                            avatar={<Avatar src={commentImg} />}
                            title="محمود علي"
                            description=" جزاكم الله خيرًا"
                          />
                        </Skeleton>
                      </>
                    )}

                    {!fullLoadedRates && <div className="loadShadow" />}
                    {!fullLoadedRates && (
                      <div className="flex_row_c wide">
                        <button
                          type="button"
                          className="f_15 fw_5 pdtb_6 pdrl_42 seeMore"
                          onClick={() => {
                            if (RatesRes.next) {
                              setshowLoader(true);
                              setloadmore(true);
                              GetRates(RatesRes.next.replace('http:', 'https:'));
                            }
                          }}
                        >
                          {t('see_more')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </section>
            <div className="leftInfoCont">
              <nav className="leftInfo flex_col gap-30">
                <div className="navItem flex gap-30 align_center">
                  <span className="imgCont">
                    <img src={VideoPrief} alt="video" />
                  </span>
                  <span className="f_20 fw_7 name">
                    {CourseData?.lessons_count} {t('lesson')}
                  </span>
                </div>
                <div className="navItem flex gap-30 align_center">
                  <span className="imgCont">
                    <img src={QuestionPrief} alt="video" />
                  </span>
                  <span className="f_20 fw_7 name">
                    {CourseData?.quizzes_count} {t('tests')}
                  </span>
                </div>
                <div className="navItem flex gap-30 align_center">
                  <span className="imgCont">
                    <img src={TimePrief} alt="video" />
                  </span>
                  <span className="f_20 fw_7 name">
                    {CourseData?.time_in_hours} {t('hours')}
                  </span>
                </div>
                <div className="navItem flex gap-30 align_center">
                  <span className="imgCont">
                    <img src={DegreePrief} alt="video" />
                  </span>
                  <span className="f_20 fw_7 name">{t('degree_littel')}</span>
                </div>
              </nav>
            </div>
          </div>
        </article>
      </Spin>
    </div>
  );
}
export default CourseDetails;
CourseDetails.Layout = ActiveNavClientLayout;
