import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";
import { useState } from "react";
import { mailService } from "./services/mailService";
import { Header } from "./cmps/Layout/Header";
import { Footer } from "./cmps/Layout/Footer";
import { EmailDetails } from "./cmps/MailDetails/MailDetails";
import { MailIndex } from "./pages/MailIndex";

export function App() {
  const [filterBy, setFilterBy] = useState(mailService.getDefaultFilter());
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
        <Header
          filterBy={filterBy}
          onSetFilter={onSetFilter}
          toggleMenu={toggleMenu}
        />
        <main className="container">
          <Routes>
            <Route
              path="/:folder"
              element={
                <MailIndex
                  filterBy={filterBy}
                  isMenuVisible={isMenuVisible}
                  toggleMenu={toggleMenu}
                />
              }
            >
              <Route path="/:folder/:emailId" element={<EmailDetails />} />
            </Route>
          </Routes>
        </main>

        <Footer />
      </section>
    </Router>
  );
}
