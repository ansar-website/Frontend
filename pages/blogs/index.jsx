import { Pagination, Radio, Select, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiOutlineListBullet } from 'react-icons/hi2';
import BlogItem from '../../components/blog-item/blog';
import ArrangeIcon from '../../components/Common/Icons/layout-arrange';
import RadiusHeader from '../../components/Common/radius-header/radius-header';
import ClientLayout from '../../layouts/Client/ClientLayout';
import Next from '../../public/images/icons/next-page.svg';
import Prev from '../../public/images/icons/prev-page.svg';
import BlogsService from '../../services/blogs/blogs';

function HomeBlogs() {
  const { t } = useTranslation();
  // skelton
  const [loadingSkelton, setLoadingSkeleton] = useState(true);
  // fetch blogs and blogs states
  const [Blogs, setBlogs] = useState();
  const [BlogsCount, setBlogsCount] = useState();
  const [pageSize, setPageSize] = useState();
  const [BlogsCats, setBlogsCats] = useState();
  const ListBlogs = (res) => {
    const blogs = res.data.results;
    setBlogs(blogs);
    setLoadingSkeleton(false);
    setBlogsCount(res.data.count);
    if (!pageSize) setPageSize(blogs.length);
  };

  const GetBlogs = (filter) => {
    BlogsService.GetBlogs(filter).then((res) => {
      ListBlogs(res);
      const blogs = res.data.results;
      const AllCats = [];
      blogs.map((blog) => blog.categories.map((cat) => AllCats.push(cat)));
      const uniqueCats = Array.from(new Set(AllCats.map((cat) => cat.id))).map((id) =>
        AllCats.find((a) => a.id === id)
      );
      setBlogsCats(uniqueCats);
    });
  };

  useEffect(() => {
    GetBlogs();
  }, []);
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
      <RadiusHeader titleText="blogs" pText="blogs_text" />
      {/* blogs body */}
      <section className="blogsBody mt_50">
        {/* blogs filter */}
        <div className="container">
          <nav className="blogsFilter dtitle flex_col">
            <h3 className="f_24 blogsFilterTitle">{t('filter_title')}</h3>
            {/* topics filter */}
            <Radio.Group
              onChange={changeTopicFilter}
              value={topicFilter}
              className="filterTopics mt_20 mb_24 flex_row gap-10 f_17 fw_6"
            >
              <Radio.Button
                className="filterBtn"
                value="all"
                onClick={() => {
                  setLoadingSkeleton(true);
                  BlogsService.GetBlogs().then((res) => {
                    ListBlogs(res);
                  });
                }}
              >
                <span className="btnText">{t('all_topics')}</span>
              </Radio.Button>

              {BlogsCats?.map((topic) => (
                <Radio.Button
                  className="filterBtn"
                  value={topic}
                  key={topic.id}
                  onClick={() => {
                    setLoadingSkeleton(true);
                    BlogsService.GetBlogs(`?categories=${topic.id}`).then((res) => {
                      ListBlogs(res);
                    });
                  }}
                >
                  <span className="btnText">{topic.title}</span>
                </Radio.Button>
              ))}
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
                    topic={blogItem.categories[0].title}
                    date={blogItem.reading_duration}
                    title={blogItem.title}
                    desc={blogItem.description}
                    blogPuplisherImg={blogItem.author.image} //
                    puplisherName={blogItem.author.name}
                    puplishDate={blogItem.create_date}
                    durationUnit={blogItem.reading_duration_unit}
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
export default HomeBlogs;

HomeBlogs.Layout = ClientLayout;
