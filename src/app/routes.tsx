import { createBrowserRouter, Navigate } from 'react-router';
import { PublicLayout } from './components/PublicLayout';
import { MentorLayout } from './components/MentorLayout';
import { AdminLayout } from './components/AdminLayout';
import { NotFound } from './components/NotFound';
import { Dashboard } from './pages/Dashboard';
import { MentorList } from './pages/MentorList';
import { InternList } from './pages/InternList';
import { InternDetail } from './pages/InternDetail';
import { AddIntern } from './pages/AddIntern';
import { Gallery } from './pages/Gallery';
import { Login } from './pages/Login';
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { ApprovalPage } from './pages/mentor/ApprovalPage';
import { MentorInterns } from './pages/mentor/MentorInterns';
import { MentorStatistics } from './pages/mentor/MentorStatistics';
import { MentorProfile } from './pages/mentor/MentorProfile';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MentorManagement } from './pages/admin/MentorManagement';
import { InternManagement } from './pages/admin/InternManagement';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'mentor', Component: MentorList },
      { path: 'intern', Component: InternList },
      { path: 'intern/tambah', Component: AddIntern },
      { path: 'intern/:id', Component: InternDetail },
      { path: 'gallery', Component: Gallery },
      { path: 'login', Component: Login },
    ],
  },
  {
    path: '/mentor',
    Component: MentorLayout,
    children: [
      { path: 'dashboard', Component: MentorDashboard },
      { path: 'approval', Component: ApprovalPage },
      { path: 'interns', Component: MentorInterns },
      { path: 'statistics', Component: MentorStatistics },
      { path: 'profile', Component: MentorProfile },
    ],
  },
  {
    path: '/admin/login',
    Component: AdminLogin,
  },
  {
    path: '/admin',
    Component: AdminLayout,
    children: [
      { path: 'dashboard', Component: AdminDashboard },
      { path: 'mentors', Component: MentorManagement },
      { path: 'interns', Component: InternManagement },
    ],
  },
  { path: '*', Component: NotFound },
]);