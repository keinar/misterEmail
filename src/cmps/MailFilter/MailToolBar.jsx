import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from 'lucide-react';
import { ReadDropdown } from '../Common/ReadDropdown';
import { Pagination } from '../Layout/Pagination';

export function MailToolBar({
  onToggleSortByDate,
  isAscending,
  mails,
  setMails,
  currentPage,
  setCurrentPage,
  mailsPerPage,
}) {
  return (
    <div className="mail-toolbar">
      <button className="simple-button" onClick={onToggleSortByDate}>
        Date
        {isAscending ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      <ReadDropdown mails={mails} setMails={setMails} />

      <div className="pagination">
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          mailsPerPage={mailsPerPage}
          mails={mails}
        />
      </div>
    </div>
  );
}
