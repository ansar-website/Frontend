/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-multi-assign */
/* eslint-disable jsx-a11y/media-has-caption */
import { message, Spin } from 'antd';
import { t } from 'i18next';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { BsDownload } from 'react-icons/bs';
import videojs from 'video.js';
import { Context } from '../../../../../components/Common/Context/Context';
import { API_URL } from '../../../../../config/config';
import FocusAreaLayout from '../../../../../layouts/FocusArea/FocusAreaLayout';
import Attach from '../../../../../public/images/icons/attach.svg';
import FileImg from '../../../../../public/images/icons/file.svg';
import CoursesService from '../../../../../services/courses/courses';
import LessonsService from '../../../../../services/lessons/lessons';

let videoElement = null;
function FocusingArea() {
  const router = useRouter();
  const { lessonId } = router.query;
  const { courseId } = router.query;
  const ID = Number(lessonId);
  const CourseId = Number(courseId);

  // saved vid time
  const [User, setUser] = useState();
  const [currentVidTimeEllepesed, setcurrentVidTimeEllepsed] = useState();
  const [continueSave, setContinueSave] = useState(true);
  const saveVidTime = () => {
    if (currentVidTimeEllepesed && User) {
      const UserObj = User;
      if (UserObj.focusHistory) {
        UserObj.focusHistory[ID] = currentVidTimeEllepesed;
      } else {
        UserObj.focusHistory = {
          [ID]: currentVidTimeEllepesed,
        };
      }
      localStorage.userObj = JSON.stringify(UserObj);
    }
  };

  useEffect(() => {
    if (continueSave) saveVidTime();
  }, [currentVidTimeEllepesed]);

  // fetch lesson & course data
  const [Lesson, setLesson] = useState();
  const [FocusQs, setFocusQs] = useState();
  const { courseData, setgoNext } = useContext(Context);
  const [CourseDetails, setCourseDetails] = useState();
  useEffect(() => {
    if (ID) {
      LessonsService.GetLesson(ID)
        .then((res) => {
          setLesson(res.data);
          const FocusQsVal = [...res.data.lesson_focus_questions].map((Q) => ({ ...Q, isDone: false }));
          setFocusQs(FocusQsVal);
        })
        .catch((err) => {
          const errorObj = err.response.data;
          message.error({ content: t(errorObj), duration: 4 });
          router.push('/');
        });
    }
  }, []);
  useEffect(() => {
    setCourseDetails(courseData);
  }, [courseData]);
  // end fetching data
  // setting the video-js option for the player
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    playbackRates: [0.5, 1, 1.5, 2],
    controlBar: {
      pictureInPictureToggle: false,
    },
    sources: [
      {
        src: `${API_URL.slice(0, -3)}${Lesson?.video_url}`,
        type: 'application/x-mpegURL',
      },
    ],
    html5: {
      hls: {
        enableLowInitialPlaylist: true,
        smoothQualityChange: true,
        overrideNative: true,
      },
    },
  };

  const videoReference = React.useRef(null);
  const playerReference = React.useRef(null);
  const [playedBefore, setplayedBefore] = useState(false);
  const onReady = (player) => {
    playerReference.current = player;
    const ModalDialog = videojs.getComponent('ModalDialog');
    const modal = new ModalDialog(player, {
      temporary: false,
      description: 'description',
      label: 'test',
    });
    if (currentVidTimeEllepesed) player.addClass('vjs-has-started');
    player.addChild(modal);
    player.on('play', () => {
      modal.close();
    });
    modal.el_.setAttribute('id', `addNoteModal`);
    modal.on('modalopen', () => {
      modal.contentEl().innerHTML = `
        <div class='addNoteModalContent'>
         <h3 class="addNoteTitle fw_7 f_18 flex_btw align_center">
          <span>
          ${t('add note')}
          </span>
          <button onclick="(function(){
            document.querySelector('#addNoteModal .vjs-close-button').click();
          })()">
            <svg width="30px" viewBox="0 0 1024 1024" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 1024 1024"><path d="M918.9 346.8c-22.1-54.5-54.5-103.3-96.4-145.2-41.9-41.9-90.8-74.3-145.2-96.4C624.6 83.8 569 73 512 73s-112.6 10.8-165.2 32.1c-54.5 22.1-103.3 54.5-145.2 96.4-41.9 41.9-74.4 90.8-96.4 145.2C83.8 399.4 73 455 73 512s10.8 112.6 32.1 165.2c22.1 54.5 54.5 103.3 96.4 145.2 41.9 41.9 90.8 74.3 145.2 96.4C399.4 940.2 455 951 512 951s112.6-10.8 165.2-32.1c54.5-22.1 103.3-54.5 145.2-96.4 41.9-41.9 74.4-90.8 96.4-145.2C940.2 624.6 951 569 951 512s-10.8-112.6-32.1-165.2zM636.2 664.5 512 540.3 387.8 664.5l-28.3-28.3L483.7 512 359.5 387.8l28.3-28.3L512 483.7l124.2-124.2 28.3 28.3L540.3 512l124.2 124.2-28.3 28.3z" fill="#007a8c" class="fill-000000"></path></svg>
          </button>
         </h3>
         <div class="ant-form-item-control-input"><div class="ant-form-item-control-input-content">
         <textarea placeholder="${t('note')}" 
         id="noteText"
         onkeyup="(function(e){
          let areaText = document.getElementById('noteText').value;
          console.log(areaText);
          if(areaText.length > 0){
            document.querySelector('.sendNote').classList.add('active');
          }else{
            document.querySelector('.sendNote').classList.remove('active');
          }
         })()"
          aria-required="true" class="ant-input formInput textArea"></textarea>
         </div>
         </div>

         <div class="flex_end">
          <button
            type="button"
            class="send sendNote f_16 fw_7"
            onclick="(function(){
              if(document.getElementById('noteText').value.length > 0){
                document.getElementById('addNote').click();
              }
            })()">
            ${t('send')}
          </button>
         </div>
        </div>
      `;
    });

    const seekForward = player.controlBar.addChild(
      'button',
      {
        clickHandler() {
          player.currentTime(player.currentTime() + 10);
        },
      },
      0
    );

    const seekBackward = player.controlBar.addChild(
      'button',
      {
        clickHandler() {
          player.currentTime(player.currentTime() - 10);
        },
      },
      0
    );

    const seekForwardDom = seekForward.el();
    seekForwardDom.innerHTML = `<span class="seekForward flex" title="${t('seek forward')}">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.6916 7.34849C19.4416 7.01849 18.9716 6.94849 18.6416 7.19849C18.3116 7.44849 18.2416 7.91849 18.4916 8.24849C19.5716 9.68849 20.1416 11.3685 20.1416 13.1085C20.1416 17.5985 16.4916 21.2485 12.0016 21.2485C7.51156 21.2485 3.86156 17.5985 3.86156 13.1085C3.86156 8.61849 7.51156 4.97849 12.0016 4.97849C12.5816 4.97849 13.1716 5.04849 13.8116 5.19849C13.8416 5.20849 13.8716 5.19849 13.9116 5.19849C13.9316 5.19849 13.9616 5.21849 13.9816 5.21849C14.0116 5.21849 14.0316 5.20849 14.0616 5.20849C14.1016 5.20849 14.1316 5.19849 14.1616 5.18849C14.2116 5.17849 14.2616 5.15849 14.3116 5.12849C14.3416 5.10849 14.3816 5.09849 14.4116 5.07849C14.4216 5.06849 14.4416 5.06849 14.4516 5.05849C14.4816 5.03849 14.4916 5.00849 14.5116 4.98849C14.5516 4.94849 14.5816 4.91849 14.6116 4.86849C14.6416 4.82849 14.6516 4.77849 14.6716 4.73849C14.6816 4.70849 14.7016 4.67849 14.7116 4.64849C14.7116 4.62849 14.7116 4.61849 14.7116 4.59849C14.7216 4.54849 14.7216 4.49849 14.7116 4.44849C14.7116 4.39849 14.7116 4.35849 14.7016 4.30849C14.6916 4.26849 14.6716 4.22849 14.6516 4.17849C14.6316 4.12849 14.6116 4.07849 14.5816 4.03849C14.5716 4.01849 14.5716 4.00849 14.5616 3.99849L12.5816 1.52849C12.3216 1.20849 11.8516 1.15849 11.5316 1.40849C11.2116 1.66849 11.1616 2.13849 11.4116 2.45849L12.2316 3.47849C12.1516 3.47849 12.0716 3.46849 11.9916 3.46849C6.68156 3.46849 2.35156 7.78849 2.35156 13.1085C2.35156 18.4285 6.67156 22.7485 11.9916 22.7485C17.3116 22.7485 21.6316 18.4285 21.6316 13.1085C21.6416 11.0385 20.9616 9.04849 19.6916 7.34849Z" fill="#ffffff"></path> <path d="M9.5415 16.6708C9.1315 16.6708 8.7915 16.3308 8.7915 15.9208V12.5308L8.6015 12.7508C8.3215 13.0608 7.8515 13.0808 7.5415 12.8108C7.2315 12.5308 7.2115 12.0608 7.4815 11.7508L8.9815 10.0808C9.1915 9.85081 9.5215 9.77081 9.8115 9.88081C10.1015 9.99081 10.2915 10.2708 10.2915 10.5808V15.9308C10.2915 16.3408 9.9615 16.6708 9.5415 16.6708Z" fill="#ffffff"></path> <path d="M14 16.6703C12.48 16.6703 11.25 15.4403 11.25 13.9203V12.5703C11.25 11.0503 12.48 9.82031 14 9.82031C15.52 9.82031 16.75 11.0503 16.75 12.5703V13.9203C16.75 15.4403 15.52 16.6703 14 16.6703ZM14 11.3303C13.31 11.3303 12.75 11.8903 12.75 12.5803V13.9303C12.75 14.6203 13.31 15.1803 14 15.1803C14.69 15.1803 15.25 14.6203 15.25 13.9303V12.5803C15.25 11.8903 14.69 11.3303 14 11.3303Z" fill="#ffffff"></path> </g></svg>    </span>`;
    seekForwardDom.title = t('seek forward');

    const seekBackwardDom = seekBackward.el();
    seekBackwardDom.innerHTML = `<span class="seekBackward flex" title="${t('seek backward')}">
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.54004 15.92V10.5801L8.04004 12.2501" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M10.02 4.46997L12 2" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M4.91 7.79999C3.8 9.27999 3.10999 11.11 3.10999 13.11C3.10999 18.02 7.09 22 12 22C16.91 22 20.89 18.02 20.89 13.11C20.89 8.19999 16.91 4.21997 12 4.21997C11.32 4.21997 10.66 4.31002 10.02 4.46002" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14 10.5801C15.1 10.5801 16 11.4801 16 12.5801V13.9301C16 15.0301 15.1 15.9301 14 15.9301C12.9 15.9301 12 15.0301 12 13.9301V12.5801C12 11.4701 12.9 10.5801 14 10.5801Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>    </span>`;
    seekBackwardDom.title = t('seek backward');

    const myButton = player.controlBar.addChild(
      'button',
      {
        clickHandler() {
          modal.open();
        },
      },
      0
    );
    const myButtonDom = myButton.el();
    myButtonDom.innerHTML = `<span class="takeNote flex" title="${t(
      'add note'
    )}"><svg viewBox="0 0 19 19" xml:space="preserve" xmlns="http://www.w3.org/2000/svg"><g fill="#ffffff" class="fill-231f20"><path d="M8.44 7.25a1.393 1.393 0 0 0-.225.307l-.041-.041-.025.174c-.1.235-.135.493-.107.752l-.399 2.796 2.797-.399c.259.028.517-.007.752-.107l.174-.024-.041-.041c.109-.062.215-.133.307-.225l5.053-5.053-3.191-3.191L8.44 7.25zM18.183 1.568l-.87-.87c-.641-.641-1.637-.684-2.225-.097l-.797.797 3.191 3.191.797-.798c.588-.586.545-1.582-.096-2.223z"></path><path d="M15 9.696V17H2V2h8.953L12.476.58c.162-.161.353-.221.555-.293.043-.119.104-.18.176-.287H0v19h17V7.928l-2 1.768z"></path></g></svg></span>`;
    const qmodal = new ModalDialog(player, {
      temporary: false,
      description: 'description',
      label: 'test',
    });
    player.addChild(qmodal);
    player.on('play', () => {
      qmodal.close();
    });
    qmodal.el_.setAttribute('id', `addQModal`);
    qmodal.on('modalopen', () => {
      qmodal.contentEl().innerHTML = `
        <div class='addNoteModalContent'>
         <h3 class="addNoteTitle fw_7 f_18 flex_btw align_center">
          <span>
          ${t('add question')}
          </span>
          <button onclick="(function(){
            document.querySelector('#addQModal .vjs-close-button').click();
          })()">
            <svg width="30px" viewBox="0 0 1024 1024" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 1024 1024"><path d="M918.9 346.8c-22.1-54.5-54.5-103.3-96.4-145.2-41.9-41.9-90.8-74.3-145.2-96.4C624.6 83.8 569 73 512 73s-112.6 10.8-165.2 32.1c-54.5 22.1-103.3 54.5-145.2 96.4-41.9 41.9-74.4 90.8-96.4 145.2C83.8 399.4 73 455 73 512s10.8 112.6 32.1 165.2c22.1 54.5 54.5 103.3 96.4 145.2 41.9 41.9 90.8 74.3 145.2 96.4C399.4 940.2 455 951 512 951s112.6-10.8 165.2-32.1c54.5-22.1 103.3-54.5 145.2-96.4 41.9-41.9 74.4-90.8 96.4-145.2C940.2 624.6 951 569 951 512s-10.8-112.6-32.1-165.2zM636.2 664.5 512 540.3 387.8 664.5l-28.3-28.3L483.7 512 359.5 387.8l28.3-28.3L512 483.7l124.2-124.2 28.3 28.3L540.3 512l124.2 124.2-28.3 28.3z" fill="#007a8c" class="fill-000000"></path></svg>
          </button>
         </h3>
         <div class="ant-form-item-control-input"><div class="ant-form-item-control-input-content">
         <textarea placeholder="${t('question')}" 
         id="qText"
         onkeyup="(function(e){
          let areaText = document.getElementById('qText').value;
          console.log(areaText);
          if(areaText.length > 0){
            document.querySelector('.sendQ').classList.add('active');
          }else{
            document.querySelector('.sendQ').classList.remove('active');
          }
         })()"
          aria-required="true" class="ant-input formInput textArea"></textarea>
         </div>
         </div>

         <div class="flex_end">
          <button
            type="button"
            class="send sendQ f_16 fw_7"
            onclick="(function(){
              if(document.getElementById('qText').value.length > 0){
                document.getElementById('addQ').click();
              }
            })()">
            ${t('send')}
          </button>
         </div>
        </div>
      `;
    });
    const myButtonQ = player.controlBar.addChild(
      'button',
      {
        clickHandler() {
          qmodal.open();
        },
      },
      0
    );
    // Create our button's DOM Component

    const myButtonDomQ = myButtonQ.el();
    myButtonDomQ.innerHTML = `<span class="takeNote flex" title="${t(
      'add question'
    )}"><svg height="30px" width="30px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 302.967 302.967" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path style="fill:#fff;" d="M151.483,302.967C67.956,302.967,0,235.017,0,151.483S67.956,0,151.483,0 s151.483,67.956,151.483,151.483S235.017,302.967,151.483,302.967z M151.483,24.416c-70.066,0-127.067,57.001-127.067,127.067 s57.001,127.067,127.067,127.067s127.067-57.001,127.067-127.067S221.555,24.416,151.483,24.416z"></path> </g> <g> <g> <path style="fill:#fff;" d="M116.586,118.12c1.795-4.607,4.297-8.588,7.511-11.961c3.225-3.389,7.114-6.016,11.667-7.898 c4.547-1.904,9.633-2.845,15.262-2.845c7.261,0,13.32,0.995,18.183,2.997c4.857,1.996,8.768,4.482,11.738,7.441 c2.964,2.97,5.091,6.168,6.369,9.584c1.273,3.432,1.915,6.636,1.915,9.595c0,4.901-0.642,8.947-1.915,12.118 c-1.278,3.171-2.866,5.88-4.759,8.131c-1.898,2.252-3.987,4.172-6.293,5.755c-2.295,1.588-4.471,3.171-6.516,4.759 c-2.045,1.583-3.862,3.394-5.445,5.439c-1.588,2.04-2.589,4.601-2.991,7.664v5.831H140.6v-6.908 c0.305-4.395,1.153-8.072,2.529-11.036c1.382-2.964,2.991-5.499,4.83-7.598c1.844-2.089,3.786-3.911,5.836-5.445 c2.04-1.539,3.927-3.073,5.673-4.591c1.73-1.545,3.144-3.225,4.221-5.069c1.071-1.833,1.556-4.15,1.452-6.908 c0-4.705-1.148-8.18-3.454-10.427c-2.295-2.257-5.493-3.378-9.589-3.378c-2.758,0-5.134,0.533-7.131,1.605 s-3.628,2.513-4.911,4.302c-1.278,1.795-2.225,3.894-2.834,6.288c-0.615,2.415-0.919,4.982-0.919,7.756h-22.55 C113.85,127.785,114.791,122.732,116.586,118.12z M162.536,183.938v23.616h-24.09v-23.616H162.536z"></path> </g> </g> </g> </g> </g></svg></span>`;

    // handling video player
  };
  const options = videoJsOptions;
  useEffect(() => {
    // Initializing video.js player
    if (!playerReference.current) {
      videoElement = videoReference.current;
      if (localStorage && videoElement) {
        if (localStorage.userObj) {
          const UserObj = JSON.parse(localStorage.userObj);
          if (UserObj) setUser(UserObj);
          if (UserObj.focusHistory) {
            if (UserObj.focusHistory[ID]) videoElement.currentTime = UserObj.focusHistory[ID];
          }
        }
      }
      if (!videoElement) return;
      const player = (playerReference.current = videojs(videoElement, options, () => {
        onReady && onReady(player);
      }));
    }
  }, [options, videoReference]);

  // Destroy video.js player on component unmount
  useEffect(() => {
    const player = playerReference.current;
    return () => {
      if (player) {
        player.dispose();
        playerReference.current = null;
      }
    };
  }, [playerReference]);

  const [currentVidTime, setcurrentVidTime] = useState();
  useEffect(() => {
    const interval = setInterval(async () => {
      if (videoElement && videoElement.currentTime > 0) {
        const elapsedSeconds = videoElement.currentTime;
        const elapsedMilliseconds = Math.floor(elapsedSeconds * 1000);
        const min = Math.floor(elapsedMilliseconds / 60000);
        setcurrentVidTime(min);
        setcurrentVidTimeEllepsed(videoElement.currentTime);
      }
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [videoElement]);

  // focusing time
  const [time, setTime] = useState({
    sec: 0,
    min: 0,
    hr: 0,
  });

  const [intervalId, setIntervalId] = useState();

  const updateTimer = () => {
    setTime((prev) => {
      const newTime = { ...prev };
      // update sec and see if we need to increase min
      if (newTime.sec < 59) newTime.sec += 1;
      else {
        newTime.min += 1;
        newTime.sec = 0;
      }
      // min has increased in *newTime* by now if it was updated, see if it has crossed 59
      if (newTime.min === 60) {
        newTime.min = 0;
        newTime.hr += 1;
      }

      return newTime;
    });
  };

  const pauseTimer = () => {
    clearInterval(intervalId);
    setIntervalId('');
  };
  const resumeTimer = () => {
    if (!intervalId) {
      const id = setInterval(updateTimer, 1000);
      setIntervalId(id);
    }
  };
  // end focusing time
  let chromaAns = null;
  useEffect(() => {
    if (Lesson && videoElement) {
      const NextStopTime = FocusQs;
      for (let index = 0; index < FocusQs.length; index += 1) {
        const NextTime = NextStopTime[index + 1]?.time_to_show_question || 2000;
        if (
          currentVidTime >= FocusQs[index].time_to_show_question &&
          currentVidTime < NextTime &&
          !FocusQs[index].isDone
        ) {
          videoElement?.pause();
          pauseTimer();
          // setOpenQModal(true);
          const updatedQs = [...FocusQs].map((Q) => {
            if (Q.id === FocusQs[index].id) {
              return { ...Q, isDone: true };
            }
            return Q;
          });
          setFocusQs(updatedQs);
          const ModalDialog = videojs.getComponent('ModalDialog');

          const modal = new ModalDialog(playerReference.current, {
            //  content:'test content',
            temporary: false,
            description: 'description',
            label: 'test',
            // closeable:true
          });

          playerReference.current.addChild(modal);
          modal.el_.setAttribute('id', `modal-${FocusQs[index].id}`);
          const close = document.querySelectorAll(`#modal-${FocusQs[index].id} .vjs-button`)[0];
          close.style.display = 'none';
          close.parentNode.removeChild(close);
          // close.classList.remove('vjs-close-button', 'vjs-control', 'vjs-button');
          modal.on('modalopen', () => {
            setTimeout(() => {
              modal.contentEl().innerHTML = `<div class="flex_row_c modalCont">
                <div class="ant-modal-content modalBody">
                 <div class="ant-modal-header">
                  <h2 class="ant-modal-title">${FocusQs[index].question}</h2>
                 </div>
                 <div class="qContent qContent${FocusQs[index].id}">
                    <p class="f_16 fw_6 mc mb_37 qName">${FocusQs[index].question}</p>
                    ${FocusQs[index].answers.map(
                      (radio) => `<label class="rad-label">
                      <input type="radio" class="rad-input"
                      name="rad"
                      value=${radio.id} 
                      onchange="(function(){
                        chromaAns = ${radio.id};
                        document.querySelector('.sendbtn${FocusQs[index].id}').classList.add('active');})()">
                      <div class="rad-design"></div>
                      <div class="rad-text">${radio.answer}</div>
                    </label>`
                    )}

                 </div>
                 <div class="spliter"></div>
                  <div class="flex_end">
                    <button
                      type="button"
                      class="send sendAns f_20 fw_7 sendbtn${FocusQs[index].id}"
                      onclick="(function(){
                        if(chromaAns){
                          document.querySelectorAll('.qContent${FocusQs[index].id}')[0].classList.add('loading');
                            fetch('${API_URL}/lms/lesson/submit-focus-question/', {
                            method: 'POST',
                            headers: {
                              Authorization: 'Bearer ${localStorage.userToken}',
                              Accept: 'application/json, text/plain, */*',
                              'Content-Type': 'application/json;charset=utf-8',
                            },
                            body: JSON.stringify({
                              focus_question: ${FocusQs[index].id},
                              lesson: ${ID},
                              answer: chromaAns,
                            }),
                          })
                            .then((response) => response.json())
                            .then((res) => {
                              if(res?.is_correct) {
                                document.getElementById('successBtn').click();
                              } else if(res?.is_correct === false) {
                                document.getElementById('wrongBtn').click();
                              }else{
                                document.getElementById('errBtn').click();
                              }
                            }).finally(() => {
                              document.querySelectorAll('.qContent${FocusQs[index].id}')[0].classList.remove('loading');
                              document.querySelectorAll('#modal-${FocusQs[index].id} .vjs-button')[0].click();
                              document.getElementById('player_html5_api').play();
                              document.querySelector('.sendAns').classList.remove('active');
                            })
                        }
                      })()"
                      >
                      ${t('send')}
                    </button>
                  </div>
                </div>
              </div>`;
            }, 200);
          });
          modal.open();
          break;
        }
      }
    }
  }, [Lesson, currentVidTime, videoElement]);
  useEffect(() => {
    const cashedId = ID;
    const cashedCourseId = CourseId;
    const timeVal = time;
    const handleBeforeUnload = () => {
      if (ID && CourseId) {
        if (timeVal.min > 0 || timeVal.hr > 0) {
          LessonsService.PostFocusTime({
            focus_time: timeVal.min + timeVal.hr * 60,
            lesson: cashedId,
            course: cashedCourseId,
          }).then(() => {
            setTime({ sec: 0, min: 0, hr: 0 });
          });
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [time]);
  //  on route change
  useEffect(() => {
    const cashedId = ID;
    const cashedCourseId = CourseId;
    const timeVal = time;
    const handleRouteChange = () => {
      if (ID && CourseId) {
        if (timeVal.min > 0 || timeVal.hr > 0) {
          LessonsService.PostFocusTime({
            focus_time: timeVal.min + timeVal.hr * 60,
            lesson: cashedId,
            course: cashedCourseId,
          }).then(() => {
            setTime({ sec: 0, min: 0, hr: 0 });
          });
        }
      }
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [time]);
  // sending focus time
  // const MINUTE_MS = 60000;
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('from interval');
      const isVideoPlaying = (video) =>
        !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2);
      if (User) {
        if (isVideoPlaying(videoReference.current)) {
          const hours = Number(document.getElementById('hours').innerText);
          const minutes = Number(document.getElementById('minutes').innerText);
          LessonsService.PostFocusTime({
            focus_time: minutes + hours * 60,
            lesson: ID,
            course: CourseId,
          });
        }
      }
    }, 240500);
    return () => clearInterval(interval);

  }, [currentVidTime, User]);
  // check device type
  const deviceIsMobile = () =>
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="wide">
      <Spin spinning={!Lesson}>
        <div className="focusing-area pdb_50">
          {Lesson && (
            <div className="lessonFocusContainer">
              <div className="flex_btw pdtb_22 headCont">
                <h2 className="f_25 fw_7 lessonTitle">{Lesson.title}</h2>
                {Lesson.is_completed && <span className="watching wc f_20 fw_5">تمت المشاهدة</span>}
              </div>
              <button
                type="button"
                id="addQ"
                onClick={() => {
                  let areaText = document.getElementById('qText');
                  areaText.disabled = true;
                  CoursesService.PostForum(CourseDetails.course_forum[0], {
                    question: areaText.value,
                    lesson: ID,
                  })
                    .then(() => {
                      message.success(t('successfully added'));
                    })
                    .catch((err) => {
                      const errorObj = err?.response?.data;
                      if (errorObj) {
                        message.error({ content: t(errorObj), duration: 4 });
                      }
                    })
                    .finally(() => {
                      areaText.disabled = false;
                      areaText.value = '';
                      document.querySelector('#addQModal .vjs-close-button').click();
                    });
                }}
              />

              <button
                type="button"
                id="addNote"
                onClick={() => {
                  let areaText = document.getElementById('noteText');
                  areaText.disabled = true;
                  CoursesService.PostNote({
                    course: CourseId,
                    note: areaText.value,
                    lesson: ID,
                  })
                    .then(() => {
                      message.success(t('successfully added'));
                    })
                    .catch((err) => {
                      const errorObj = err?.response?.data;
                      if (errorObj) {
                        message.error({ content: t(errorObj), duration: 4 });
                      }
                    })
                    .finally(() => {
                      areaText.disabled = false;
                      areaText.value = '';
                      document.querySelector('#addNoteModal .vjs-close-button').click();
                    });
                }}
              />

              <button
                type="button"
                id="successBtn"
                onClick={() => {
                  message.success(t('Correct Answer'));
                }}
              />
              <button
                type="button"
                id="wrongBtn"
                onClick={() => {
                  message.error(t('Wrong Answer'));
                }}
              />
              <button
                type="button"
                id="errBtn"
                onClick={() => {
                  message.error(t('You have already completed this question'));
                }}
              />
              <div className="vidCont">
                <div data-vjs-player className="wide">
                  <video
                    ref={videoReference}
                    className="video-js vjs-big-play-centered wide"
                    id="player"
                    onPlay={() => {
                      resumeTimer();
                      if (!playedBefore) {
                        const playerEl = document.getElementById('player');
                        if (playerEl.requestFullscreen) {
                          playerEl.requestFullscreen();
                        } else if (playerEl.webkitRequestFullscreen) {
                          /* Safari */
                          playerEl.webkitRequestFullscreen();
                        } else if (playerEl.msRequestFullscreen) {
                          /* IE11 */
                          playerEl.msRequestFullscreen();
                        }
                        setplayedBefore(true);
                      }
                    }}
                    onPause={() => {
                      pauseTimer();
                      saveVidTime();
                    }}
                    onEnded={() => {
                      pauseTimer();
                      setContinueSave(false);
                      if (User) {
                        const UserObj = User;
                        if (UserObj.focusHistory) {
                          if (UserObj.focusHistory[ID]) {
                            delete UserObj.focusHistory[ID];
                            localStorage.userObj = JSON.stringify(UserObj);
                          }
                        }
                        LessonsService.PostFocusTime({
                          focus_time: time.min + time.hr * 60,
                          lesson: ID,
                          course: CourseId,
                        })
                          .then(() => {
                            setTime({ sec: 0, min: 0, hr: 0 });
                          })
                          .finally(() => {
                            setgoNext(true);
                          });
                      } else {
                        setgoNext(true);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="downCntrl flex_btw gap-120">
                {Lesson.attachments?.length > 0 && (
                  <div className="attachments mt_52">
                    <div className="head flex_btw mb_10">
                      <span className="f_15 fw_6">المرفقات</span>
                      <img src={FileImg} alt="fileimage" />
                    </div>
                    <div className="flex_col wide">
                      {Lesson.attachments?.map((file) => (
                        <div className="flex_btw wide attachItem" key={file.title}>
                          <span className="fileName flex gap-10">
                            <img src={Attach} alt="attach" />
                            <span className="f_15 fw_6"> {file.title}</span>
                          </span>

                          {deviceIsMobile() ? (
                            <a href={file.file} className="download flex align_center gap-8 pnt">
                              <span className="f_15 fw_6"> تحميل</span>
                              <BsDownload />
                            </a>
                          ) : (
                            <a
                              href={file.file}
                              download
                              className="download align_center flex gap-8 pnt"
                              target="_SEJ"
                              rel="external"
                            >
                              <span className="f_15 fw_6"> تحميل</span>
                              <BsDownload />
                            </a>
                          )}

                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="timer flex_row_c">
                  <h2 className="f_24 fw_8" dir="ltr">
                    {/* {`${time.hr < 10 ? 0 : ''}${time.hr} : 
                    ${time.min < 10 ? 0 : ''}${time.min} : 
                    ${time.sec < 10 ? 0 : ''}${time.sec}`} */}
                    <span className="pdrl_4" id="hours">
                      {time.hr < 10 ? 0 : ''}
                      {time.hr}
                    </span>
                    :
                    <span className="pdrl_4" id="minutes">
                      {time.min < 10 ? 0 : ''}
                      {time.min}
                    </span>
                    :
                    <span className="pdrl_4" id="seconds">
                      {time.sec < 10 ? 0 : ''}
                      {time.sec}
                    </span>
                  </h2>
                </div>
              </div>
            </div>
          )}
        </div>
      </Spin>
    </div>
  );
}
export default FocusingArea;
FocusingArea.Layout = FocusAreaLayout;
