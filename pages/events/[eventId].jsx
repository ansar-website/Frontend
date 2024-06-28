/* eslint-disable react/no-unescaped-entities */
import { Skeleton } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '../../components/Common/Context/Context';
import Countdown from '../../components/Common/count-down/count-down';
import RadiusHeader from '../../components/Common/radius-header/radius-header';
import ZoomMeeting from '../../components/Common/zoom-us/zoom-us';
import AuthHelpers from '../../helpers/auth/helpers';
import ClientLayout from '../../layouts/Client/ClientLayout';
import blogImage from '../../public/images/blog-inner.png';
import EventsService from '../../services/events/events';

function Blog() {
  const { t } = useTranslation();
  const [articleLoading, setArticleLoading] = useState(true);
  const router = useRouter();
  const { eventId } = router.query;
  // fetch blog data
  const [eventData, setEventData] = useState();
  const { UserData } = useContext(Context);
  useEffect(() => {
    if (eventId) {
      EventsService.GetSingleEvent(eventId).then((res) => {
        setEventData(res.data);
        setArticleLoading(false);
      });
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventData) return;
    document.querySelectorAll('iframe').forEach((iframe) => {
      const ifrmaeEl = iframe;
      ifrmaeEl.setAttribute('width', '100%');
      setTimeout(() => {
        ifrmaeEl.setAttribute('height', (ifrmaeEl.offsetWidth * 9) / 16);
      });
    });
  }, [eventData]);

  const payload = {
    meetingNumber: parseInt(eventData?.zoom_meeting_id, 10) || 0, // meeting number from zoom meeting sdk app
    userName: UserData?.user.email || 'Guest',
    userEmail: '',
    passWord: '',
    role: 0,
    sdkKey: eventData?.zoom_meeting_sdk_key || 0, // SDK key from zoom meeting sdk app = client id
    sdkSecret: eventData?.zoom_meeting_sdk_secret || 0, // SDK secret from zoom meeting sdk app = client secret
    leaveUrl: eventData?.zoom_meeting_leave_url || '', // leave url e.g. http://localhost:3000 when meeting ends
  };

  return (
    <div className="blog-page">
      {/* header */}
      <RadiusHeader titleText={eventData?.title || t('title_label')} innerImage />
      <div className="container">
        {articleLoading ? (
          <div className="skeltonCont blogImg">
            <Skeleton.Image style={{ height: '100%', width: '100%' }} active />
            <img src={blogImage} alt="blog" className="blogImg hiddenImg" />
          </div>
        ) : (
          <img src={eventData.image} alt="blog" className="blogImg" />
        )}
      </div>
      <article className="blogArticle mt_80">
        <div className="container">
          {articleLoading ? (
            <div className="flex gap-35">
              <div className="flex_col wide gap-40">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Skeleton avatar active paragraph={{ rows: 4 }} key={i * 2} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-35">
              <div className="articleBody flex_col wide">
                <section className="articleContianer flex gap-16" style={{ width: '100%' }}>
                  {/* articleContent */}
                  <div className="contentContainer wide">
                    <section className="conentSection">
                      {eventData.is_online_event && eventData.date > new Date().toISOString() ? (
                        <Countdown countdownDate={eventData.date} eventTitle={eventData.title} />
                      ) : new Date(eventData.date).setMinutes(
                          new Date(eventData.date).getMinutes() + eventData.event_duration_in_minutes
                        ) < new Date().getTime() ? (
                        <div className="meeting-end-hint">{t('online_event_has_been_ended')}</div>
                      ) : eventData.is_for_users_only ? (
                        !AuthHelpers.CheckAuth() ? (
                          <div className="meeting-login-hint">
                            <a href="#home-navbar">{t('login_now_to_attend_this_event')}</a>
                          </div>
                        ) : (
                          <div className="zoom-meeting">
                            <ZoomMeeting payload={payload} />
                          </div>
                        )
                      ) : (
                        <div className="zoom-meeting">
                          <ZoomMeeting payload={payload} />
                        </div>
                      )}

                      <p dangerouslySetInnerHTML={{ __html: eventData.content }} className="sectionBody" />
                    </section>
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
