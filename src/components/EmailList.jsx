import { EmailPreview } from "./EmailPreview";

export function EmailList({ emails }) {
  return (
    <table className="email-list">
      <tbody className="table-body">
        {emails.map((email) => (
          <tr key={email.id} className="email-raw">
            <EmailPreview email={email} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}
