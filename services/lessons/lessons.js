import axios from 'axios';

const GetLesson = (id) => axios.get(`/lms/lesson/${id}/`);

const PostFocusQ = (obj) => axios.post(`/lms/lesson/submit-focus-question/`, obj);

const PostFocusTime = (obj) => axios.post(`/lms/lesson/focus-time/`, obj);

// quiz

const StartQuiz = (id, isFinal) => axios.post(`/lms/${isFinal ? 'exam' : 'quiz'}/${id}/`);

const GetQuizQs = (id, isFinal) => axios.get(`/lms/${isFinal ? 'exam' : 'quiz'}/${id}/`);

const SubmitUpdateQuiz = (id, obj, isFinal) => axios.post(`/lms/${isFinal ? 'exam' : 'quiz'}/${id}/submit/`, obj);

const GetScore = (id, isFinal) => axios.get(`/lms/${isFinal ? 'exam' : 'quiz'}/${id}/score/`);

const GetAnss = (id, makeup) => axios.get(`/lms/quiz/${id}/result/${makeup ? '?is_makeup=1/' : ''}`);

const GetSurvey = (courseId) => axios.get(`/lms/course/${courseId}/survey/`);

const SubmitSurvey = (courseId, payload) => axios.post(`/lms/course/${courseId}/survey/submit/`, payload);

const LessonsService = {
  GetLesson,
  PostFocusQ,
  PostFocusTime,
  StartQuiz,
  GetQuizQs,
  SubmitUpdateQuiz,
  GetScore,
  GetAnss,
  GetSurvey,
  SubmitSurvey,
};

export default LessonsService;
