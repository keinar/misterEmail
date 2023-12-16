import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import { AppHeader } from "./components/AppHeader";
import { EmailDetails } from "./components/EmailDetails";
import { EmailIndex } from "./pages/EmailIndex";
import { useState } from "react";
import { emailService } from "./services/email.service";
import { AppFooter } from "./components/AppFooter";
import { EmailComposeModal } from "./components/EmailComposeModal";

export function App() {
  const [filterBy, setFilterBy] = useState(emailService.getDefaultFilter());
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const onSetFilter = (newFilter) => {
    setFilterBy(newFilter);
  };

  return (
    <Router>
      <section className="main-app">
        <AppHeader
          filterBy={filterBy}
          onSetFilter={onSetFilter}
          toggleMenu={toggleMenu}
        />
        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate replace to="/inbox" />} />
            <Route
              path="/:folder"
              element={
                <EmailIndex
                  filterBy={filterBy}
                  isMenuVisible={isMenuVisible}
                  toggleMenu={toggleMenu}
                />
              }
            >
              <Route path="/:folder/:emailId" element={<EmailDetails />} />
              {/* <Route path="/:folder/compose" element={<EmailComposeModal />} /> */}
            </Route>
          </Routes>
        </main>

        <AppFooter />
      </section>
    </Router>
  );
}
