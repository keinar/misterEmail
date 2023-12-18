import { ChevronDown, ChevronUp } from 'lucide-react';

export function MailSort({ onToggleSortByDate, isAscending }) {
  return (
    <thead className="email-filters">
      <tr>
        <th>
          <button className="modern-button" onClick={onToggleSortByDate}>
            Date
            {isAscending ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </th>
      </tr>
    </thead>
  );
}
