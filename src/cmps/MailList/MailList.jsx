import { emailService } from "../../services/email.service";
import { MailSort } from "../MailFilter/MailSort";
import { MailPreview } from "../MailPreview/MailPreview";

export function EmailList({ emails, loadEmails }) {
  async function onRemoveEmail(emailId) {
    try {
      const userConfirmed = confirm("Are you sure to remove this email?");
      if (!userConfirmed) {
        return;
      }
      await emailService.remove(emailId);
      loadEmails();
    } catch (err) {
      console.error("error: ", err);
    }
  }

  return (
    <>
      <table className="email-list">
        <MailSort />
        <tbody>
          {emails.map((email) => (
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
