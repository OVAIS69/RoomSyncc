import React from 'react';
import { AuthProvider } from './context/AuthContext';
import RoomSync from './components/RoomSync';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <RoomSync />
      </div>
    </AuthProvider>
  );
}

export default App;
