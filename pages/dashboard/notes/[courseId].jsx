import { Document, Font, Image, Page, PDFDownloadLink, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import { Button, Empty, Input, message, Modal, Popconfirm, Spin } from 'antd';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { BsFillTrashFill } from 'react-icons/bs';
import { MdModeEditOutline } from 'react-icons/md';
import DashboardLayout from '../../../layouts/Dasboard/DashboardLayout';
import PdfFooter from '../../../public/images/pdf-footer.jpg';
import PdfHeader from '../../../public/images/pdf-header.png';
import NotesServices from '../../../services/notes/notes';

const { TextArea } = Input;
function DashboardNotes() {
  const { t } = useTranslation();
  const router = useRouter();
  const { courseId } = router.query;
  const [firstColumnArr, setfirstColumnArr] = useState();
  const [secColumnArr, setsecColumnArr] = useState();
  const [AllNotes, setAllNotes] = useState();
  useEffect(() => {
    if (courseId) {
      NotesServices.GetCourseNote(courseId).then((res) => {
        const results = res.data;
        setAllNotes(results);
        const notesObj = {};
        for (let index = 0; index < results.length; index += 1) {
          if (!notesObj[results[index].lesson])
            notesObj[results[index].lesson] = {
              notes: [],
              lessonId: results[index].lesson,
              lessonName: results[index].lesson_title,
            };
          notesObj[results[index].lesson].notes.push({ note: results[index].note, id: results[index].id });
        }
        const Firstnotes = [];
        const Secondnotes = [];
        for (let index = 0; index < Object.values(notesObj).length; index += 1) {
          const key = Object.values(notesObj)[index];
          if (index % 2 === 0) {
            Firstnotes.push(key);
          } else {
            Secondnotes.push(key);
          }
        }
        setfirstColumnArr(Firstnotes);
        setsecColumnArr(Secondnotes);
      });
    }
  }, [courseId]);

  // notes pdf
  const componentRef = useRef(null);
  const [OpenEditModal, setOpenEditModal] = useState(false);
  const [currentActiveNote, setCurrentActiveNote] = useState();
  const [disabledEdit, setdisabledEdit] = useState(false);

  // import  pdf arabic font cdn
  Font.register({
    family: 'Cairo',
    src: 'https://fonts.gstatic.com/s/cairo/v20/SLXVc1nY6HkvangtZmpcWmhzfH5lWWgsQQ.ttf',
  });

  // pdf document styles
  const styles = StyleSheet.create({
    body: {
      paddingBottom: 65,
      paddingTop: '20px',
    },
    titleView: {
      fontFamily: 'Cairo',
      marginTop: '10px',
      display: 'flex',
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      paddingHorizontal: 30,
      marginBottom: '15px',
    },
    headerImage: {
      width: '100%',
      marginBottom: '10px',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 12,
      bottom: 15,
      left: 47,
      right: 0,
      textAlign: 'center',
      width: 50,
      color: 'black',
    },
    footer: {
      position: 'absolute',
      bottom: '0px',
      right: '0px',
      left: '0px',
    },
    textViwe: {
      display: 'flex',
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      paddingHorizontal: 30,
    },
    ml1: {
      marginLeft: '3pt',
      fontFamily: 'Cairo',
      fontSize: 14,
    },
    title: {
      fontWeight: 1000,
      fontSize: 18,
    },
  });

  // text format function
  const formatText = (text) => {
    const splitedText = text.replace(/(\r\n|\n|\r)/gm, '.').split(' ');
    return splitedText;
  };

  // notes pdf document jsx
  const Quixote = () => (
    <Document style={{ width: '800px' }}>
      <Page style={styles.body}>
        <Image src={PdfHeader} style={styles.headerImage} fixed />
        {AllNotes?.map((note) => (
          <>
            <View style={[styles.titleView]}>
              الدرس :
              {formatText(note.lesson_title).map((word) => (
                <Text style={[styles.ml1, styles.title]} key={word}>
                  {word}
                </Text>
              ))}
            </View>
            <View style={[styles.textViwe]}>
              {formatText(note.note).map((word) => (
                <Text style={styles.ml1} key={word}>
                  {word}
                </Text>
              ))}
            </View>
          </>
        ))}
        <Image src={PdfFooter} style={styles.footer} fixed />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );

  return (
    <div className="notes-page">
      {/* export pdf btn */}
      {firstColumnArr?.length > 0 && (
        <div className="flex_end mb_30">
          <PDFDownloadLink document={<Quixote />} fileName="ملاحظاتي.pdf">
            <Button type="primary" size="large" className="fw_7 f_16">
              {t('export pdf')}
            </Button>
          </PDFDownloadLink>
        </div>
      )}

      <Spin spinning={!firstColumnArr}>
        {firstColumnArr?.length > 0 ? (
          <div className="gridNotes flex_btw gap-28 align_start" ref={componentRef}>
            {firstColumnArr?.length > 0 && (
              <div className="gridColumn flex_col gap-27">
                {firstColumnArr?.map((note) => (
                  <div className="gridNote" key={note.lessonId}>
                    <h2 className="f_25 fw_7 wide center mb_30">{note.lessonName}</h2>
                    {note.notes.map((noteText) => (
                      <div className={`textCont textCont${noteText.id}`}>
                        <p key={noteText.id}>{noteText.note}</p>
                        <div className="controllers flex_end gap-10 mb_5">
                          <Popconfirm
                            title={t('delete this note')}
                            description={t('Are you sure to delete this note?')}
                            onConfirm={() => {
                              document.querySelector(`.textCont${noteText.id}`).classList.add('loading');
                              NotesServices.DeleteCourseNote(noteText.id)
                                .then(() => {
                                  const Arr = firstColumnArr;
                                  setfirstColumnArr(
                                    Arr.map((noteItem) => ({
                                      ...noteItem,
                                      notes: noteItem.notes.filter((noteTextItem) => noteTextItem.id !== noteText.id),
                                    }))
                                  );
                                })
                                .catch((err) => {
                                  const errorObj = err.response.data;
                                  message.error({ content: t(errorObj), duration: 4 });
                                });
                            }}
                            onCancel={() => {}}
                            okText={t('delete')}
                            cancelText={t('ignore')}
                          >
                            <Button type="primary" className="remove" danger>
                              <BsFillTrashFill />
                            </Button>
                          </Popconfirm>
                          <Button
                            type="primary"
                            className="edit"
                            onClick={() => {
                              setCurrentActiveNote({ ...noteText, comingFrom: 'first' });
                              setOpenEditModal(true);
                            }}
                          >
                            <MdModeEditOutline />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            {secColumnArr?.length > 0 && (
              <div className="gridColumn flex_col gap-27">
                {secColumnArr?.map((note) => (
                  <div className="gridNote" key={note.lessonId}>
                    <h2 className="f_25 fw_7 wide center mb_30">{note.lessonName}</h2>
                    {note.notes.map((noteText) => (
                      <div className={`textCont textCont${noteText.id}`}>
                        <p key={noteText.id}>{noteText.note}</p>
                        <div className="controllers flex_end gap-10 mb_20">
                          <Popconfirm
                            title={t('delete this note')}
                            description={t('Are you sure to delete this note?')}
                            onConfirm={() => {
                              document.querySelector(`.textCont${noteText.id}`).classList.add('loading');
                              NotesServices.DeleteCourseNote(noteText.id)
                                .then(() => {
                                  const Arr = secColumnArr;
                                  setsecColumnArr(
                                    Arr.map((noteItem) => ({
                                      ...noteItem,
                                      notes: noteItem.notes.filter((noteTextItem) => noteTextItem.id !== noteText.id),
                                    }))
                                  );
                                })
                                .catch((err) => {
                                  const errorObj = err.response.data;
                                  message.error({ content: t(errorObj), duration: 4 });
                                });
                            }}
                            onCancel={() => {}}
                            okText={t('delete')}
                            cancelText={t('ignore')}
                          >
                            <Button type="primary" className="remove" danger>
                              <BsFillTrashFill />
                            </Button>
                          </Popconfirm>
                          <Button
                            type="primary"
                            className="edit"
                            onClick={() => {
                              setCurrentActiveNote({ ...noteText, comingFrom: 'seconds' });
                              setOpenEditModal(true);
                            }}
                          >
                            <MdModeEditOutline />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex_row_c hvh_70">
            <Empty description={t('no notes found')} />
          </div>
        )}
      </Spin>
      {/* edit modal */}
      <Modal
        title={t('edit_note')}
        open={OpenEditModal}
        onCancel={() => {
          setOpenEditModal(false);
        }}
        width={787}
        centered
        closeIcon={<AiOutlineCloseCircle />}
        maskStyle={{ background: 'rgba(255, 255, 255, 0.81)' }}
        wrapClassName="noFooter"
      >
        {OpenEditModal && (
          <TextArea
            className="wide"
            style={{ height: '200px', resize: 'none' }}
            value={currentActiveNote?.note}
            onChange={(e) => {
              setCurrentActiveNote({ ...currentActiveNote, note: e.target.value });
            }}
            placeholder={t('edit_note')}
            disabled={disabledEdit}
          />
        )}
        <div className="flex_end mt_20">
          <Button
            type="primary"
            size="large"
            className="fw_7"
            onClick={() => {
              setdisabledEdit(true);
              NotesServices.UpdateNote(currentActiveNote.id, { note: currentActiveNote.note })
                .then((res) => {
                  message.success(t(res.data));
                  setOpenEditModal(false);
                  if (currentActiveNote.comingFrom === 'first') {
                    const Arr = firstColumnArr;
                    const Allnotes = AllNotes;
                    setAllNotes(
                      Allnotes.map((noteItem) => ({
                        ...noteItem,
                        note: noteItem.id === currentActiveNote.id ? currentActiveNote.note : noteItem.note,
                      }))
                    );

                    setfirstColumnArr(
                      Arr.map((noteItem) => ({
                        ...noteItem,
                        notes: noteItem.notes.map((noteTextItem) => {
                          let note;
                          if (noteTextItem.id === currentActiveNote.id) {
                            note = { ...noteTextItem, note: currentActiveNote.note };
                          } else {
                            note = noteTextItem;
                          }
                          return note;
                        }),
                      }))
                    );
                  } else {
                    const Arr = secColumnArr;
                    setsecColumnArr(
                      Arr.map((noteItem) => ({
                        ...noteItem,
                        notes: noteItem.notes.map((noteTextItem) => {
                          let note;
                          if (noteTextItem.id === currentActiveNote.id) {
                            note = { ...noteTextItem, note: currentActiveNote.note };
                          } else {
                            note = noteTextItem;
                          }
                          return note;
                        }),
                      }))
                    );
                  }
                })
                .finally(() => {
                  setdisabledEdit(false);
                });
            }}
          >
            {t('send')}
          </Button>
        </div>
      </Modal>

      <PDFViewer>
        <Quixote />
      </PDFViewer>
    </div>
  );
}
export default DashboardNotes;

DashboardNotes.Layout = DashboardLayout;
