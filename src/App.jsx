import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { AppHeader } from "./components/AppHeader";
import { About } from "./pages/About";
import { EmailInbox } from "./pages/EmailInbox";
import { EmailDetails } from "./pages/EmailDetails";
export function App() {
  return (
    <Router>
      <section className="main-app">
        <AppHeader />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/email-inbox" element={<EmailInbox />} />
            <Route path="/email-inbox/:emailId" element={<EmailDetails />} />
          </Routes>
        </main>

        <footer>
          <section className="container">Mister Email 2023</section>
        </footer>
      </section>
    </Router>
  );
}
