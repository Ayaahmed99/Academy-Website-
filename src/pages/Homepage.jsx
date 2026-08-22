import React, { useState, useEffect } from "react";
import { 
  X, 
  ArrowRight, 
  Clock, 
  Users, 
  Wifi, 
  Check, 
  Home as HomeIcon, 
  BookOpen, 
  UserCheck, 
  Calendar, 
  FileText 
} from "lucide-react";

// Self-contained page components
import ApplyPage from "./Application_Form";
import InstructorsPage from "./Instructors";
import LevelTestPage from "./Level_Test";
import SessionsPage from "./Sessions";
import BookingPage from "./Booking";

// Inline Logo fallback (can be swapped for an imported asset later)
const LOGO_SRC = "data:image/png;base64,..."; 

export default function AppRouter() {
  const [currentRoute, setCurrentRoute] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentRoute]);

  // Navigation items mapping
  const navItems = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "sessions", label: "Sessions", icon: Clock },
    { id: "instructors", label: "Instructors", icon: Users },
    { id: "level-test", label: "Level Test", icon: BookOpen },
    { id: "booking", label: "Booking", icon: Calendar },
    { id: "apply", label: "Apply Now", icon: FileText, primary: true },
  ];

  // Render the active component based on state
  const renderActivePage = () => {
    switch (currentRoute) {
      case "apply":
        return <ApplyPage />;
      case "instructors":
        return <InstructorsPage />;
      case "level-test":
        return <LevelTestPage />;
      case "sessions":
        return <SessionsPage />;
      case "booking":
        return <BookingPage />;
      case "home":
      default:
        return (
          <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-3xl mx-auto space-y-6">
              <span className="px-3 py-1 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 rounded-full">
                Welcome to Bright Path
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                Unlock Your Potential with Expert-Led Learning
              </h1>
              <p className="text-lg text-slate-600 max-w-xl mx-auto">
                Explore interactive sessions, connect with industry mentors, and take your skills to the next level.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <button
                  onClick={() => setCurrentRoute("apply")}
                  className="inline-flex items-center gap-2 px-6 py-3 font-medium text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentRoute("level-test")}
                  className="inline-flex items-center gap-2 px-6 py-3 font-medium text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all"
                >
                  Take Level Test
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800 antialiased font-sans">
      {/* Global Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <button 
            onClick={() => setCurrentRoute("home")}
            className="flex items-center gap-3 focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md group-hover:bg-blue-700 transition-colors">
              BP
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Bright Path
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              
              if (item.primary) {
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentRoute(item.id)}
                    className="ml-4 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl shadow-sm hover:bg-blue-700 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentRoute(item.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      - ? "text-blue-600 bg-blue-50/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round5" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentRoute(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 bg-blue-50 font-semibold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        {renderActivePage()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-8 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Bright Path. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => setCurrentRoute("home")} className="hover:text-slate-900 transition-colors">Privacy Policy</button>
            <button onClick={() => setCurrentRoute("home")} className="hover:text-slate-900 transition-colors">Terms of Service</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
