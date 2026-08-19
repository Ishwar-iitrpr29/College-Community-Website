// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is logged in on mount
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Verify token with backend
//       axios.get('http://localhost:5000/verify-token', {
//         headers: { Authorization: `Bearer ${token}` }
//       })
//       .then(response => {
//         setUser(response.data.user);
//       })
//       .catch((error) => {
//         localStorage.removeItem('token');
//         setUser(null);
//         const errorMessage = error.response?.data?.message || 'Session expired. Please login again.';
//         toast.error(errorMessage);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (username, password) => {
//     try {
//       const response = await axios.post('http://localhost:5000/login', {
//         username,
//         password
//       });

//       if (response.data.access_token) {
//         localStorage.setItem('token', response.data.access_token);
//         setUser(response.data.username);
//         return { success: true };
//       }
//     } catch (error) {
//       let errorMessage = 'Login failed. Please try again.';
      
//       if (error.response) {
//         switch (error.response.status) {
//           case 400:
//             errorMessage = error.response.data.message || 'Please check your username and password.';
//             break;
//           case 401:
//             errorMessage = 'Invalid username or password.';
//             break;
//           case 500:
//             errorMessage = 'Server error. Please try again later.';
//             break;
//           default:
//             errorMessage = error.response.data.message || 'An unexpected error occurred.';
//         }
//       } else if (error.request) {
//         errorMessage = 'No response from server. Please check your connection.';
//       }
      
//       toast.error(errorMessage);
//       return {
//         success: false,
//         error: errorMessage
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     toast.success('Logged out successfully');
//   };

//   const signup = async (username, email, password) => {
//     try {
//       console.log("AuthContext signup called with:", { username, email, password });
      
//       const response = await axios.post('http://localhost:5000/signup', {
//         username,
//         email,
//         password
//       });

//       if (response.status === 201) {
//         toast.success('Account created successfully! Please login.');
//         return { success: true };
//       }
//     } catch (error) {
//       let errorMessage = 'Signup failed. Please try again.';
      
//       if (error.response) {
//         switch (error.response.status) {
//           case 400:
//             errorMessage = error.response.data.message || 'Please check your input.';
//             break;
//           case 409:
//             errorMessage = 'Username already exists. Please choose another.';
//             break;
//           case 500:
//             errorMessage = 'Server error. Please try again later.';
//             break;
//           default:
//             errorMessage = error.response.data.message || 'An unexpected error occurred.';
//         }
//       } else if (error.request) {
//         errorMessage = 'No response from server. Please check your connection.';
//       }
      
//       toast.error(errorMessage);
//       return {
//         success: false,
//         error: errorMessage
//       };
//     }
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//     signup,
//     setUser
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }; 
"use client"

import { createContext, useContext, useState, useEffect } from "react"
import toast from "react-hot-toast"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token") || null)

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await fetch("http://localhost:5000/verify-token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          // Token is invalid or expired
          setUser(null)
          setToken(null)
          localStorage.removeItem("token")
          toast.error("Session expired. Please login again.")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        setUser(null)
        setToken(null)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [token])

  const login = async (email, password = null, otp = null) => {
    try {
      let response

      if (otp) {
        // OTP-based login
        response = await fetch("http://localhost:5000/verify-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
            is_login: true,
          }),
        })
      } else {
        // Password-based login
        response = await fetch("http://localhost:5000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })
      }

      const data = await response.json()

      if (response.ok) {
        setUser(data.username)
        setToken(data.access_token)
        localStorage.setItem("token", data.access_token)
        return { success: true }
      } else {
        const errorMessage = data.message || data.error || "Login failed"
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An error occurred during login")
      return { success: false, error: "An error occurred during login" }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    toast.success("Logged out successfully")
  }

  const signup = async (username, email, password) => {
    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          verified: true,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        return { success: true }
      } else {
        const errorMessage = data.message || data.error || "Signup failed"
        toast.error(errorMessage)
        return { success: false, error: errorMessage }
      }
    } catch (error) {
      console.error("Signup error:", error)
      toast.error("An error occurred during signup")
      return { success: false, error: "An error occurred during signup" }
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    signup,
    token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
