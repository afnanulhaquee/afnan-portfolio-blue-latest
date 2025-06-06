import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Portfolio from './pages/Portfolio';
import Experience from './pages/Experience';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import Certificates from './pages/Certificates';
import Achievements from './pages/Achievements';
import Testimonials from './pages/Testimonials';
import { SupabaseProvider } from './context/SupabaseContext';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import CertificateDetail from './components/CertificateDetail';

function App() {
  return (
    <ThemeProvider>
      <SupabaseProvider>
        <AuthProvider>
          <NotificationProvider>
            <Router>
              <Layout>
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/experience" element={<Experience />} />
                    <Route path="/certificates" element={<Certificates />} />
                    <Route path="/certificates/:id" element={<CertificateDetail />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AnimatePresence>
              </Layout>
            </Router>
          </NotificationProvider>
        </AuthProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}

export default App;