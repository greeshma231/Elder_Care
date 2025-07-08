import React, { useState } from 'react';
import { AuthForm } from './components/AuthForm';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);

  return (
    <div className="min-h-screen font-opensans bg-gray-100">
      {!user ? (
        <AuthForm setUser={setUser} />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.username}!
          </h1>
        </div>
      )}
    </div>
  );
};

export default App;
