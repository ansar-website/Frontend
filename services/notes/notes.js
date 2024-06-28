import axios from 'axios';

const GetCourseNote = (id) => axios.get(`/lms/note/course/${id}/`);

const DeleteCourseNote = (id) => axios.delete(`/lms/note/${id}/`);

const UpdateNote = (id, Obj) => axios.put(`/lms/note/${id}/`, Obj);

const NotesServices = {
  GetCourseNote,
  DeleteCourseNote,
  UpdateNote,
};

export default NotesServices;
