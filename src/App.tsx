import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NavBarDemo } from './components/ui/tubelight-navbar.demo';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Statistics } from './components/Statistics';
import { PlatformSupport } from './components/PlatformSupport';
import { Testimonials } from './components/Testimonials';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Dashboard } from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import { supabase } from './lib/supabase';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/login" element={!session ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/signup" element={!session ? <Signup /> : <Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/" element={
            <div>
              <NavBarDemo />
              <Hero />
              <Features />
              <Statistics />
              <PlatformSupport />
              <Testimonials />
              <Pricing />
              <FAQ />
              <Footer />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;