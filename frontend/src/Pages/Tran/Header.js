import React from 'react';  
import { useNavigate, NavLink, useLocation } from 'react-router-dom'; 
import { useEffect, useState } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import './RecentTra.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = () => navigate('/login');
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <Navbar style={{ backgroundColor: "#000", marginRight: '-5px'}} variant="dark" expand="md" className="history p-2 w-100">
      <Container fluid>
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
          <i className="fas fa-th-large me-2" aria-hidden="true"></i>
          Expense Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <NavLink to="/home" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Dashboard
            </NavLink>
            <NavLink to="/recent" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Recent Transactions
            </NavLink>
            <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Analytics
            </NavLink>
            {user ? (
              <Button variant="outline-light" size="sm" onClick={handleLogout} className="ms-3">
                <i className="bi bi-box-arrow-right me-1"></i>Logout
              </Button>
            ) : (
              <Button variant="outline-light" size="sm" onClick={handleLogin} className="ms-3">
                <i className="bi bi-box-arrow-in-right me-1"></i>Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;