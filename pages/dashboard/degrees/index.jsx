import { Document, Font, Image, Page, PDFDownloadLink, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Spin, message } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../../../layouts/Dasboard/DashboardLayout';
import Bg from '../../../public/images/certificate.png';
import Degree from '../../../public/images/icons/degree.png';
import Download from '../../../public/images/icons/download.png';
import DegreesService from '../../../services/degrees/degrees';

export default function DashboardDegrees() {
  const { t } = useTranslation();
  const router = useRouter();

  // Import PDF Arabic font from CDN
  Font.register({
    family: 'Cairo',
    src: 'https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hAc5W1ToLQ-HmkA.ttf',
  });

  // PDF document styles
  const styles = StyleSheet.create({
    body: {
      paddingBottom: 65,
      paddingTop: 180,
      textAlign: 'center',
    },
    bg: {
      height: '600px',
      width: '842px',
      position: 'absolute',
      top: '0px',
      right: '0px',
      left: '0px',
      bottom: '0px',
    },
    textView: {
      display: 'flex',
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      width: '600px',
      textAlign: 'center',
      fontWeight: 1000,
      paddingLeft: '30px',
      justifyContent: 'center',
      paddingBottom: '20px',
    },
    ml1: {
      marginLeft: '3.2pt',
      fontFamily: 'Cairo',
      fontSize: 22,
    },
    sloganWord: {
      fontSize: 20,
    },
    mainColor: {
      color: '#007A8C',
    },
    secondColor: {
      color: '#72BA6F',
    },
  });

  // Text format function
  const formatText = (text) => {
    const splitedText = text.replace(/(\r\n|\n|\r)/gm, '.').split(' ');
    return splitedText;
  };

  // fetch degrees
  const [spin, setSpin] = useState(true);
  const [degrees, setDegrees] = useState();
  useEffect(() => {
    DegreesService.GetDegrees().then((res) => {
      setDegrees(res.data);
      setSpin(false);
    });
  }, []);

  const [currentDegree, setDegree] = useState();
  const [allowDownload, setAllowDownload] = useState(false);
  const [rerender, setRerender] = useState(true);

  const fetchDegree = (id, courseId) => {
    setSpin(true);
    DegreesService.GetDegree(id)
      .then((res) => {
        setDegree(res.data);
        setAllowDownload(true);
        setTimeout(() => {
          document.querySelectorAll(`.download-${id}`)[0].closest('a').click();
          setAllowDownload(false);
          setRerender(false);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }, 1000);
      })
      .catch((err) => {
        const errorObj = err?.response?.data;
        if (errorObj) {
          message.error({ content: t(errorObj), duration: 4 });
          const scrollToElement = (elementId, maxAttempts = 10) => {
            if (maxAttempts === 0) return; // Stop after a certain number of attempts

            const element = document.getElementById(elementId);
            if (element) {
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
              });
            } else {
              setTimeout(() => {
                scrollToElement(elementId, maxAttempts - 1);
              }, 1000); // Check every second
            }
          };

          router.push(`/course-details/${courseId}`).then(() => {
            scrollToElement('final-exam');
          });
        }
      })
      .finally(() => {
        setSpin(false);
      });
  };
  // Notes PDF document JSX
  const Quixote = () => (
    <Document>
      <Page size={{ height: 600, width: 842 }} style={styles.body}>
        <Image src={Bg} style={styles.bg} fixed />
        <>
          <View style={{ ...styles.textView }}>
            {formatText('تشهد اكاديمية أنصار النبي ان الطالب/ ').map((word) => (
              <Text style={{ ...styles.ml1, ...styles.mainColor }} key={word}>
                {word}
              </Text>
            ))}
            {formatText(currentDegree.student).map((word) => (
              <Text style={{ ...styles.ml1, ...styles.secondColor }} key={word}>
                {word}
              </Text>
            ))}
          </View>
        </>
        <>
          <View style={{ ...styles.textView }}>
            {formatText('قد اجتاز دورة / ').map((word) => (
              <Text style={{ ...styles.ml1, ...styles.mainColor }} key={word}>
                {word}
              </Text>
            ))}
            {formatText(currentDegree?.course_title).map((word) => (
              <Text style={{ ...styles.ml1, ...styles.secondColor }} key={word}>
                {word}
              </Text>
            ))}
            {formatText('بنجاح وحصل على').map((word) => (
              <Text style={{ ...styles.ml1, ...styles.mainColor }} key={word}>
                {word}
              </Text>
            ))}
            {formatText(`${String(currentDegree?.score)} %`).map((word) => (
              <Text style={{ ...styles.ml1, ...styles.secondColor }} key={word}>
                {word}
              </Text>
            ))}
          </View>
        </>
        <>
          <View style={{ ...styles.textView }}>
            {formatText('نسال الله ان ينفعه بهذا العلم و ان يستعملة   فى نصرة الاسلام').map((word) => (
              <Text style={{ ...styles.ml1, ...styles.mainColor, ...styles.sloganWord }} key={word}>
                {word}
              </Text>
            ))}
            {formatText('ونبي الاسلام').map((word) => (
              <Text style={{ ...styles.ml1, ...styles.mainColor, ...styles.sloganWord }} key={word}>
                {word}
              </Text>
            ))}
          </View>
        </>
      </Page>
    </Document>
  );

  return (
    <Spin spinning={spin}>
      <div className="flex gap-28 wrap degrees-page">
        {rerender &&
          degrees?.map((degree) => (
            <div className="degreeItem flex_col_c" key={degree.id}>
              <img src={Degree} alt="degree" />
              <span className="f_13 fw_7 mt_25 mb_20 degreeIn">{t('degree_in')}</span>
              <h2 className="f_13 fw_7 dtitle mb_18 title">{degree.course_title}</h2>

              {allowDownload ? (
                <PDFDownloadLink document={allowDownload ? <Quixote /> : null} fileName={`${degree.course_title}.pdf`}>
                  <img src={Download} alt="download" className={`pnt download-${degree.id}`} />
                </PDFDownloadLink>
              ) : (
                <button type="button" onClick={() => fetchDegree(degree.id, degree.course)}>
                  <img src={Download} alt="download" className="pnt" />
                </button>
              )}
            </div>
          ))}
        {rerender && degrees?.length === 0 && (
          <div className="flex_col_c" style={{ marginTop: '100px' }}>
            <span className="f_18 fw_7 mb_20">{t('no_degrees')}</span>
            <br />
            <span className="f_18 fw_7 mb_20">{t('no_degrees_hint')}</span>
          </div>
        )}
      </div>
    </Spin>
  );
}

DashboardDegrees.Layout = DashboardLayout;
