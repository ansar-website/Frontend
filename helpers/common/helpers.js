import dayjs from 'dayjs';
import { t } from 'i18next';

export const validateMessages = {
  required: `\${label} ${t('is_required')}`,
  string: {
    len: `\${name} ${t('must be exactly')} \${len} ${t('characters')}`,
    min: `\${name} ${t('must be at least')} \${min} ${t('characters')}`,
    max: `\${name} ${t('cannot be longer than')} \${max} ${t('characters')}`,
    range: `\${name} ${t('must be between')} \${min} ${t('and')} \${max} ${t('characters')}`,
  },
  types: {
    email: `\${label} ${t('valid_email')}`,
    number: `\${label} ${t('valid_number')}`,
  },
};

export const formatDate = (date) => {
  try {
    const unformattedTime = new Date(date);
    const formattedTime = unformattedTime.toLocaleString('ar', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    });
    return formattedTime;
  } catch (error) {
    return dayjs(date).format('YYYY-MM-DD');
  }
};
