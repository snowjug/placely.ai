import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DashboardHome from './pages/DashboardHome';
import PracticeArena from './pages/PracticeArena';
import ResumeFeedback from './pages/ResumeFeedback';
import MCQQuiz from './pages/MCQQuiz';
import Experiences from './pages/Experiences';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="practice" element={<PracticeArena />} />
          <Route path="resume" element={<ResumeFeedback />} />
          <Route path="quiz" element={<MCQQuiz />} />
          <Route path="experiences" element={<Experiences />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
