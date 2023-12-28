import { MailSort } from '../MailFilter/MailSort';
import { MailPreview } from '../MailPreview/MailPreview';

export function MailList({
  mails,
  onRemoveMail,
  onToggleSortByDate,
  isAscending,
  params,
  toggleStar,
  handleOpenState,
  onSetIsUnread,
}) {
  return (
    <>
      <table className="mail-list">
        {mails.length > 1 && (
          <MailSort
            mails={mails}
            onToggleSortByDate={onToggleSortByDate}
            isAscending={isAscending}
          />
        )}
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
