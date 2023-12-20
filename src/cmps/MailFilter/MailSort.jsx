import { ChevronDown, ChevronUp } from 'lucide-react';

export function MailSort({ onToggleSortByDate, isAscending }) {
  return (
    <thead className="flex">
      <tr>
        <th>
          <button className="simple-button" onClick={onToggleSortByDate}>
            Date
            {isAscending ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </th>
      </tr>
    </thead>
  );
}
