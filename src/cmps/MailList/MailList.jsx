import { mailService } from '../../services/mailService';
import { MailSort } from '../MailFilter/MailSort';
import { MailPreview } from '../MailPreview/MailPreview';

export function EmailList({
  emails,
  onRemoveEmail,
  loadEmails,
  onToggleSortByDate,
  isAscending,
  params,
  onUpdateMail,
}) {
  return (
    <>
      <table className="email-list">
        {emails.length > 1 && (
          <MailSort
            emails={emails}
            onToggleSortByDate={onToggleSortByDate}
            isAscending={isAscending}
          />
        )}
        <tbody>
          {emails.map(email => (
            <MailPreview
              key={email.id}
              email={email}
              className="email-raw"
              onRemoveEmail={onRemoveEmail}
              loadEmails={loadEmails}
              currentFolder={params.folder}
              onUpdateMail={onUpdateMail}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
