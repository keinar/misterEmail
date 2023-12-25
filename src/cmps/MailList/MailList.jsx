import { mailService } from '../../services/mailService';
import { MailSort } from '../MailFilter/MailSort';
import { MailPreview } from '../MailPreview/MailPreview';

export function MailList({
  mails,
  onRemoveMail,
  loadMails,
  onToggleSortByDate,
  isAscending,
  params,
  onUpdateMail,
  toggleStar,
}) {
  return (
    <>
      <table className="email-list">
        {mails.length > 1 && (
          <MailSort
            mails={mails}
            onToggleSortByDate={onToggleSortByDate}
            isAscending={isAscending}
          />
        )}
        <tbody>
          {mails.map(mail => (
            <MailPreview
              key={mail.id}
              mail={mail}
              className="email-raw"
              onRemoveMail={onRemoveMail}
              loadMails={loadMails}
              currentFolder={params.folder}
              onUpdateMail={onUpdateMail}
              toggleStar={toggleStar}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
