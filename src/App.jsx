import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PasteViewPage from './pages/PasteViewPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/p/:id" element={<PasteViewPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;