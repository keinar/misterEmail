import { mailService } from "../services/mailService";
import { EmailFilters } from "./EmailFilters";
import { EmailPreview } from "./EmailPreview";

export function EmailList({ emails, loadEmails }) {
  async function onRemoveEmail(emailId) {
    try {
      const userConfirmed = confirm("Are you sure to remove this email?");
      if (!userConfirmed) {
        return;
      }
      await mailService.remove(emailId);
      loadEmails();
    } catch (err) {
      console.error("error: ", err);
    }
  }

  return (
    <>
      <table className="email-list">
        <EmailFilters />
        <tbody>
          {emails.map((email) => (
            <EmailPreview
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
