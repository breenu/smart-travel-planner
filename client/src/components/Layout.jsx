import Sidebar from './Sidebar';

export default function Layout({ children, bgClass = 'bg-beige' }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className={`ml-[150px] flex-1 ${bgClass}`}>
        {children}
      </main>
    </div>
  );
}
