import { MailPreview } from '../MailPreview/MailPreview';

export function MailList({ mails, onRemoveMail, params, onUpdateMail }) {
  return (
    <>
      <table className="mail-list">
        <tbody>
          {mails.map(mail => (
            <MailPreview
              key={mail.id}
              mail={mail}
              className="mail-raw"
              onRemoveMail={onRemoveMail}
              currentFolder={params.folder}
              onUpdateMail={onUpdateMail}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
