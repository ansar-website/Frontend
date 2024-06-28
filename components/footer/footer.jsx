import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { AiOutlineTwitter } from 'react-icons/ai';
import { FaTelegramPlane } from 'react-icons/fa';
import { GrFacebookOption } from 'react-icons/gr';
import whLogo from '../../public/images/white-logo.png';

function Footer({ genInfo }) {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container flex_btw align_start">
        <div className="flex_col_c logoCont">
          <img src={whLogo} alt="logo" />
          <div className="socialLinks flex_row_c gap-24 mt_10">
            <a href={genInfo?.contact_twitter} target="_blank" rel="noreferrer">
              <AiOutlineTwitter />
            </a>
            <a href={genInfo?.genInfo?.contact_twitter} target="_blank" rel="noreferrer">
              <FaTelegramPlane />
            </a>
            <a href={genInfo?.contact_facebook} target="_blank" rel="noreferrer">
              <GrFacebookOption />
            </a>
          </div>
        </div>
        <div className="flex_btw align_start linksCont">
          <ul className="links flex_col">
            <span className="head">{t('site')}</span>
            <Link href="/">
              <li>{t('home')}</li>
            </Link>
            <Link href="/teachers">
              <li>{t('teachers_title')}</li>
            </Link>
            <Link href="/courses">
              <li>{t('courses')}</li>
            </Link>
            <Link href="/contact">
              <li>{t('contact')}</li>
            </Link>
            <Link href="/terms-conditions">
              <li>{t('terms conditions')}</li>
            </Link>
          </ul>
          <ul className="links flex_col">
            <span className="head">{t('academy')}</span>
            <Link href="/about">
              <li>{t('about')}</li>
            </Link>
            <Link href="/scientific-committee">
              <li>{t('scientific_committee')}</li>
            </Link>
            <Link href="/blogs">
              <li>{t('blogs')}</li>
            </Link>
            <Link href="/events">
              <li>{t('events')}</li>
            </Link>
            <Link href="/privacy-policy">
              <li>{t('privacy policy')}</li>
            </Link>
          </ul>
        </div>
        <div className="subscribe flex_col">
          <h2 className="f_22 fw_4 wc mb_43 head">اشترك في القائمة البريدية</h2>
          <div className="flex_row_c inputCont">
            <input type="email" placeholder="البريد الاليكترونى " />
            <button className="mcBg wc flex_row_c" type="button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12.8477 13.5506L9.02682 9.8062L12.8477 6.06179L11.6685 4.9062L6.66849 9.8062L11.6685 14.7062L12.8477 13.5506Z"
                  fill="white"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
