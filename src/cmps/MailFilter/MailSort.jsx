import { ChevronDown, ChevronUp } from 'lucide-react';
import { ReadDropdown } from '../Common/ReadDropdown';

export function MailSort({ onToggleSortByDate, isAscending, mails, setMails }) {
  return (
    <div className="flex align-center">
      <button className="simple-button" onClick={onToggleSortByDate}>
        Date
        {isAscending ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      <ReadDropdown mails={mails} setMails={setMails} />
    </div>
  );
}
