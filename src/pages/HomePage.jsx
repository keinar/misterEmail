import { RightNav } from '../cmps/SideNav/RightNav';

export function HomePage() {
  return (
    <div className="flex space-between">
      <div className="container">
        <h1>Welcome to Gmail</h1>
      </div>
      <RightNav />
    </div>
  );
}
