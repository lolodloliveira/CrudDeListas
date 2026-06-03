import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "../App";
import Dashboard from "../pages/Dashboard/Dashboard";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Rota inicial */}
          <Route index element={<Dashboard />} />
          {/* Rota para listas selecionadas, usando o mesmo Dashboard */}
          <Route path="lista/:id" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}