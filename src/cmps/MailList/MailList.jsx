import { MailPreview } from '../MailPreview/MailPreview';

export function MailList({
  mails,
  onRemoveMail,
  params,
  toggleStar,
  handleOpenState,
  onSetIsUnread,
}) {
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
              handleOpenState={handleOpenState}
              onSetIsUnread={onSetIsUnread}
              toggleStar={toggleStar}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
