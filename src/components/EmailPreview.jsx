import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MailOpen } from "lucide-react";

export function EmailPreview({ email }) {
  const [isOpened, setIsOpened] = useState(
    () => localStorage.getItem(`${email.id}`) === "true"
  );

  useEffect(() => {
    localStorage.setItem(`${email.id}`, JSON.stringify(isOpened));
  }, [isOpened]);

  function handleClick() {
    setIsOpened(true);
    localStorage.setItem(`${email.id}`, "true");
  }

  const fontWeight = !isOpened ? 700 : 500;
  const backgroundColor = !isOpened && "white";
  return (
    <>
      <td
        className="subject"
        onClick={handleClick}
        style={{ backgroundColor: backgroundColor }}
      >
        <Link
          to={`/email/${email.id}`}
          className={email.id}
          style={{ fontWeight: fontWeight }}
        >
          {email.subject}
        </Link>
        <span className="email-sent-time">{email.sentAt}</span>
        {!isOpened ? <Mail size={20} /> : <MailOpen size={20} />}
      </td>
    </>
  );
}
