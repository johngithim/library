import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "@/components/ProtectedRoute.jsx";
import Dashboard from "@/components/Dashboard.jsx";
import AddBook from "@/components/AddBook.jsx";
import AddStudent from "@/components/AddStudent.jsx";
import Analytics from "@/components/Analytics.jsx";
import Chart from "@/components/Chart.jsx";
import EditBook from "@/components/EditBook.jsx";
import IssueBook from "@/components/IssueBook.jsx";
import ReturnBook from "@/components/ReturnBook.jsx";
import StudentsList from "@/components/StudentsList.jsx";
import Header from "@/components/Header.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path={"/"} element={<Navigate to="/dashboard" />} />
        <Route element={<ProtectedRoute />}>
          <Route path={"/dashboard"} element={<Dashboard />} />
          <Route path={"/addBook"} element={<AddBook />} />
          <Route path={"/addStudent"} element={<AddStudent />} />
          <Route path={"/analytics"} element={<Analytics />} />
          <Route path={"/chart"} element={<Chart />} />
          <Route path={"/editBook"} element={<EditBook />} />
          <Route path={"/issueBook"} element={<IssueBook />} />
          <Route path={"/returnBook"} element={<ReturnBook />} />
          <Route path={"/studentsList"} element={<StudentsList />} />
          <Route path={"*"} elements={<Navigate to={"/"} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default App;
