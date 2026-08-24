import React, { useState, Component } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { Home } from './pages/Home';
import { Datasets } from './pages/Datasets';
import { TrainML } from './pages/TrainML';
import { Evaluation } from './pages/Evaluation';
import { ExploitSandbox } from './pages/ExploitSandbox';
import { Reports } from './pages/Reports';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// ErrorBoundary to ensure zero blank screen occurrences
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0a0e17] text-white p-6 font-mono">
          <div className="max-w-lg w-full p-8 rounded-2xl bg-slate-900 border border-rose-500/40 text-center space-y-4 shadow-2xl">
            <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto animate-bounce" />
            <h2 className="text-xl font-bold text-white">Temporary Component Reset</h2>
            <p className="text-xs text-slate-400">
              {this.state.error?.message || "An interface state reset occurred."}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-cyan-400 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reload Interface</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [user, setUser] = useState({
    username: 'admin',
    role: 'Admin',
    email: 'admin@cloudids.local'
  });

  const handleLogout = () => {
    setUser(null);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} />;
      case 'datasets':
        return <Datasets setCurrentPage={setCurrentPage} />;
      case 'train':
        return <TrainML setCurrentPage={setCurrentPage} />;
      case 'graphs':
        return <Evaluation />;
      case 'sandbox':
        return <ExploitSandbox />;
      case 'reports':
        return <Reports />;
      default:
        return <Home setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-[#0a0e17] text-slate-100 selection:bg-cyan-500 selection:text-black">
        {/* Top Streamlined Navbar */}
        <Navbar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          user={user}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderPage()}
        </main>

        {/* Footer */}
        <Footer />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={(userData) => setUser(userData)}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;
