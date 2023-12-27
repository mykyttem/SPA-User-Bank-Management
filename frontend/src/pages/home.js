import React from 'react';
import { Link } from 'react-router-dom';


const Home = () => {

  const containerStyle = {
    display: 'flex',
    marginleft: '50px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  };

  return (
    <div style={containerStyle}>
      <Link to="/users" className="link">
        Go to Users
      </Link>
      <Link to="/banks" className="link">
        Go to Banks
      </Link>
    </div>
  );
};


export default Home;