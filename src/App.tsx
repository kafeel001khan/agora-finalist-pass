import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { FinalistPassCreator } from "./components/FinalistPassCreator";

const PassPage = lazy(() => import("./pages/PassPage").then((m) => ({ default: m.PassPage })));

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <main className="app-shell">
        <Suspense fallback={<p className="hero-subtitle">Loading…</p>}>
          <Routes>
            <Route path="/" element={<FinalistPassCreator />} />
            <Route path="/pass/:passId" element={<PassPage />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
}
