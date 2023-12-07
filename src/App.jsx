import { Route, HashRouter as Router, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { AppHeader } from "./components/AppHeader";
import { About } from "./pages/About";
import { EmailDetails } from "./pages/EmailDetails";
import { EmailIndex } from "./pages/EmailIndex";
export function App() {
  return (
    <Router>
      <section className="main-app">
        <AppHeader />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/email" element={<EmailIndex />} />
            <Route path="/email/:emailId" element={<EmailDetails />} />
          </Routes>
        </main>

        <footer>
          <section className="container">Mister Email 2023</section>
        </footer>
      </section>
    </Router>
  );
}
