import { Link } from "react-router-dom";

export function EmailPreview({ email }) {
  return (
    <>
      <td className="subject">
        <Link to={`/email-inbox/${email.id}`}>{email.subject}</Link>
      </td>
    </>
  );
}
