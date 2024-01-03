import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import "./HomePage.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  
  const history = useHistory();

  useEffect(() => {
      const user = JSON.parse(localStorage.getItem('userInfo'));

      if (user) history.push('/tasks');
  }, [history]);

  const [signupFormData, setSignupFormData] = useState({
    name: "",
    email: "",
    password: "",
    // picture: null,
  });

  const [loginFormData, setLoginFormData] = useState({
    email: "",
    password: "",
  });

  const [showSignupForm, setShowSignupForm] = useState(true);

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    const { name, email, password } = signupFormData;

    if (!name || !email || !password) {
      toast.error("Please enter all required fields");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        }
      };
      await axios.post("/user", { name, email, password }, config)
      toast.success("User created successfully");
      setShowSignupForm(false);
    } catch (error) {
      toast.error(error.response.data.Error);
    }
    setSignupFormData({
      name: "",
      email: "",
      password: "",
    });
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = loginFormData;

    if (!email || !password) {
      console.log("Please enter all required fields");
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        }
      };
      const { data } = await axios.post("/user/login", { email, password }, config)
      localStorage.setItem("userInfo", JSON.stringify(data));
      history.push('/tasks');
    } catch (error) {
      toast.error(error.response.data.Error);
    }
    setLoginFormData({
      email: "",
      password: "",
    });
  };

  const handleSignupInputChange = (event) => {
    const { name, value } = event.target;
    setSignupFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;
    setLoginFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  return (
    <div className="form-container">
        {showSignupForm ? (
            <form className="signup-form" onSubmit={handleSignupSubmit}>
                <h2>Signup</h2>
                <label htmlFor="firstName">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={signupFormData.name}
                    onChange={handleSignupInputChange}
                />
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={signupFormData.email}
                    onChange={handleSignupInputChange}
                />
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={signupFormData.password}
                    onChange={handleSignupInputChange}
                />
                <button type="submit">Signup</button>
                <a className="switch-form-btn" onClick={() => setShowSignupForm(false)}>Switch to Login</a>
            </form>
        )
            : (
                <form className="login-form" onSubmit={handleLoginSubmit}>
                    <h2>Login</h2>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={loginFormData.email}
                        onChange={handleLoginInputChange}
                    />
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={loginFormData.password}
                        onChange={handleLoginInputChange}
                    />
                    <button type="submit">Login</button>
                    <a className="switch-form-btn" onClick={() => setShowSignupForm(true)}>Switch to Signup</a>
                </form>
            )}
        <ToastContainer />
    </div>
  );
}

export default HomePage;