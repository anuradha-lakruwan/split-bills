'use client';

import { useApp } from '@/context/AppContext';
import { Dashboard } from '@/components/Dashboard';
import { WelcomeScreen } from '@/components/WelcomeScreen';

export default function Home() {
  const { state } = useApp();

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {state.groups.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <Dashboard />
      )}
    </main>
  );
}
