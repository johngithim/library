import Navigation from "@/components/Navigation.jsx";
import { Outlet } from "react-router";

const ProtectedRoute = () => {
  return (
    <div className={"flex"}>
      <div className={"flex-2 ring-1 ring-slate-200 min-h-screen"}>
        <Navigation />
      </div>
      <div className={"flex-11 min-h-screen"}>
        <Outlet />
      </div>
    </div>
  );
};
export default ProtectedRoute;
