import { Empty, Skeleton, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ClientLayout from '../../layouts/Client/ClientLayout';
import headBg from '../../public/images/teacher-header.png';
import BlogsService from '../../services/blogs/blogs';

function Teacher() {
  const router = useRouter();
  const { teacher: teacherID } = router.query;
  const [teacher, setteacher] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    if (teacherID)
      BlogsService.SingleTeacher(teacherID).then((res) => {
        setteacher(res.data);
      });
  }, [teacherID]);
  return (
    <main className="inner-teacher">
      <Spin spinning={!teacher}>
        <header className="header flex">
          <img src={headBg} alt="head-bg" className="headBg" />
          {teacher && (
            <div className="flex headContent wc center container gap-111">
              <img src={teacher.image} alt={teacher.name} className="teacherImg" />
              <div className="flex_col gap-20 text">
                <h1 className="f_45 fw_7">{teacher.name}</h1>
                <h2 className="f_43 fw_7">{teacher.position}</h2>
              </div>
            </div>
          )}
        </header>
      </Spin>

      {/* teacher resume */}
      <article className="resume">
        <div className="container flex gap-50 pdt_130 resumeCont">
          <div className="resumeContent flex_col gap-40 wide">
            {teacher ? (
              teacher.author_items?.length > 0 ? (
                teacher.author_items?.map(
                  (item) =>
                    item?.content && (
                      <div className="flex item gap-5">
                        <div>
                          <h2 className="f_25 fw_7 dc itemTitle">{item.title}</h2>
                        </div>
                        <p dangerouslySetInnerHTML={{ __html: item?.content }} />
                      </div>
                    )
                )
              ) : (
                <div className="flex_row_c wide">
                  <Empty description={t('no_data')} />
                </div>
              )
            ) : (
              <div className="flex_col wide gap-40">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <Skeleton avatar active paragraph={{ rows: 4 }} key={i * 2} />
                ))}
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
export default Teacher;
Teacher.Layout = ClientLayout;
