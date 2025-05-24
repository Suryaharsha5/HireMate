import { useState, useEffect } from "react";
import { usercontext } from "./userLoginContext";

function UserLoginStore({ children }) {
  const [curruser, setCurruser] = useState(JSON.parse(localStorage.getItem('currentUser')) || {});
  const [loginStatus, setLoginStatus] = useState(!!localStorage.getItem('currentUser'));
  const [err, setErr] = useState('');

  async function onSubmit(data) {
    const {username,password,role}=data;
    try {
        const endpoint =
        role === 'freelancer'
          ? 'https://hire-mate-mcte.vercel.app/user-api/login-1'
          : 'https://hire-mate-mcte.vercel.app/user-api/login-2'; 
        const res = await fetch(
        endpoint,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(data),
        
        }
      );
      let result = await res.json();
      if (result.message === 'Login successful') {
        setCurruser(result.user);
        setLoginStatus(true);
        setErr('');
        localStorage.setItem('currentUser', JSON.stringify(result.user)); // Store user in localStorage
        localStorage.setItem('token', result.token); // Store token in localStorage
      } else {
        setErr(result.message);
        setCurruser({});
        setLoginStatus(false);
        localStorage.removeItem('currentUser'); // Clean up on failure
      }
    } catch (error) {
      setErr('An error occurred. Please try again.');
    }
  }

  function logout() {
    setCurruser({});
    setLoginStatus(false);
    setErr('');
    localStorage.removeItem('currentUser'); 
    localStorage.removeItem('token'); 
  }

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurruser(storedUser);
      setLoginStatus(true);
    }
  },[]);

  return (
    <usercontext.Provider value={{ onSubmit, logout, loginStatus, err, curruser, setCurruser }}>
      {children}
    </usercontext.Provider>
  );
}

export default UserLoginStore;
