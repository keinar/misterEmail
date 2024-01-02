import React, { useEffect, useState } from 'react';

export function ReadDropdown({ mails, setMails }) {
  const [selectedOption, setSelectedOption] = useState('All');
  const [originalMails, setOriginalMails] = useState([]);

  useEffect(() => {
    setOriginalMails(mails);
  }, []);

  const handleSelectedOption = e => {
    setSelectedOption(e.target.value);

    if (e.target.value === 'Read') {
      setMails(originalMails.filter(mail => mail.isRead));
    } else if (e.target.value === 'Unread') {
      setMails(originalMails.filter(mail => !mail.isRead));
    } else {
      setMails(originalMails);
    }
  };

  return (
    <div>
      <select
        className="simple-button"
        value={selectedOption}
        onChange={handleSelectedOption}
      >
        <option value="All">All</option>
        <option value="Read">Read</option>
        <option value="Unread">Unread</option>
      </select>
    </div>
  );
}
