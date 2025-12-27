import { Routes, Route, Navigate } from 'react-router-dom';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  CreateRoomPage,
  JoinRoomPage,
  LobbyPage
} from './pages';
import { ProtectedRoute } from './components/common';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-room"
        element={
          <ProtectedRoute>
            <CreateRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/join-room"
        element={
          <ProtectedRoute>
            <JoinRoomPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/lobby/:roomCode"
        element={
          <ProtectedRoute>
            <LobbyPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
