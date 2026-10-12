import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from './ProtectedRoute';

import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { FormListPage } from '../pages/forms/FormListPage';
import { FormBuilderPage } from '../pages/forms/FormBuilderPage';
import { PublicFormPage } from '../pages/forms/PublicFormPage';
import { FormResponsesPage } from '../pages/forms/FormResponsesPage';
import { AllResponsesPage } from '../pages/responses/AllResponsesPage';
import { AnalyticsPage } from '../pages/analytics/AnalyticsPage';
import { ActivityLogsPage } from '../pages/logs/ActivityLogsPage';

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        <Route path="/forms/public/:formId" element={<PublicFormPage />} />

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/forms" element={<FormListPage />} />
          <Route path="/forms/new" element={<FormBuilderPage />} />
          <Route path="/forms/:formId/edit" element={<FormBuilderPage />} />
          <Route path="/responses" element={<AllResponsesPage />} />
          <Route path="/forms/:formId/responses" element={<FormResponsesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/logs" element={<ActivityLogsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};