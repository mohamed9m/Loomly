import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";

function MainLayout() {
  const location = useLocation();

  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="flex-grow-1">
        <Outlet />
      </main>

      {!(
        location.pathname.startsWith("/checkout") ||
        location.pathname === "/register" ||
        location.pathname === "/login"
      ) && <Footer />}
    </div>
  );
}

export default MainLayout;
