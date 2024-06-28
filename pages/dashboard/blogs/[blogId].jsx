// import { useTranslation } from 'react-i18next';
import { Empty, Input, message, Modal, Spin, Upload } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import DashboardLayout from '../../../layouts/Dasboard/DashboardLayout';
import ImageUpload from '../../../public/images/icons/fi-rr-picture.svg';
import User from '../../../public/images/user.png';
import CoursesService from '../../../services/courses/courses';

const { TextArea } = Input;

export default function DashboardInnerBlog() {
  const { t } = useTranslation();
  const router = useRouter();
  const { blogId } = router.query;
  // upload
  const [UploadFile, setUploadFile] = useState('img');
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (UploadFile === 'img') {
      if (!isJpgOrPng) {
        message.error(t('is not a image file'));
      }
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(t('Image must smaller than 2MB!'));
    }
    if (UploadFile === 'img') {
      return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
    }
    return isLt2M || Upload.LIST_IGNORE;
  };
  const [imagesList, setimagesList] = useState();
  const onChangeUpload = (info) => {
    setimagesList(info.fileList);
  };
  // active like
  useEffect(() => {
    const likeBtns = document.querySelectorAll('.like');
    likeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('liked');
      });
    });
  }, []); // need to be updated
  // events
  const [openEventModal, setOpenEventModal] = useState(false);
  // get forum data
  const [forumPosts, setforumPosts] = useState();
  const [formTitle, setforumTitle] = useState();
  const [loading, setloading] = useState();
  useEffect(() => {
    if (blogId) {
      CoursesService.GetUserSingleForum(blogId).then((res) => {
        const { data } = res;
        setforumPosts(data.forum_post);
        setforumTitle(data.title);
        setloading(false);
      });
    }
  }, [blogId]);
  // post a Q
  const [postText, setpostText] = useState();
  const [postLoading, setpostLoading] = useState(false);
  const postQ = () => {
    let formData = {};
    if (imagesList?.length > 0) {
      formData = new FormData();
      for (let index = 0; index < imagesList.length; index += 1) {
        formData.append('image', imagesList[index].originFileObj);
      }
      formData.append('question', postText);
    } else {
      formData = {
        question: postText,
      };
    }

    setpostLoading(true);
    CoursesService.PostForum(blogId, formData)
      .then(() => {
        message.success({ content: t('successfully added'), duration: 4 });
      })
      .catch((err) => {
        const errorObj = err?.response?.data;
        if (errorObj) {
          message.error({ content: t(errorObj), duration: 4 });
        }
      })
      .finally(() => {
        setpostLoading(false);
        setpostText('');
      });
  };
  return (
    <div className="flex_col gap-23 wrap blog-inner-page">
      {/* share a q */}
      <div className="wide">
        <Spin spinning={postLoading}>
          {formTitle && <h2 className="mc f_16 fw_7 mb_35 wide center">{formTitle}</h2>}
          <section className="shareQ grayBlock flex_col gap-22 wide">
            <div className="textAreaCont flex wide">
              <img src={User} alt="user" className="avatar" />
              <TextArea
                className="textArea"
                placeholder={t('share_your_q')}
                value={postText}
                onChange={(e) => {
                  setpostText(e.target.value);
                }}
              />
            </div>
            <div className="upload flex_btw wide align_center">
              <Upload beforeUpload={beforeUpload} onChange={onChangeUpload}>
                <div className="flex gap-18">
                  <button type="button" onClick={() => setUploadFile('img')}>
                    <img src={ImageUpload} alt="ImageUpload" />
                  </button>
                </div>
              </Upload>
              <button type="button" className="submit wc f_16 bold" onClick={postQ}>
                {t('send')}
              </button>
            </div>
          </section>
        </Spin>
      </div>

      {/* Q and an */}
      <div className="wide">
        <Spin spinning={loading}>
          {forumPosts ? (
            forumPosts.map((post) => (
              <section className="qAndAn grayBlock wide flex_col gap-20 mb_23" key={`${post.id}key`}>
                <div className="comment flex_col wide">
                  <div className="flex align_center gap-20">
                    <img src={post.question_by_image || User} alt="user" className="avatar" />
                    <span className="userName f_16 fw_6 mc"> {post.question_by}</span>
                  </div>
                  <p className="commentBody fw_5 mc f_16 mt_13">{post.question}</p>
                </div>
                {post.answer ? (
                  <div className="comment flex_col wide">
                    <div className="flex align_center gap-20">
                      <img src={post.answer_by_image || User} alt="user" className="avatar" />
                      <span className="userName f_16 fw_6 mc">
                        {' '}
                        {post.answer_by?.length > 2 ? post.answer_by : 'اسم الشيخ'}
                      </span>
                    </div>
                    <p className="commentBody fw_5 mc f_16 mt_13" dangerouslySetInnerHTML={{ __html: post.answer }} />
                  </div>
                ) : (
                  <div className="comment flex_col wide">
                    <p className="commentBody fw_5 mc f_16 mt_13">{t('no_awnser')}</p>
                  </div>
                )}
              </section>
            ))
          ) : (
            <div className="flex_row_c wide">
              <Empty description={t('no_posts_forthis_forum')} />
            </div>
          )}
        </Spin>
      </div>
      {/* event modal */}
      <Modal
        title={t('event_info')}
        open={openEventModal}
        onCancel={() => {
          setOpenEventModal(false);
        }}
        width={787}
        centered
        closeIcon={<AiOutlineCloseCircle />}
        maskStyle={{ background: 'rgba(255, 255, 255, 0.81)' }}
        wrapClassName="customWcModal noFooter"
      >
        <div className="modaleventInfo flex_col">
          <div className="infoItem flex gap-120 pdrl_43 pdtb_18">
            <span className="infoTitle">{t('date_and_time')}</span>
            <span className="infoVal">28 نوفمبر 2022 الساعة 7:00 مساءً (اسطنبول)</span>
          </div>
          <div className="infoItem flex gap-120 pdrl_43 pdtb_18">
            <span className="infoTitle">{t('event_id')}</span>
            <span className="infoVal">1234567890987</span>
          </div>
          <div className="infoItem flex gap-120 pdrl_43 pdtb_18">
            <span className="infoTitle">{t('event_name')}</span>
            <span className="infoVal">محاضرة عن بنتنبابيههبتهبين</span>
          </div>
          <div className="infoItem flex gap-120 pdrl_43 pdtb_18">
            <span className="infoTitle">{t('period')}</span>
            <span className="infoVal">30 دقيقة</span>
          </div>
          <div className="infoItem flex gap-120 pdrl_43 pdtb_18 password">
            <span className="infoTitle">{t('event_password')}</span>
            <span className="infoVal flex_grow">
              <Input.Password value="dsfdsfsdfsfsfd dsfdsfsdfsfsfd" className="password" />
            </span>
          </div>
          <div className="infoItem flex gap-120 pdrl_43 pdtb_18">
            <span className="infoTitle">{t('register_link')}</span>
            <span className="infoVal">
              http://example.com/beds/account.php?bear=bottl /example.com/beds/account.php?bear=bottle
            </span>
          </div>
          <div className="infoItem flex gap-120 pdrl_43 pdtb_18">
            <span className="infoTitle">{t('event_link')}</span>
            <span className="infoVal">
              http://example.com/beds/account.php?bear=bottl /example.com/beds/account.php?bear=bottle
            </span>
          </div>
          <div className="infoItem flex gap-120 pdrl_43 pdtb_18 list">
            <span className="infoTitle">{t('notes')}</span>
            <span className="infoVal">
              <ul className="flex_col gap-5">
                <li>فعيل الانضمام قبل المضيف</li>
                <li> كتم صوت المشاركين عند الدخول</li>
                <li> تفعيل غرفة الانتظار يمكن فقط للمستخدمين </li>
                <li>غير مسموح بتسجيل الاجتماع</li>
                <li> كتم صوت المشاركين عند الدخول</li>
              </ul>
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

DashboardInnerBlog.Layout = DashboardLayout;
