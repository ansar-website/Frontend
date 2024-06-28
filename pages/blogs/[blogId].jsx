/* eslint-disable react/no-unescaped-entities */
import { Skeleton, message } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineCopy, AiOutlineTwitter } from 'react-icons/ai';
import { BsWhatsapp } from 'react-icons/bs';
import { FaFacebookF, FaLinkedinIn } from 'react-icons/fa';
import { FacebookShareButton, LinkedinShareButton, TwitterShareButton, WhatsappShareButton } from 'react-share';
import RadiusHeader from '../../components/Common/radius-header/radius-header';
import BlogItem from '../../components/blog-item/blog';
import { formatDate } from '../../helpers/common/helpers';
import ClientLayout from '../../layouts/Client/ClientLayout';
import blogImage from '../../public/images/blog-inner.png';
import ArrowDown from '../../public/images/icons/fi-rr-angle-small-down.svg';
import BlogsService from '../../services/blogs/blogs';

function Blog() {
  const { t } = useTranslation();
  const [articleLoading, setArticleLoading] = useState(true);
  const router = useRouter();
  const { blogId } = router.query;
  const [shareUrl, setShareUrl] = useState();
  // fetch blog data
  const [blogData, setblogData] = useState();
  const [Blogs, setBlogs] = useState();
  useEffect(() => {
    if (blogId) {
      setArticleLoading(true);
      BlogsService.GetSingleBlog(blogId).then((res) => {
        setblogData(res.data);
        setArticleLoading(false);
      });
      BlogsService.GetBlogs().then((res) => {
        const blogs = res.data.results.slice(0, 3);
        setBlogs(blogs);
      });
      if (window) setShareUrl(window.location.href);
    }
  }, [blogId]);
  return (
    <div className="blog-page">
      {/* header */}
      <RadiusHeader titleText={blogData?.title || t('title_label')} innerImage />
      <div className="container flex">
        {articleLoading ? (
          <div className="skeltonCont blogImg">
            <Skeleton.Image style={{ height: '100%', width: '100%' }} active />
            <img src={blogImage} alt="blog" className="blogImg hiddenImg" />
          </div>
        ) : (
          <div className="blogImg">
            <img src={blogData.image} alt="blog" className="img" />
          </div>
        )}
      </div>
      <article className="blogArticle mt_80">
        <div className="container">
          {articleLoading ? (
            <div className="flex gap-35">
              <div className="hiddenSkelton">
                <Skeleton.Input active size style={{ width: '235px', height: '300px' }} />
              </div>

              <div className="flex_col wide gap-40">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Skeleton avatar active paragraph={{ rows: 4 }} key={i * 2} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-35 sectionsCont">
              <div>
                <div className="rightGuide">
                  <h3 className="f_18 fw_6 dtitle mb_16">{t('contetn_cirriculum')}</h3>
                  {blogData.blog_items?.map((tag) => (
                    <a type="button" href={`#${tag.id}`} className="guideLink">
                      {tag.title}
                    </a>
                  ))}
                </div>
              </div>

              <div className="articleBody flex_col">
                {/* article head */}
                <header className="articleHead flex_col gap-26 mb_37">
                  <div className="headDesc flex align_center gap-15">
                    <span className="time f_14 fw_4">
                      {blogData.reading_duration}
                      <span className="pdrl_2 pdr_4">{blogData.reading_duration_unit === 'min' && t('min_unit')}</span>
                      {t('reading')}
                    </span>
                    <span className="mc f_16 fw_6 topic">{blogData.title}</span>
                  </div>
                  <div className="flex align_center gap-10 blogpuplisher">
                    <img src={blogData.author.image} alt="puplisher" className="puplisher" />
                    <div className="flex_col">
                      <h4 className="pupName fw_7 f_17">{blogData.author.name}</h4>
                      <span className="fw_4 f_16 date">
                        {`${t('blog_time')} `}
                        {formatDate(blogData.create_date)}
                      </span>
                    </div>
                  </div>
                  {/* will be collapse not select */}
                </header>
                {/* article content */}
                <section className="articleContianer flex gap-16">
                  {/* social links */}
                  <ul className="socialLinks flex_col gap-17">
                    <li className="socialLink">
                      <LinkedinShareButton url={shareUrl} title={blogData?.title}>
                        <button className="shareBtn" type="button">
                          <FaLinkedinIn />
                        </button>
                      </LinkedinShareButton>
                    </li>
                    <li className="socialLink">
                      <TwitterShareButton url={shareUrl} title={blogData?.title}>
                        <button className="shareBtn" type="button">
                          <AiOutlineTwitter />
                        </button>
                      </TwitterShareButton>
                    </li>
                    <li className="socialLink">
                      <FacebookShareButton url={shareUrl} title={blogData?.title}>
                        <button className="shareBtn" type="button">
                          <FaFacebookF />
                        </button>
                      </FacebookShareButton>
                    </li>
                    <li className="socialLink">
                      <WhatsappShareButton url={shareUrl}>
                        <button className="shareBtn" type="button">
                          <BsWhatsapp />
                        </button>
                      </WhatsappShareButton>
                    </li>
                    <li className="socialLink">
                      <button
                        className="shareBtn"
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          message.success(t('copiedMsg'));
                        }}
                      >
                        <AiOutlineCopy />
                      </button>
                    </li>
                  </ul>
                  {/* articleContent */}
                  <div className="contentContainer">
                    {blogData.blog_items.map((section) => (
                      <section key={section.id} className="conentSection" id={section.id}>
                        <button
                          type="button"
                          width="220px"
                          className="arrangeSelect flex_btw align_center"
                          id={`arrangeSelect-${section.id}`}
                          onClick={() => {
                            document.getElementById(`sectionBody-${section.id}`).classList.toggle('closed');
                            document.getElementById(`arrangeSelect-${section.id}`).classList.toggle('rotated');
                          }}
                        >
                          <span className="f_15 fw_6 dc">{section.title}</span>
                          <img src={ArrowDown} alt="arrow" />
                        </button>
                        <h3 className="sectionTitle">{section.title}</h3>
                        <p
                          dangerouslySetInnerHTML={{ __html: section.content }}
                          className="sectionBody"
                          id={`sectionBody-${section.id}`}
                        />
                      </section>
                    ))}
                    <div className="blogsItems blocks flex gap-30 wrap mt_35">
                      {Blogs?.map((blogItem) => (
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
                  </div>
                </section>
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
export default Blog;
Blog.Layout = ClientLayout;
