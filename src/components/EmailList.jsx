import { MailPlus } from "lucide-react";
import { EmailPreview } from "./EmailPreview";

export function EmailList({ emails }) {
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
    </>
  );
}
