// src/app/page.js (Main Page - Dashboard Only)
'use client';
import './globals.css';
import Dashboard from '@/components/Dashboard';

export default function MainPage() {
  return (
    <div className="main-container">
      <h1>NerdBlock Management System</h1>
      <Dashboard />
    </div>
  );
}
