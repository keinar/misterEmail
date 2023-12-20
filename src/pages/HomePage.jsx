import { RightNav } from '../cmps/SideNav/RightNav';

export function HomePage() {
  return (
    <div className="flex space-between">
      <h1>Welcome to Gmail</h1>
      <RightNav />
    </div>
  );
}
