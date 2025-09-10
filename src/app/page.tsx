'use client';

import { useApp } from '@/context/AppContext';
import { Dashboard } from '@/components/Dashboard';
import { WelcomeScreen } from '@/components/WelcomeScreen';
import { ReturningUserHomepage } from '@/components/ReturningUserHomepage';

export default function Home() {
  const { state } = useApp();

  // No groups exist - show welcome screen for first-time users
  if (state.groups.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <WelcomeScreen />
      </main>
    );
  }

  // Groups exist but none selected - show returning user homepage
  if (!state.currentGroup) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <ReturningUserHomepage />
      </main>
    );
  }

  // Group is selected - show dashboard
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Dashboard />
    </main>
  );
}
