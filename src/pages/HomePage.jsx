import { RightNav } from '../cmps/SideNav/RightNav';
import logo from '../assets/imgs/logoMe.png';

export function HomePage() {
  return (
    <div className="flex space-between">
      <div className="container home-page">
        <h1 className="text-center">Welcome to Mister Email</h1>
        <img src={logo} alt="mister mail"></img>
      </div>
      <RightNav />
    </div>
  );
}
