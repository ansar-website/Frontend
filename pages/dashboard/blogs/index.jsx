import { Empty, Spin } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../../layouts/Dasboard/DashboardLayout';
import Subs from '../../../public/images/icons/subs.png';
import CoursesService from '../../../services/courses/courses';

export default function DashboardBlogs() {
  const { t } = useTranslation();
  const [loading, setloading] = useState(true);
  const [forums, setForums] = useState();
  useEffect(() => {
    CoursesService.GetUserBlogsForums().then((res) => {
      setForums(res.data);
      setloading(false);
    });
  }, []);
  return (
    <Spin spinning={loading}>
      <div className="flex gap-33 wrap blogs-page">
        {forums?.length > 0 ? (
          forums.map((forum) => (
            <Link href={`/dashboard/blogs/${forum.id}`}>
              <div className="blogItem flex_col pnt" key={`${forums.id}item`}>
                <img src={forum.cover_image} alt="blog" className="blogImg" />
                <img src={forum.feature_image} alt="blog" className="blogRect" />
                <div className="content flex_col wide">
                  <h2 className="f_13 fw_7 dtitle mb_25 center title wide">{forum.title}</h2>
                  <div className="subs flex gap-10">
                    <img src={Subs} alt="subs" />
                    <span className="f_10 fw_7 crdDark">
                      {forum.subscribers_count} {t('subscriper')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="flex_row_c hvh_70">
            <Empty description={t('no_registerd_courses')} />
          </div>
        )}
      </div>
    </Spin>
  );
}

DashboardBlogs.Layout = DashboardLayout;
