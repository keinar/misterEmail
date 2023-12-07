import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function EmailPreview({ email }) {
  return (
    <>
      <td className="subject">
        <Link
          to={`/email/${email.id}`}
          className={email.id}
          style={{ fontWeight: 700 }}
        >
          {email.subject}
        </Link>
      </td>
    </>
  );
}
