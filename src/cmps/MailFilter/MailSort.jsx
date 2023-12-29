import { ChevronDown, ChevronUp, X } from 'lucide-react';

export function MailSort({ onToggleSortByDate, isAscending }) {
  return (
    <div className="flex">
      <button className="simple-button" onClick={onToggleSortByDate}>
        Date
        {isAscending ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>
    </div>
  );
}
