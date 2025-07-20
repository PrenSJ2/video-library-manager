import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { VideoProvider } from './contexts/VideoContext';
import { Header } from './components/Header';
import { VideoListPage } from './pages/VideoListPage';
import { CreateVideoPage } from './pages/CreateVideoPage';
import { IdeaGeneratorPage } from './pages/IdeaGeneratorPage';

function App() {
  return (
    <VideoProvider>
      <HashRouter>
        <Header />
        <main className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
          <Routes>
            <Route path="/" element={<VideoListPage />} />
            <Route path="/create" element={<CreateVideoPage />} />
            <Route path="/ideas" element={<IdeaGeneratorPage />} />
          </Routes>
        </main>
      </HashRouter>
    </VideoProvider>
  );
}

export default App;