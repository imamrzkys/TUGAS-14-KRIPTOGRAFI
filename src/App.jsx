import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Simulator from './pages/Simulator';
import Docs from './pages/Documentation';

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"         element={<PageTransition><Home /></PageTransition>} />
        <Route path="/simulator" element={<PageTransition><Simulator /></PageTransition>} />
        <Route path="/docs"     element={<PageTransition><Docs /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen" style={{ background: '#FFF5FB', color: '#1A1A2E' }}>
        <Navbar />
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}
