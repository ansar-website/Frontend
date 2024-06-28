import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { formatDate } from '../../helpers/common/helpers';

function Course({
  id,
  img,
  date,
  topic,
  title,
  desc,
  blogPuplisherImg,
  puplisherName,
  puplishDate,
  durationUnit,
  homeBlog,
  event,
}) {
  const { t } = useTranslation();

  return (
    <div className={`flex_col blogItem ${homeBlog ? ' homeBlog' : null}`}>
      <div className="blogImage">
        <Link href={event ? `/events/${id}` : `/blogs/${id}`}>
          <img src={img} alt="blog" className="image" />
        </Link>
      </div>
      <div className="blogContent">
        <div className="headDesc flex align_center gap-10">
          {topic && <span className="mc f_16 fw_6">{topic}</span>}
          <span className="time f_14 fw_4">
            {event ? (
              <span>{formatDate(date)}</span>
            ) : (
              <>
                {date}
                <span className="pdrl_2 pdr_4">{durationUnit === 'min' && t('min_unit')}</span>
                {t('reading')}
              </>
            )}
          </span>
        </div>
        <h3 className="fw_7 f_20 blogTitle">{title}</h3>
        <p className="blogText dtitle f_16 fw_400">{desc}</p>
        {!event && (
          <div className="flex align_center gap-10 blogFooter">
            <img src={blogPuplisherImg} alt="puplisher" className="puplisher" />
            <div className="flex_col">
              <h4 className="pupName fw_7 f_17">{puplisherName}</h4>
              <span className="fw_4 f_16 date">
                {`${t('blog_time')} `}
                <span className="pdrl_3">{formatDate(puplishDate)}</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Course;
