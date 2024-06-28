import axios from 'axios';

const GetCourses = (filter) => axios.get(`/lms/course/${filter || ''}`);

const GetSingleCourse = (id) => axios.get(`/lms/course/${id}/`);

const GetSingleCourseRates = (link) => axios.get(`${link}`);

const EnrollCourse = (id) => axios.post(`/lms/course/${id}/enroll/`);

const AddCourseRate = (id, rateObj) => axios.post(`/lms/course/${id}/rate/`, rateObj);

// user courses
const GetUserCourses = () => axios.get('/lms/course/my/');

// course blogs
const GetUserBlogsForums = () => axios.get('/lms/forum/my/');

const GetUserSingleForum = (id) => axios.get(`/lms/forum/${id}`);

const PostForum = (id, postObj) => axios.post(`/lms/forum/${id}/post/`, postObj);

// notes
const PostNote = (noteObj) => axios.post(`/lms/note/`, noteObj);

const CoursesService = {
  GetCourses,
  GetSingleCourse,
  GetSingleCourseRates,
  EnrollCourse,
  AddCourseRate,
  GetUserCourses,
  GetUserBlogsForums,
  GetUserSingleForum,
  PostForum,
  PostNote,
};

export default CoursesService;
