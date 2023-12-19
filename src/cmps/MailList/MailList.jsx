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
      const userConfirmed = confirm('Are you sure to remove this email?');
      if (!userConfirmed) {
        return;
      }
      const emailToRemove = await mailService.getById(emailId);
      emailToRemove.removedAt = Date.now();
      await mailService.save(emailToRemove);
      if (params.folder === 'trash') {
        await mailService.remove(emailId);
      }

      loadEmails();
    } catch (err) {
      console.error('error: ', err);
    }
  }
  return (
    <>
      <table className="email-list">
        <MailSort
          emails={emails}
          onToggleSortByDate={onToggleSortByDate}
          isAscending={isAscending}
        />
        <tbody>
          {emails.map(email => (
            <MailPreview
              key={email.id}
              email={email}
              className="email-raw"
              onRemoveEmail={onRemoveEmail}
              loadEmails={loadEmails}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
