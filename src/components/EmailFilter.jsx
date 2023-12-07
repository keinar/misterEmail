import { useEffect, useState } from "react";

export function EmailFilter({ filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState(filterBy);

  function handleChange(ev) {
    let { name: field, value, type } = ev.target;
    if (type === "number") value = +value;
    setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }));
  }

  useEffect(() => {
    onSetFilter(filterByToEdit);
  }, [filterByToEdit]);

  const { subject } = filterByToEdit;

  console.log(filterByToEdit);

  return (
    <form className="email-filter">
      <label htmlFor="search">Search</label>

      <input
        onChange={handleChange}
        id="search"
        value={subject}
        name="search"
        type="text"
      />
    </form>
  );
}
