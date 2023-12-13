import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { AppHeader } from "./components/AppHeader";
import { EmailDetails } from "./components/EmailDetails";
import { EmailIndex } from "./pages/EmailIndex";
import { useState } from "react";
import { emailService } from "./services/email.service";
import { AppFooter } from "./components/AppFooter";

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
            <Route
              path="/"
              element={
                <EmailIndex
                  filterBy={filterBy}
                  isMenuVisible={isMenuVisible}
                  toggleMenu={toggleMenu}
                />
              }
            >
              <Route path="/email/:emailId" element={<EmailDetails />} />
            </Route>
          </Routes>
        </main>

        <AppFooter />
      </section>
    </Router>
  );
}
