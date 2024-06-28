import { Pagination, Skeleton } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import RadiusHeader from '../../components/Common/radius-header/radius-header';
import ClientLayout from '../../layouts/Client/ClientLayout';
import Next from '../../public/images/icons/next-page.svg';
import Prev from '../../public/images/icons/prev-page.svg';
import BlogsService from '../../services/blogs/blogs';

function Teachers() {
  // skelton
  const [loadingSkelton, setLoadingSkeleton] = useState(true);
  // fetch blogs and blogs states
  const [Blogs, setBlogs] = useState();
  const [BlogsCount, setBlogsCount] = useState();
  const [pageSize, setPageSize] = useState();
  const ListBlogs = (res) => {
    const blogs = res.data.results;
    setBlogs(blogs);
    setLoadingSkeleton(false);
    setBlogsCount(res.data.count);
    if (!pageSize) setPageSize(blogs.length);
  };

  const GetBlogs = (filter) => {
    BlogsService.GetResumes(filter).then((res) => {
      ListBlogs(res);
    });
  };

  useEffect(() => {
    GetBlogs();
  }, []);
  // layout arrange
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
    <div className="cards-page pdb_50">
      {/* header */}
      <RadiusHeader titleText="teachers_title" pText="resumes_text" />
      {/* blogs body */}
      <section className="blogsBody mt_50">
        {/* blogs filter */}
        <div className="container">
          {/* blogs body */}
          <br />
          <div className="blogsItems wide flex justify_center gap-40 wrap mt_30 mb_60">
            {loadingSkelton
              ? Array.from({ length: 4 }).map((_, i) => (
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
              : Blogs.map((teacher) => (
                  <Link href={`teachers/${teacher.id}`}>
                    <div className="teacherItem flex_col_c" key={`${teacher.name}`}>
                      <img src={teacher.image} alt="teacher" className="avatar mb_30" />
                      <h4 className="f_25 fw_7 name">{teacher.name}</h4>
                      <span className="f_18 f_4 name pdt_5">{teacher.position}</span>
                    </div>
                  </Link>
                ))}
          </div>
          {/* pagination */}
          {BlogsCount > 4 && (
            <div className="flex_row_c mbt_35 paginaion">
              <Pagination
                defaultCurrent={1}
                total={BlogsCount}
                itemRender={itemRender}
                className="flex paginaionDiv"
                showSizeChanger={false}
                pageSize={pageSize}
                onChange={(e) => {
                  setLoadingSkeleton(true);
                  GetBlogs(`?page=${e}`);
                }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
export default Teachers;

Teachers.Layout = ClientLayout;
