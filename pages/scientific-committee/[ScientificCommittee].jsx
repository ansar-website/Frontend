import { Skeleton, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ClientLayout from '../../layouts/Client/ClientLayout';
import headBg from '../../public/images/footer.png';
import BlogsService from '../../services/blogs/blogs';

function ScientificCommittee() {
  const router = useRouter();
  const { ScientificCommittee: teacherID } = router.query;
  const [teacher, setteacher] = useState();
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
            <div className="flex headContent wc center container gap-50">
              <img src={teacher.image} alt={teacher.name} className="teacherImg" />
              <div className="flex_col gap-25 text">
                <h1 className="f_30 fw_7">{teacher.name}</h1>
                <h2 className="f_28 fw_7">{teacher.position}</h2>
              </div>
            </div>
          )}
        </header>
      </Spin>

      {/* teacher resume */}
      <article className="resume">
        <div className="container flex gap-50 pdt_180 resumeCont">
          <div className="resumeContent flex_col gap-40 wide">
            {teacher ? (
              teacher.author_items?.map((item) => (
                <div className="flex item gap-50">
                  <div>
                    <h2 className="f_22 fw_7 itemTitle">{item.title}</h2>
                  </div>
                  <p dangerouslySetInnerHTML={{ __html: item?.content }} />
                </div>
              ))
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
export default ScientificCommittee;
ScientificCommittee.Layout = ClientLayout;
