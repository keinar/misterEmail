import { Route, HashRouter, Routes } from 'react-router-dom';
import { MailDetails } from './cmps/MailDetails/MailDetails';
import { MailIndex } from './pages/MailIndex';
import { HomePage } from './pages/HomePage';
import { AboutUs } from './pages/AboutUs';
import { UserMsg } from './cmps/UserMsg/UserMsg';

export function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/:folder" element={<MailIndex />}>
          <Route path="/:folder/:mailId" element={<MailDetails />} />
        </Route>
      </Routes>
      <UserMsg />
    </HashRouter>
  );
}
