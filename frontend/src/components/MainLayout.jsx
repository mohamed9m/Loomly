import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./Navbar";

function MainLayout() {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <NavBar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
