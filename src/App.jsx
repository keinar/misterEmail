import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { AppHeader } from "./components/AppHeader";
import { EmailDetails } from "./components/EmailDetails";
import { EmailIndex } from "./pages/EmailIndex";
import { useState } from "react";
import { emailService } from "./services/email.service";
export function App() {
  const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());

  const onSetFilter = (newFilter) => {
    setFilterBy(newFilter);
  };

  return (
    <Router>
      <section className="main-app">
        <AppHeader filterBy={filterBy} onSetFilter={onSetFilter} />
        <main className="container">
          <Routes>
            <Route path="/" element={<EmailIndex filterBy={filterBy} />}>
              <Route path="/email/:emailId" element={<EmailDetails />} />
            </Route>
          </Routes>
        </main>

        <footer>
          <section className="container">Mister Email 2023</section>
        </footer>
      </section>
    </Router>
  );
}
