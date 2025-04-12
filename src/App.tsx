
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Index from './pages/Index';
import Game from './pages/Game';
import NotFound from './pages/NotFound';
import { Toaster } from './components/ui/toaster';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;
