import { Empty, Spin } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../../layouts/Dasboard/DashboardLayout';
import Note from '../../../public/images/icons/note.svg';
import CoursesService from '../../../services/courses/courses';

export default function DashboardBlogs() {
  const { t } = useTranslation();
  // fetch notes data
  const [loading, setloading] = useState(true);
  const [coureses, setcoureses] = useState();
  useEffect(() => {
    CoursesService.GetUserCourses().then((res) => {
      setcoureses(res.data.results);
      setloading(false);
    });
  }, []);

  return (
    <Spin spinning={loading}>
      <div className="flex gap-33 wrap blogs-page">
        {coureses?.length > 0 ? (
          coureses.map((courese) => (
            <Link href={`/dashboard/notes/${courese.id}`}>
              <div className="blogItem flex_col pnt" key={`${courese.id}item`}>
                <img src={courese.feature_image} alt="blog" className="blogImg" />
                <img src={courese.feature_image} alt="blog" className="blogRect" />
                <div className="content flex_col wide">
                  <h2 className="f_13 fw_7 dtitle mb_25 center title wide">{courese.title}</h2>
                  <div className="subs flex gap-10">
                    <img src={Note} alt="note" />
                    <span className="f_10 fw_7 crdDark mt_3 mr_2">
                      {courese.notes_count} {t('note_ind')}
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
