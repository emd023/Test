import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import UploadPage from './pages/UploadPage';
import DraftsList from './pages/DraftsList';
import DraftDetail from './pages/DraftDetail';
import SharedAnalysis from './pages/SharedAnalysis';

function App() {
  return (
    <Router>
      <Routes>
        {/* Shared analysis route - no layout */}
        <Route path="/share/:token" element={<SharedAnalysis />} />
        
        {/* Main app routes with layout */}
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/drafts" element={<DraftsList />} />
              <Route path="/drafts/:id" element={<DraftDetail />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;