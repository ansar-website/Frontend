import { Modal } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import SkeltonImg from '../../public/images/skelton-img.png';

function Course({ src }) {
  const { t } = useTranslation();
  const [OpenQModal, setOpenQModal] = useState(false);
  const [Teachers, setCoursTeachers] = useState();

  useEffect(() => {
    if (src.teachers) {
      setCoursTeachers([...src.teachers]);
    }
  }, [src.teachers]);
  return (
    <div className="flex_col blogItem course">
      <div className="blogImage">
        {src.is_coming_soon ? (
          <button
            onClick={() => {
              setOpenQModal(true);
            }}
            type="button"
          >
            <img src={src.feature_image || SkeltonImg} alt="blog" className="image pnt" />
          </button>
        ) : (
          <Link href={`/course-details/${src.id}`}>
            <img src={src.feature_image || SkeltonImg} alt="blog" className="image pnt" />{' '}
          </Link>
        )}
      </div>
      <div className="blogContent">
        {src.lessons_count !== 0 && (
          <div className="headDesc flex align_center gap-10">
            <span className="time f_14 fw_4">
              {src.lessons_count} {t('lesson')}
            </span>
            <span className="time f_14 fw_4">
              {src.enrolled_count} {t('subscriber')}
            </span>
          </div>
        )}
        <h3 className="fw_7 f_20 blogTitle">{src.title}</h3>
        <p className="blogText dtitle f_16 fw_400">{src.short_description}</p>
        <div className="flex_btw align_center blogFooterCont">
          <div className="flex align_center gap-10 blogFooter">
            <div className="imgs flex_row_c">
              {Teachers?.reverse().map((teacher) => (
                <img src={teacher.image} alt="puplisher" className="puplisher" />
              ))}
            </div>
            {/* <img src={src.teachers[0]?.image} alt="puplisher" className="puplisher" /> */}

            <div className="flex_col" style={{ marginRight: '25px' }}>
              <h4 className="pupName fw_7 f_17">
                {src.teachers[0].name}
                {src.teachers.length > 1 && (
                  <span className="pdrl_5 underline others">
                    + {src.teachers.length - 1}
                    {t('others')}
                  </span>
                )}
              </h4>
            </div>
          </div>
          {src.price && src.price !== 0 ? <span className="fw_7 f_17 price">{src.price} $</span> : null}
        </div>
      </div>
      {src.is_coming_soon && (
        <Modal
          title={src.title}
          open={OpenQModal}
          centered
          closeIcon={<AiOutlineCloseCircle />}
          maskStyle={{ background: 'rgba(255, 255, 255, 0.81)' }}
          wrapClassName="customWcModal noFooter waitingModal"
          onCancel={() => {
            setOpenQModal(false);
          }}
        >
          <p className="pdrl_20 fw_6 f_25 center">{src.coming_soon_text || t('coming_soon_cours')}</p>
        </Modal>
      )}
    </div>
  );
}

export default Course;
