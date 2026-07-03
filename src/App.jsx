import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import StudentDashboard from './pages/student/Dashboard'
import DepartmentEvents from './pages/student/DepartmentEvents'
import CollegeEvents from './pages/student/CollegeEvents'
import EventDetails from './pages/student/EventDetails'
import MyRegistrations from './pages/student/MyRegistrations'
import StudentProfile from './pages/student/Profile'
import CoordinatorDashboard from './pages/coordinator/Dashboard'
import CreateEvent from './pages/coordinator/CreateEvent'
import ManageEvents from './pages/coordinator/ManageEvents'
import Participants from './pages/coordinator/Participants'
import CoordinatorProfile from './pages/coordinator/CoordinatorProfile'

function ProtectedRoute({ children, role }) {
  const { currentUser, userProfile } = useAuth()
  if (!currentUser) return <Navigate to="/login" />
  if (role && userProfile?.role !== role) return <Navigate to="/login" />
  return children
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={
            <ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>
          } />
          <Route path="/student/department-events" element={
            <ProtectedRoute role="student"><DepartmentEvents /></ProtectedRoute>
          } />
          <Route path="/student/college-events" element={
            <ProtectedRoute role="student"><CollegeEvents /></ProtectedRoute>
          } />
          <Route path="/student/event/:id" element={
            <ProtectedRoute role="student"><EventDetails /></ProtectedRoute>
          } />
          <Route path="/student/my-registrations" element={
            <ProtectedRoute role="student"><MyRegistrations /></ProtectedRoute>
          } />
          <Route path="/student/profile" element={
            <ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>
          } />

          {/* Coordinator Routes */}
          <Route path="/coordinator/dashboard" element={
            <ProtectedRoute role="coordinator"><CoordinatorDashboard /></ProtectedRoute>
          } />
          <Route path="/coordinator/create-event" element={
            <ProtectedRoute role="coordinator"><CreateEvent /></ProtectedRoute>
          } />
          <Route path="/coordinator/manage-events" element={
            <ProtectedRoute role="coordinator"><ManageEvents /></ProtectedRoute>
          } />
          <Route path="/coordinator/participants" element={
            <ProtectedRoute role="coordinator"><Participants /></ProtectedRoute>
          } />
          <Route path="/coordinator/profile" element={
            <ProtectedRoute role="coordinator"><CoordinatorProfile /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App