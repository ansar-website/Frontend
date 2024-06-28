import { message, Radio, Spin } from 'antd';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { MdCancel } from 'react-icons/md';
import { Context } from '../../../../../components/Common/Context/Context';
import Survey from '../../../../../components/survey/survey';
import GetAllLessonsAndQs from '../../../../../helpers/courses/helpers';
import FocusAreaLayout from '../../../../../layouts/FocusArea/FocusAreaLayout';
import LessonsService from '../../../../../services/lessons/lessons';

function Quiz() {
  const router = useRouter();
  const { quizId, type } = router.query;
  const ID = Number(quizId);
  const { courseData, setgoNext } = useContext(Context);
  const [courseDataSt, setCourseDataSt] = useState();
  // const [qVal, setqVal] = useState();
  const [spinning, setspinning] = useState(true);
  const [quizScore, setquizScore] = useState([]);
  const [quizStarted, setquizStarted] = useState(false);
  const [qsObjSt, setqsObjst] = useState();
  const [currentQ, setcurrentQ] = useState();

  // set quiz type
  const [isFinal, setIsFinal] = useState('undefined');
  useEffect(() => {
    if (type === 'final-exam') {
      setIsFinal(true);
    } else {
      setIsFinal(false);
    }
  }, [type]);

  const GetQs = (showAlert) => {
    // show error alert if the student start the quiz by click on the start quiz button, else if the page restarted the quiz will try to get the questions without showing the error alert
    LessonsService.GetQuizQs(ID, isFinal)
      .then((res) => {
        const qsArr = res.data;
        const qsObj = {};
        for (let index = 0; index < qsArr.length; index += 1) {
          qsObj[index + 1] = isFinal
            ? {
                question: {
                  question: qsArr[index].question,
                  answers: qsArr[index].answers,
                  id: qsArr[index].id,
                },
                answer: null,
                count: index + 1,
              }
            : { question: qsArr[index].question, answer: null, count: index + 1 };
        }
        setqsObjst(qsObj);
        setcurrentQ(qsObj[1]);
      })
      .catch((err) => {
        const errorObj = err?.response?.data;
        if (errorObj && showAlert) {
          message.error({ content: t(errorObj), duration: 1 });
        }
      });
  };
  useEffect(() => {
    if (!courseData) return;
    setCourseDataSt(courseData);
  }, [courseData]);
  const [showSurvey, setShowSurvey] = useState();
  useEffect(() => {
    if (isFinal === 'undefined') return;
    if (ID) {
      if (!isFinal) GetQs(false);
      LessonsService.GetScore(ID, isFinal)
        .then((scoreRes) => {
          let scoreData = [];
          // data e.g [{main:15.3,makeup:0.0}]
          for (let index = 0; index < scoreRes.data.length; index += 1) {
            scoreData.push(scoreRes.data[index]);
          }
          if (isFinal) {
            const copyData = scoreData;
            scoreData = scoreData.filter((item) => item.is_passed === undefined);
            const surveyCase = copyData.filter((item) => item.is_passed === true);
            if (surveyCase?.length > 0) {
              setShowSurvey(true);
            }
          }
          setquizScore(scoreData);
        })
        .catch((errScore) => {
          const errorScoreObj = errScore?.response?.data;
          if (errorScoreObj) {
            if (!isFinal) message.error({ content: t(errorScoreObj), duration: 1 });
          }
        })
        .finally(() => {
          setspinning(false);
        });
    }
  }, [isFinal]);
  const [quiz, setquiz] = useState();
  useEffect(() => {
    if (courseDataSt && !isFinal) {
      const courseLessons = courseDataSt.units;
      let AllLessons = [];
      for (let index = 0; index < courseLessons.length; index += 1) {
        AllLessons = AllLessons.concat(GetAllLessonsAndQs(courseLessons[index].lessons));
      }
      const QuizObj = AllLessons.filter((item) => item.id === ID)[0];
      setquiz(QuizObj);
    }
    if (isFinal && courseDataSt) {
      setquiz(courseDataSt.final_exam);
    }
  }, [courseDataSt, isFinal]);
  const [rerenderQ, setrerenderQ] = useState(true);
  // watching qs answers
  const [ansWatched, setansWatched] = useState();
  const [qsAnss, setQsAnss] = useState();
  const watchAns = (isMakeup) => {
    setspinning(true);
    LessonsService.GetAnss(ID, isMakeup)
      .then((res) => {
        setansWatched(true);
        setQsAnss(res.data);
      })
      .catch((err) => {
        const errorObj = err?.response?.data;
        if (errorObj) {
          message.error({ content: t(errorObj), duration: 1 });
        }
      })
      .finally(() => {
        setspinning(false);
      });
  };
  // survey
  const [surveyData, setSurveyData] = useState();
  const showSurveyFun = () => {
    if (!courseData || surveyData) return;
    LessonsService.GetSurvey(courseData.id).then((res) => {
      setSurveyData(res.data.questions_answers);
      console.log(res.data.questions_answers);
    });
  };
  const [openSurvey, setOpenSurvey] = useState(false);
  return (
    <div className="focusing-area quiz-area pdb_50">
      <Spin spinning={spinning} style={{ width: '100%', textAlign: 'center', marginTop: '15px' }}>
        {quiz && (
          <>
            <h2 className="pdt_28 pdb_33 fw_7 f_25">{quiz.quiz?.title || quiz.title}</h2>
            {/* quiz start  */}
            {!quizStarted || !qsObjSt ? ( // should but ! !
              <div className="flex_col">
                <p className="f_15 fw_6 mb_31" style={{ color: '#BBBBBB' }}>
                  {quiz.description}
                </p>
                <div className="wide flex_row_c">
                  {quizScore.length < 2 && !ansWatched && (
                    <button
                      type="button"
                      className="mcBg wc f_20 fw_5 startQuiz"
                      onClick={() => {
                        setspinning(true);
                        LessonsService.StartQuiz(ID, isFinal)
                          .then((res) => {
                            message.success({ content: t(res.data), duration: 1 });
                            setquizStarted(true);
                            GetQs(true);
                          })
                          .catch((err) => {
                            const errorObj = err?.response?.data;
                            if (errorObj) {
                              message.error({ content: t(errorObj), duration: 1 });
                              // try to show the score
                              LessonsService.GetScore(ID, isFinal)
                                .then((scoreRes) => {
                                  const scoreData = [];
                                  // data e.g [{main:15.3,makeup:0.0}]
                                  for (let index = 0; index < scoreRes.data.length; index += 1) {
                                    scoreData.push(scoreRes.data[index]);
                                  }

                                  setquizScore(scoreData);
                                })
                                .catch((errScore) => {
                                  const errorScoreObj = errScore?.response?.data;
                                  if (errorScoreObj) {
                                    message.error({ content: t(errorScoreObj), duration: 1 });
                                  }
                                });
                            }
                          })
                          .finally(() => {
                            setspinning(false);
                          });
                      }}
                    >
                      {quizScore.length === 0 ? 'ابدأ الاختبار' : quizScore.length === 1 ? 'اعادة الاختبار' : ''}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="qsTestCont mt_30 flex_col">
                {currentQ && rerenderQ && (
                  <>
                    <span className="mc f_20 fw_6 mb_35">سؤال رقم {currentQ.count}</span>
                    <Radio.Group
                      onChange={(e) => {
                        const chroma = { ...qsObjSt };
                        chroma[currentQ.count].answer = e.target.value;
                        setqsObjst(chroma);
                      }}
                      defaultValue={currentQ.answer}
                    >
                      <div className="flex_col qContent">
                        <h2 className="mc f_20 fw_7 mb_31">{currentQ.question.question}</h2>
                        {currentQ.question?.answers?.map((answer) => (
                          <Radio value={answer.id} className="answerItem" key={answer.id}>
                            <span className="ansText"> {answer.answer}</span>
                          </Radio>
                        ))}
                      </div>
                    </Radio.Group>
                    <div className="wide flex_btw mt_71  quizNavBtns">
                      {currentQ.count !== qsObjSt[Object(qsObjSt.keys).length] && (
                        <button
                          type="button"
                          className="mcBg wc f_20 fw_5 pdrl_30 pdtb_5 nav"
                          onClick={() => {
                            LessonsService.SubmitUpdateQuiz(
                              ID,
                              [{ question: currentQ.question.id, answer: currentQ.answer }],
                              isFinal
                            )
                              .then((res) => {
                                message.success({ content: t(res.data), duration: 1 });
                                setcurrentQ(qsObjSt[currentQ.count + 1]);
                                setrerenderQ(false);
                                setTimeout(() => {
                                  setrerenderQ(true);
                                }, 0);
                                // if this is the last question then get the result
                                if (currentQ.count === Object.keys(qsObjSt).length) {
                                  setgoNext(true);
                                  LessonsService.GetScore(ID, isFinal)
                                    .then((scoreRes) => {
                                      const scoreData = [];
                                      // data e.g [{main:15.3,makeup:0.0}]
                                      for (let index = 0; index < scoreRes.data.length; index += 1) {
                                        scoreData.push(scoreRes.data[index]);
                                      }

                                      setquizScore(scoreData);
                                      message.success({ content: t(res.data), duration: 1 });
                                    })
                                    .catch((err) => {
                                      const errorObj = err?.response?.data;
                                      if (errorObj) {
                                        message.error({ content: t(errorObj), duration: 1 });
                                      }
                                    });
                                }
                              })
                              .catch((err) => {
                                const errorObj = err?.response?.data;
                                if (errorObj) {
                                  message.error({ content: t(errorObj), duration: 1 });
                                }
                              });
                          }}
                        >
                          السؤال التالى
                        </button>
                      )}
                      {currentQ.count !== 1 && (
                        <button
                          type="button"
                          className="mcBg wc f_20 fw_5 pdrl_30 pdtb_5 nav"
                          onClick={() => {
                            setcurrentQ(qsObjSt[currentQ.count - 1]);
                            setrerenderQ(false);
                            setTimeout(() => {
                              setrerenderQ(true);
                            }, 0);
                          }}
                        >
                          السؤال السابق
                        </button>
                      )}

                      {!currentQ &&
                        quizScore.map((score) => (
                          <div className="qsTestCont mt_30 flex_col" key={Object.keys(score)}>
                            <span className="mc f_20 fw_6 mb_35">
                              {t(Object.keys(score))}
                              {score[Object.keys(score)]}
                            </span>
                          </div>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}
            <div className="qAnssCont">
              {qsAnss !== '0' &&
                qsAnss &&
                qsAnss?.map((q) => (
                  <div className={`${q.is_correct ? 'right' : 'wrong'} qItem pdb_20 mb_10`} key={q.question}>
                    <h3 className="fw_7 f_20 mc title">{q.question}</h3>
                    {q.is_correct ? (
                      <p className="green status mbt_10 f_16">{t('right answer')}</p>
                    ) : (
                      <p className="error status mbt_10 f_16">{t('wrong answer')}</p>
                    )}
                    {!q.is_correct && (
                      <div className="error ansCont wrong fw_6 f_18 flex_row align_center gap-10 mb_10">
                        <MdCancel /> {q.answer}
                      </div>
                    )}
                    <div className="green ansCont fw_6 f_18 flex_row align_center gap-10">
                      <AiFillCheckCircle /> {q.correct_answer[0]}
                    </div>
                  </div>
                ))}
            </div>

            {quizScore.length > 0 && (
              <div className="qsTestCont mt_30 flex_col">
                <span className="mc f_20 fw_6 mb_20">{t('The previous Results')}</span>
              </div>
            )}

            {quizScore.map(
              (score) =>
                String(Object.keys(score)) !== 'is_passed' && (
                  <div key={Object.keys(score)}>
                    <span className="mc f_20 fw_6 mb_30">
                      {t('exam')} {t(Object.keys(score))}: {score[Object.keys(score)]} %
                    </span>
                  </div>
                )
            )}
            {showSurvey && (
              <button
                type="button"
                className="mcBg wc f_20 fw_5 startQuiz mt_20"
                onClick={() => {
                  showSurveyFun();
                  setOpenSurvey((prev) => !prev);
                }}
              >
                {t('show_survey')}
              </button>
            )}

            <Survey
              data={surveyData}
              open={openSurvey}
              courseId={courseData?.id}
              setOpenSurvey={() => {
                setOpenSurvey(false);
              }}
            />

            {quizScore.length > 0 && !ansWatched && !isFinal && (
              <div className="mt_30 flex_col gap-10">
                <button
                  type="button"
                  className="mcBg wc f_20 fw_5 startQuiz"
                  onClick={() => {
                    if (quizScore.length === 2 && quizScore[1]?.makeup !== 0) {
                      watchAns(true);
                    } else {
                      watchAns();
                    }
                  }}
                >
                  {t('seeQsAnss')}
                </button>
                {quizScore.length < 2 && <p className="error f_16 fw_5">({t('qsAnssError')})</p>}
              </div>
            )}
          </>
        )}
      </Spin>
    </div>
  );
}

export default Quiz;
Quiz.Layout = FocusAreaLayout;
