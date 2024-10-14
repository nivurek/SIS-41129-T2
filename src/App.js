import './App.css';
import './styles/globals.css';
import React, { useState, useEffect } from 'react';
import NavbarComponent from './pages/Navbar/components/NavbarComponent';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import LoginPage from './pages/Login/LoginPage';
import AIPage from './pages/AI/AIPage';

import backgroundBanner from './assets/background_banner.png'; 
import PrimaryScreenshotPage from './pages/PrimaryScreenshot/PrimaryScreenshotPage';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';


const About = () => <h1>About Us</h1>;
const Services = () => <h1>Our Services</h1>;
const Contact = () => <h1>Contact Us</h1>;

const AppContent = ({ loggedInUser, userObjects, handleLogout, handleLogin }) => {
  const location = useLocation();
  const isLoginPage = ['/login'].includes(location.pathname);
  console.log("isloginpage?", isLoginPage);


  const isAuth = loggedInUser !== null;
  const activeUser = (loggedInUser && loggedInUser.Name) ?? "";

  return (
    <PrimeReactProvider>
      <div
        className="App"
        style={{
          backgroundImage: isLoginPage ? `url(${backgroundBanner})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: '10% center',
          height: '100%',
          width: '100%',
        }}
      >
        {!isLoginPage ? (
          <>
            <NavbarComponent authorised={isAuth} activeUser={activeUser} onLogoutMethod={handleLogout} />
            <div className="content-container">
              <Routes>
                <Route path="/" element={<PrimaryScreenshotPage authorised={isAuth}/>} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/ai" element={<AIPage/>} />
              </Routes>
            </div>
          </>
        ) : (
          <div>
            <Routes>
              <Route path="/login" element={<LoginPage userData={userObjects} handleLogin={handleLogin} />} />
            </Routes>
          </div>
        )}
      </div>
    </PrimeReactProvider>
  );
};

function App() {
  const [userData, setUserData] = useState();

  // State to store the logged-in user's data
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Function to handle successful login
  const handleLogin = (userData) => {
    console.log("Login successful!", userData);
    setLoggedInUser(userData);
  };

  const handleLogout = (userData) => {
    console.log("Logout successful!", userData);
    setLoggedInUser(null);
  };

  useEffect(() => {
    fetch('./testdata.json')
      .then((response) => response.json())  // Parse the JSON data
      .then((jsonData) => {
        setUserData(jsonData);  // Update state with the JSON data
      })
      .catch((error) => {
        console.error("Error fetching the JSON data: ", error);
      });
  }, []);

  let userObjects = {};
  for (let key in userData) {
    userObjects[userData[key].Address] = userData[key];
  }

  return (
    <Router>
      <AppContent
        loggedInUser={loggedInUser}
        userObjects={userObjects}
        handleLogout={handleLogout}
        handleLogin={handleLogin}
      />
    </Router>
  );
}

export default App;