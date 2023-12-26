import { MailSort } from '../MailFilter/MailSort';
import { MailPreview } from '../MailPreview/MailPreview';

export function MailList({
  mails,
  onRemoveMail,
  onToggleSortByDate,
  isAscending,
  params,
  toggleStar,
  onHover,
  handleMouseEnter,
  handleMouseLeave,
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
              onHover={onHover === mail.id}
              handleMouseEnter={() => handleMouseEnter(mail.id)}
              handleMouseLeave={handleMouseLeave}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
