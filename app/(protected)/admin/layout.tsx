import Navbar from "./_components/navbar";
import SideNav from "./_components/sidenav";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="h-screen w-full flex">
      <SideNav />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <div className="flex flex-grow items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
