import { mailService } from '../../services/mailService';
import { MailSort } from '../MailFilter/MailSort';
import { MailPreview } from '../MailPreview/MailPreview';

export function EmailList({
  emails,
  loadEmails,
  onToggleSortByDate,
  isAscending,
  params,
}) {
  async function onRemoveEmail(emailId) {
    try {
      let userConfirmed = '';
      if (params.folder === 'trash') {
        userConfirmed = confirm('Are you sure to remove this email forever?');
        if (!userConfirmed) {
          return;
        }
        await mailService.remove(emailId);
      } else {
        userConfirmed = confirm('Are you sure to remove this email?');
        if (!userConfirmed) {
          return;
        }
        const emailToRemove = await mailService.getById(emailId);
        emailToRemove.removedAt = Date.now();
        await mailService.save(emailToRemove);
      }
      loadEmails();
    } catch (err) {
      console.error('error: ', err);
    }
  }
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
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
