import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateInvitation from './pages/CreateInvitation';
import Invitation from './pages/Invitation';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create" element={<CreateInvitation />} />
        </Route>
        
        {/* Client View Route */}
        <Route path="/undangan/:slug" element={<Invitation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
