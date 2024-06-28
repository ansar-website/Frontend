import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function Countdown({ countdownDate, eventTitle }) {
  const [days, setDays] = useState(undefined);
  const [hours, setHours] = useState(undefined);
  const [minutes, setMinutes] = useState(undefined);
  const [seconds, setSeconds] = useState(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    const targetDate = new Date(countdownDate).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setDays(Math.floor(distance / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
      setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
      setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
    };

    const timer = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(timer);
  }, [countdownDate]);

  return (
    <div className="countdown">
      <h1>
        {t('time_to_start')} {eventTitle}
      </h1>
      <div className="countdown-wrapper">
        <div className="countdown-item">
          {days}
          <span>{t('day')}</span>
        </div>
        <div className="countdown-item">
          {hours}
          <span>{t('hour')}</span>
        </div>
        <div className="countdown-item">
          {minutes}
          <span>{t('minute')}</span>
        </div>
        <div className="countdown-item">
          {seconds}
          <span>{t('second')}</span>
        </div>
      </div>
    </div>
  );
}

export default Countdown;
