import { Route, HashRouter, Routes } from 'react-router-dom';
import { EmailDetails } from './cmps/MailDetails/MailDetails';
import { MailIndex } from './pages/MailIndex';
import { HomePage } from './pages/HomePage';
import { AboutUs } from './pages/AboutUs';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/:folder" element={<MailIndex />}>
          <Route path="/:folder/:emailId" element={<EmailDetails />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
