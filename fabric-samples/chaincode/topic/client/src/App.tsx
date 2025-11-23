import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from '@/pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { RegisterTopicPage } from '@/pages/RegisterTopicPage';
import { TopicDetailPage } from '@/pages/TopicDetailPage';
import { BlockchainExplorerPage } from '@/pages/BlockchainExplorerPage';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/topics/register"
          element={
            <ProtectedRoute>
              <RegisterTopicPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/topics/:topicId"
          element={
            <ProtectedRoute>
              <TopicDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/blockchain-explorer"
          element={
            <ProtectedRoute>
              <BlockchainExplorerPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
