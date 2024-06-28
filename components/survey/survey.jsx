import { Button, Form, Modal, Radio, Spin, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import LessonsService from '../../services/lessons/lessons';

const Survey = ({ data, open, setOpenSurvey, courseId }) => {
  const [surveyObj, setSurveyObj] = useState();
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    if (surveyObj || !data) return;
    setLoading(false);
    const surveyCopy = {};
    data.map((item) => {
      surveyCopy[item.id] = { question: item.id, answer: null };
      return true;
    });
    setSurveyObj(surveyCopy);
  }, [data]);

  const [survey] = Form.useForm();
  return (
    <Modal open={open} onCancel={() => setOpenSurvey()} footer={false} centered>
      <Spin spinning={loading}>
        <Form
          className="flex_col"
          form={survey}
          onFinish={() => {
            setLoading(true);
            const payload = [];
            Object.keys(surveyObj).map((item) => {
              payload.push(surveyObj[item]);
              return true;
            });
            LessonsService.SubmitSurvey(courseId, { answers: payload })
              .then((res) => {
                if (res?.data?.message) message.success({ content: t(res.data.message), duration: 4 });
                router.push('/dashboard/degrees/');
              })
              .catch((err) => {
                const errorObj = err?.response?.data;
                if (errorObj) {
                  message.error({ content: t(errorObj), duration: 4 });
                  router.push('/dashboard/degrees/');
                }
              })
              .finally(() => {
                setLoading(false);
                setOpenSurvey();
                survey.resetFields();
              });
          }}
        >
          <div style={{ maxHeight: '75vh', overflowY: 'scroll' }} className="wide">
            {data?.map((item) => (
              <Form.Item
                className="mb_20"
                rules={[
                  {
                    required: true,
                    message: t('is_required'),
                  },
                ]}
                name={item.question}
              >
                <Radio.Group
                  onChange={(e) => {
                    setSurveyObj((prev) => ({ ...prev, [item.id]: { ...prev[item.id], answer: e.target.value } }));
                  }}
                >
                  <div className="flex_col qContent">
                    <h2 className="mc f_20 fw_7 mb_10">{item.question}</h2>
                    {item?.answers.map((answer) => (
                      <Radio value={answer.id} className="answerItem" key={answer.id}>
                        <span className="ansText bold f_14"> {answer.answer}</span>
                      </Radio>
                    ))}
                  </div>
                </Radio.Group>
              </Form.Item>
            ))}
          </div>
          <Form.Item className="flex_end">
            <Button type="primary" size="large" className="fw_7" htmlType="submit">
              {t('send')}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
export default Survey;
