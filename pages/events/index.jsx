import { Pagination, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { HiOutlineListBullet } from 'react-icons/hi2';
import BlogItem from '../../components/blog-item/blog';
import RadiusHeader from '../../components/Common/radius-header/radius-header';
import ClientLayout from '../../layouts/Client/ClientLayout';
import Next from '../../public/images/icons/next-page.svg';
import Prev from '../../public/images/icons/prev-page.svg';
import EventsService from '../../services/events/events';

function HomeEvents() {
  // skelton
  const [loadingSkelton, setLoadingSkeleton] = useState(true);
  // fetch blogs and blogs states
  const [Blogs, setBlogs] = useState();
  const [BlogsCount, setBlogsCount] = useState();
  const ListEvents = (res) => {
    const blogs = res.data.results;
    setBlogs(blogs);
    setBlogsCount(res.data.count);
    setLoadingSkeleton(false);
  };
  useEffect(() => {
    EventsService.GetEvents().then((res) => {
      ListEvents(res);
    });
  }, []);
  // layout arrange
  const [layoutArrange, setlayoutArrange] = useState('blocks');
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
      <RadiusHeader titleText="events" pText="event_text" />
      {/* blogs body */}
      <section className="blogsBody mt_50">
        {/* blogs filter */}
        <div className="container">
          <nav className="blogsFilter dtitle flex_col">
            <div className="arrangeFilter flex_row gap-10">
              <button
                type="button"
                className={`arrangBtn arrangeItem flex_row_c  ${layoutArrange === 'blocks' ? 'activeArrange' : ''}`}
                onClick={() => {
                  setlayoutArrange('blocks');
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_86_434)">
                    <path
                      d="M7 0H4C2.93913 0 1.92172 0.421427 1.17157 1.17157C0.421427 1.92172 0 2.93913 0 4L0 7C0 8.06087 0.421427 9.07828 1.17157 9.82843C1.92172 10.5786 2.93913 11 4 11H7C8.06087 11 9.07828 10.5786 9.82843 9.82843C10.5786 9.07828 11 8.06087 11 7V4C11 2.93913 10.5786 1.92172 9.82843 1.17157C9.07828 0.421427 8.06087 0 7 0V0ZM9 7C9 7.53043 8.78929 8.03914 8.41421 8.41421C8.03914 8.78929 7.53043 9 7 9H4C3.46957 9 2.96086 8.78929 2.58579 8.41421C2.21071 8.03914 2 7.53043 2 7V4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7Z"
                      fill="#374957"
                    />
                    <path
                      d="M20 0H17C15.9391 0 14.9217 0.421428 14.1716 1.17157C13.4214 1.92172 13 2.93914 13 4V7C13 8.06087 13.4214 9.07829 14.1716 9.82843C14.9217 10.5786 15.9391 11 17 11H20C21.0609 11 22.0783 10.5786 22.8284 9.82843C23.5786 9.07829 24 8.06087 24 7V4C24 2.93914 23.5786 1.92172 22.8284 1.17157C22.0783 0.421428 21.0609 0 20 0V0ZM22 7C22 7.53044 21.7893 8.03915 21.4142 8.41422C21.0391 8.78929 20.5304 9.00001 20 9.00001H17C16.4696 9.00001 15.9609 8.78929 15.5858 8.41422C15.2107 8.03915 15 7.53044 15 7V4C15 3.46957 15.2107 2.96086 15.5858 2.58579C15.9609 2.21072 16.4696 2 17 2H20C20.5304 2 21.0391 2.21072 21.4142 2.58579C21.7893 2.96086 22 3.46957 22 4V7Z"
                      fill="#374957"
                    />
                    <path
                      d="M7 13H4C2.93913 13 1.92172 13.4214 1.17157 14.1716C0.421427 14.9217 0 15.9391 0 17L0 20C0 21.0609 0.421427 22.0783 1.17157 22.8284C1.92172 23.5786 2.93913 24 4 24H7C8.06087 24 9.07828 23.5786 9.82843 22.8284C10.5786 22.0783 11 21.0609 11 20V17C11 15.9391 10.5786 14.9217 9.82843 14.1716C9.07828 13.4214 8.06087 13 7 13ZM9 20C9 20.5304 8.78929 21.0392 8.41421 21.4142C8.03914 21.7893 7.53043 22 7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0392 2 20.5304 2 20V17C2 16.4696 2.21071 15.9609 2.58579 15.5858C2.96086 15.2107 3.46957 15 4 15H7C7.53043 15 8.03914 15.2107 8.41421 15.5858C8.78929 15.9609 9 16.4696 9 17V20Z"
                      fill="#374957"
                    />
                    <path
                      d="M20 13H17C15.9391 13 14.9217 13.4214 14.1716 14.1716C13.4214 14.9217 13 15.9391 13 17V20C13 21.0609 13.4214 22.0783 14.1716 22.8284C14.9217 23.5786 15.9391 24 17 24H20C21.0609 24 22.0783 23.5786 22.8284 22.8284C23.5786 22.0783 24 21.0609 24 20V17C24 15.9391 23.5786 14.9217 22.8284 14.1716C22.0783 13.4214 21.0609 13 20 13ZM22 20C22 20.5304 21.7893 21.0392 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H17C16.4696 22 15.9609 21.7893 15.5858 21.4142C15.2107 21.0392 15 20.5304 15 20V17C15 16.4696 15.2107 15.9609 15.5858 15.5858C15.9609 15.2107 16.4696 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20Z"
                      fill="#374957"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_86_434">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
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
          <div className={`blogsItems ${layoutArrange} flex gap-30 wrap mt_35`}>
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
              : Blogs.map((blogItem) => (
                  <BlogItem
                    key={blogItem.id}
                    id={blogItem.id}
                    img={blogItem.image}
                    date={blogItem.date}
                    title={blogItem.title}
                    desc={blogItem.description}
                    event
                  />
                ))}
          </div>
          {/* pagination */}
          {BlogsCount && (
            <div className="flex_row_c mbt_35 paginaion">
              <Pagination
                defaultCurrent={1}
                total={BlogsCount}
                itemRender={itemRender}
                className="flex paginaionDiv"
                showSizeChanger={false}
                pageSize={16}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
export default HomeEvents;

HomeEvents.Layout = ClientLayout;
