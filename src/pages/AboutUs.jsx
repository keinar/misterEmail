import { RightNav } from '../cmps/SideNav/RightNav';

export function AboutUs() {
  return (
    <div className="flex space-between">
      <div className="container">
        <h1>About Us</h1>
        <p>Author: Keinar Elkayam</p>
      </div>
      <RightNav />
    </div>
  );
}
