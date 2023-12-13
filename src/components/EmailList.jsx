import { MailPlus } from "lucide-react";
import { EmailPreview } from "./EmailPreview";

export function EmailList({ emails, onComposeModalChange }) {
  function openComposeModal() {
    onComposeModalChange(true);
  }

  return (
    <>
      <table className="email-list">
        <thead>
          <tr>
            <th></th>
          </tr>
        </thead>
        {emails.map((email) => (
          <tbody key={email.id} className="email-raw">
            <EmailPreview email={email} />
          </tbody>
        ))}
      </table>

      <button className="mobile-compose-btn" onClick={openComposeModal} hidden>
        <MailPlus size={20} />
        Compose
      </button>
    </>
  );
}
