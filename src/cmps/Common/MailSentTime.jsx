import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
export function MailSentTime({ MailSentTime }) {
  return (
    <span className="mail-sent-time">
      {dayjs(MailSentTime).isBefore(dayjs().subtract(1), 'day')
        ? dayjs(MailSentTime).format('MMM DD')
        : dayjs(MailSentTime).fromNow(true)}
    </span>
  );
}
