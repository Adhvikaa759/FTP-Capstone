import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/auth/ProtectedRoute.jsx';
import Layout from './components/layout/Layout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DirectoryPage from './pages/DirectoryPage.jsx';
import MemberDetailPage from './pages/MemberDetailPage.jsx';
import AddMemberPage from './pages/AddMemberPage.jsx';
import EditMemberPage from './pages/EditMemberPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<DirectoryPage />} />
              <Route path="members/:id" element={<MemberDetailPage />} />
              <Route path="members/new" element={<ProtectedRoute adminOnly><AddMemberPage /></ProtectedRoute>} />
              <Route path="members/:id/edit" element={<ProtectedRoute adminOnly><EditMemberPage /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
