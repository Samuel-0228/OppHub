import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { OpportunityDetail } from './pages/OpportunityDetail';
import { WeeklyDigest } from './pages/WeeklyDigest';
import { Dashboard } from './pages/Dashboard';
import { Admin } from './pages/Admin';
import { BlogPage } from './pages/BlogPage';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="opp-theme">
      <Router>
        <div className="flex flex-col min-h-screen transition-colors duration-300">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/opportunity/:id" element={<OpportunityDetail />} />
              <Route path="/digest" element={<WeeklyDigest />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/blog/:id" element={<BlogPage />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-center" expand={true} richColors />
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;