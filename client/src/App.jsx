import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar/Sidebar";

export default function App() {
  return (
    <div className="app">
      <Sidebar />
      <main className="conteudo">
        <Outlet />
      </main>
    </div>
  );
}