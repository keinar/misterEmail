import { emailService } from "../services/email.service";
import { EmailPreview } from "./EmailPreview";

export function EmailList({ emails }) {
  async function onRemoveEmail(emailId) {
    try {
      const userConfirmed = confirm("Are you sure to remove this email?");
      if (!userConfirmed) {
        return;
      }
      await emailService.remove(emailId);
    } catch (err) {
      console.error("error: ", err);
    }
  }

  return (
    <>
      <table className="email-list">
        <thead>
          <tr>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {emails.map((email) => (
            <EmailPreview
              key={email.id}
              email={email}
              className="email-raw"
              onRemoveEmail={onRemoveEmail}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
