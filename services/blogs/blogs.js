import axios from 'axios';

const GetBlogs = (filter) => axios.get(`/blog/blog/${filter || ''}`);

const GetSingleBlog = (id) => axios.get(`/blog/blog/${id}/`);

const GetResumes = (filter) => axios.get(`/blog/teachers/${filter || ''}`);

const GetCommittee = (filter) => axios.get(`/blog/scientific-committee/${filter || ''}`);

const SingleTeacher = (id) => axios.get(`/blog/teachers/${id}/`);

const BlogsService = {
  GetBlogs,
  GetSingleBlog,
  GetResumes,
  GetCommittee,
  SingleTeacher,
};
export default BlogsService;
