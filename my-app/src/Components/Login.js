// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Link,
//   CircularProgress,
//   Alert,
//   InputAdornment,
//   IconButton,
//   Grid,
//   Paper,
//   ToggleButton,
//   ToggleButtonGroup,
// } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import toast from 'react-hot-toast';
// import { useAuth } from '../context/auth/AuthContext';

// const Login = () => {
//     const navigate = useNavigate();
//     const { setUser } = useAuth();
//     const [formData, setFormData] = useState({
//         email: '',
//         otp: '',
//         password: ''
//     });
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [message, setMessage] = useState('');
//     const [otpRequired, setOtpRequired] = useState(false);
//     const [otpExpiryTime, setOtpExpiryTime] = useState(0);
//     const [countdown, setCountdown] = useState(0);
//     const [authMethod, setAuthMethod] = useState('otp'); // 'otp' or 'password'
//     const [showPassword, setShowPassword] = useState(false);

//     useEffect(() => {
//         let timer;
//         if (countdown > 0) {
//             timer = setInterval(() => {
//                 setCountdown(prev => prev - 1);
//             }, 1000);
//         }
//         return () => clearInterval(timer);
//     }, [countdown]);

//     const validateEmail = () => {
//         const emailRegex = /^[a-zA-Z0-9._-]+@iitrpr\.ac\.in$/;
//         if (!formData.email) {
//             setErrors(prev => ({ ...prev, email: 'Email is required' }));
//             return false;
//         }
//         if (!emailRegex.test(formData.email)) {
//             setErrors(prev => ({ ...prev, email: 'Please use your IITRPR email address (@iitrpr.ac.in)' }));
//             return false;
//         }
//         setErrors(prev => ({ ...prev, email: '' }));
//         return true;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setMessage('');
//         setErrors({});

//         try {
//             if (!validateEmail()) {
//                 setLoading(false);
//                 return;
//             }

//             if (authMethod === 'otp') {
//                 if (!otpRequired) {
//                     await handleGenerateOTP();
//                 } else {
//                     await handleVerifyOTP();
//                 }
//             } else {
//                 // Password authentication
//                 if (!formData.password) {
//                     setErrors(prev => ({ ...prev, password: 'Password is required' }));
//                     setLoading(false);
//                     return;
//                 }
//                 await handlePasswordLogin();
//             }
//         } catch (error) {
//             toast.error('An error occurred. Please try again.');
//             setErrors(prev => ({ ...prev, submit: 'An error occurred. Please try again.' }));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePasswordLogin = async () => {
//         setLoading(true);
//         try {
//             console.log('Attempting password login for email:', formData.email);
//             const response = await fetch('http://localhost:5000/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     email: formData.email,
//                     password: formData.password
//                 })
//             });

//             const data = await response.json();
//             console.log('Password login response:', data);

//             if (response.ok) {
//                 console.log('Login successful, setting token and user...');
//                 toast.success('Login successful!');
//                 localStorage.setItem('token', data.access_token);
//                 console.log('Token set in localStorage');
//                 setUser(data.username);
//                 console.log('User state updated');
//                 console.log('Navigating to home page...');
//                 navigate('/');
//                 console.log('Navigation completed');
//             } else {
//                 toast.error(data.message || 'Invalid email or password');
//                 setErrors(prev => ({ ...prev, password: data.message }));
//             }
//         } catch (error) {
//             console.error('Password login error:', error);
//             toast.error('Failed to login. Please try again.');
//             setErrors(prev => ({ ...prev, submit: 'Failed to login. Please try again.' }));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleGenerateOTP = async () => {
//         if (!validateEmail()) return;
        
//         setLoading(true);
//         setMessage('');
//         setErrors({});
        
//         try {
//             const response = await fetch('http://localhost:5000/generate-otp', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email: formData.email })
//             });
            
//             const data = await response.json();
            
//             if (response.ok) {
//                 toast.success('OTP has been sent to your email');
//                 setMessage('OTP has been sent to your email. Please check your inbox. The OTP is valid for 5 minutes.');
//                 setOtpRequired(true);
//                 setFormData(prev => ({ ...prev, otp: '' }));
//                 setOtpExpiryTime(data.expires_in);
//                 setCountdown(60); // 1 minute cooldown
//             } else {
//                 toast.error(data.error || 'Failed to send OTP');
//                 setErrors(prev => ({ ...prev, submit: data.error }));
//                 if (data.retry_after) {
//                     setMessage(`Please wait ${Math.ceil(data.retry_after / 60)} minutes before trying again.`);
//                     setCountdown(Math.ceil(data.retry_after));
//                 }
//             }
//         } catch (err) {
//             toast.error('Network error. Please try again.');
//             setErrors(prev => ({ ...prev, submit: 'Network error. Please try again.' }));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleVerifyOTP = async () => {
//         if (!formData.otp) {
//             setErrors(prev => ({ ...prev, otp: 'OTP is required' }));
//             return;
//         }

//         if (formData.otp.length !== 6 || !/^\d+$/.test(formData.otp)) {
//             setErrors(prev => ({ ...prev, otp: 'OTP must be 6 digits' }));
//             return;
//         }

//         setLoading(true);
//         try {
//             console.log('Verifying OTP for email:', formData.email);
//             const response = await fetch('http://localhost:5000/verify-otp', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     email: formData.email,
//                     otp: formData.otp
//                 })
//             });

//             const data = await response.json();
//             console.log('OTP verification response:', data);

//             if (response.ok) {
//                 console.log('Login successful, setting token and user...');
//                 toast.success('Login successful!');
//                 localStorage.setItem('token', data.access_token);
//                 console.log('Token set in localStorage');
//                 setUser(data.username);
//                 console.log('User state updated');
//                 console.log('Navigating to home page...');
//                 navigate('/');
//                 console.log('Navigation completed');
//             } else {
//                 // Handle different error cases
//                 if (response.status === 429) {
//                     // Too many attempts
//                     toast.error(`Too many verification attempts. Please try again in ${Math.ceil(data.retry_after / 60)} minutes.`);
//                     setErrors(prev => ({ ...prev, otp: `Too many attempts. Try again in ${Math.ceil(data.retry_after / 60)} minutes.` }));
//                     setCountdown(Math.ceil(data.retry_after));
//                 } else {
//                     // Other errors with attempts left
//                     const errorMessage = data.attempts_left !== undefined 
//                         ? `${data.error} (${data.attempts_left} attempts left)`
//                         : data.error;
                    
//                     toast.error(errorMessage);
//                     setErrors(prev => ({ ...prev, otp: errorMessage }));
                    
//                     if (data.retry_after) {
//                         setCountdown(Math.ceil(data.retry_after));
//                     }
//                 }
//             }
//         } catch (error) {
//             console.error('OTP verification error:', error);
//             toast.error('Failed to verify OTP. Please try again.');
//             setErrors(prev => ({ ...prev, submit: 'Failed to verify OTP. Please try again.' }));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleAuthMethodChange = (event, newMethod) => {
//         if (newMethod !== null) {
//             setAuthMethod(newMethod);
//             setOtpRequired(false);
//             setFormData(prev => ({ ...prev, otp: '', password: '' }));
//             setErrors({});
//             setMessage('');
//         }
//     };

//     return (
//         <Container component="main" maxWidth="xs">
//             <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
//                 <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                     <Typography component="h1" variant="h5" gutterBottom>
//                         Login to DEP
//                     </Typography>
                    
//                     <ToggleButtonGroup
//                         value={authMethod}
//                         exclusive
//                         onChange={handleAuthMethodChange}
//                         aria-label="authentication method"
//                         sx={{ mb: 2 }}
//                     >
//                         <ToggleButton value="otp" aria-label="login with OTP">
//                             OTP Login
//                         </ToggleButton>
//                         <ToggleButton value="password" aria-label="login with password">
//                             Password Login
//                         </ToggleButton>
//                     </ToggleButtonGroup>
                    
//                     <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
//                         <TextField
//                             margin="normal"
//                             required
//                             fullWidth
//                             id="email"
//                             label="IITRPR Email Address"
//                             name="email"
//                             autoComplete="email"
//                             autoFocus
//                             value={formData.email}
//                             onChange={(e) => {
//                                 setFormData(prev => ({ ...prev, email: e.target.value }));
//                                 setErrors(prev => ({ ...prev, email: '' }));
//                             }}
//                             error={!!errors.email}
//                             helperText={errors.email || "Use your @iitrpr.ac.in email address"}
//                             placeholder="username@iitrpr.ac.in"
//                             disabled={loading}
//                         />
                        
//                         {authMethod === 'password' && (
//                             <TextField
//                                 margin="normal"
//                                 required
//                                 fullWidth
//                                 name="password"
//                                 label="Password"
//                                 type={showPassword ? 'text' : 'password'}
//                                 id="password"
//                                 autoComplete="current-password"
//                                 value={formData.password}
//                                 onChange={(e) => {
//                                     setFormData(prev => ({ ...prev, password: e.target.value }));
//                                     setErrors(prev => ({ ...prev, password: '' }));
//                                 }}
//                                 error={!!errors.password}
//                                 helperText={errors.password}
//                                 disabled={loading}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton
//                                                 aria-label="toggle password visibility"
//                                                 onClick={() => setShowPassword(!showPassword)}
//                                                 edge="end"
//                                             >
//                                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />
//                         )}
                        
//                         {authMethod === 'otp' && otpRequired && (
//                             <TextField
//                                 margin="normal"
//                                 required
//                                 fullWidth
//                                 name="otp"
//                                 label="Enter OTP"
//                                 id="otp"
//                                 value={formData.otp}
//                                 onChange={(e) => {
//                                     const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//                                     setFormData(prev => ({ ...prev, otp: value }));
//                                     setErrors(prev => ({ ...prev, otp: '' }));
//                                 }}
//                                 error={!!errors.otp}
//                                 helperText={errors.otp || (otpExpiryTime > 0 ? `OTP expires in ${Math.ceil(otpExpiryTime / 60)} minutes` : 'OTP expired')}
//                                 disabled={loading || otpExpiryTime <= 0}
//                                 inputProps={{ maxLength: 6 }}
//                             />
//                         )}
                        
//                         {errors.submit && (
//                             <Alert severity="error" sx={{ mt: 2 }}>
//                                 {errors.submit}
//                             </Alert>
//                         )}
                        
//                         {message && (
//                             <Alert severity="success" sx={{ mt: 2 }}>
//                                 {message}
//                             </Alert>
//                         )}
                        
//                         <Button
//                             type="submit"
//                             fullWidth
//                             variant="contained"
//                             sx={{ mt: 3, mb: 2 }}
//                             disabled={loading}
//                         >
//                             {loading ? (
//                                 <CircularProgress size={24} color="inherit" />
//                             ) : (
//                                 authMethod === 'otp' 
//                                     ? (otpRequired ? 'Verify OTP' : 'Get OTP') 
//                                     : 'Login'
//                             )}
//                         </Button>
                        
//                         {authMethod === 'otp' && otpRequired && (
//                             <Button
//                                 fullWidth
//                                 variant="outlined"
//                                 onClick={handleGenerateOTP}
//                                 disabled={loading || countdown > 0}
//                                 sx={{ mb: 2 }}
//                             >
//                                 {loading ? (
//                                     <CircularProgress size={24} color="inherit" />
//                                 ) : countdown > 0 ? (
//                                     `Resend OTP in ${countdown}s`
//                                 ) : (
//                                     'Resend OTP'
//                                 )}
//                             </Button>
//                         )}
                        
//                         <Grid container justifyContent="space-between">
//                             <Grid item>
//                                 <Link
//                                     component="button"
//                                     variant="body2"
//                                     onClick={() => navigate('/signup')}
//                                     sx={{ mt: 2 }}
//                                 >
//                                     Don't have an account? Sign Up
//                                 </Link>
//                             </Grid>
//                             {authMethod === 'password' && (
//                                 <Grid item>
//                                     <Link
//                                         component="button"
//                                         variant="body2"
//                                         onClick={() => navigate('/reset-password')}
//                                         sx={{ mt: 2 }}
//                                     >
//                                         Forgot Password?
//                                     </Link>
//                                 </Grid>
//                             )}
//                         </Grid>
//                     </Box>
//                 </Box>
//             </Paper>
//         </Container>
//     );
// };

// export default Login;
"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useAuth } from "../context/auth/AuthContext"
import toast from "react-hot-toast"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otp: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [authMethod, setAuthMethod] = useState(0) // 0: OTP, 1: Password
  const [otpSent, setOtpSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [serverError, setServerError] = useState("")

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@iitrpr\.ac\.in$/
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }))
      return false
    }
    if (!emailRegex.test(formData.email)) {
      setErrors((prev) => ({ ...prev, email: "Please use your IITRPR email address" }))
      return false
    }
    setErrors((prev) => ({ ...prev, email: "" }))
    return true
  }

  const startResendTimer = () => {
    setResendDisabled(true)
    setResendTimer(60)
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setResendDisabled(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleTabChange = (event, newValue) => {
    setAuthMethod(newValue)
    setOtpSent(false)
    setFormData((prev) => ({ ...prev, otp: "", password: "" }))
    setErrors({})
    setServerError("")
  }

  const handleGenerateOTP = async () => {
    if (!validateEmail()) return

    setLoading(true)
    try {
      // First check if the account exists
      const checkResponse = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          check_account: true,
          email: formData.email,
        }),
      })

      const checkData = await checkResponse.json()

      if (!checkResponse.ok) {
        if (checkData.error === "Account not found") {
          setErrors((prev) => ({ ...prev, email: "No account found with this email" }))
          setLoading(false)
          return
        } else if (!checkData.is_verified) {
          setErrors((prev) => ({ ...prev, email: "Please verify your email first" }))
          setLoading(false)
          return
        }
      }

      // If account exists, proceed with OTP generation
      const response = await fetch("http://localhost:5000/generate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          is_login: true,
        }),
      })

      const data = await response.json()
      if (response.ok) {
        setOtpSent(true)
        startResendTimer()
        toast.success("OTP sent to your email")
      } else {
        if (data.error === "Too many requests") {
          toast.error("Too many attempts. Please try again later.")
        } else {
          toast.error(data.error || "Failed to send OTP")
        }
        setServerError(data.message || data.error || "Failed to send OTP")
      }
    } catch (error) {
      console.error("Error generating OTP:", error)
      toast.error("Failed to send OTP. Please try again.")
      setServerError("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")

    if (authMethod === 0) {
      // OTP Login
      if (!otpSent) {
        handleGenerateOTP()
        return
      }

      if (!formData.otp) {
        setErrors((prev) => ({ ...prev, otp: "Please enter the OTP" }))
        return
      }

      setLoading(true)
      try {
        const result = await login(formData.email, null, formData.otp)
        if (result.success) {
          toast.success("Login successful!")
          navigate("/")
        } else {
          setServerError(result.error || "Login failed")
        }
      } catch (error) {
        console.error("Login error:", error)
        setServerError("An error occurred during login")
      } finally {
        setLoading(false)
      }
    } else {
      // Password Login
      if (!validateEmail()) return

      if (!formData.password) {
        setErrors((prev) => ({ ...prev, password: "Password is required" }))
        return
      }

      setLoading(true)
      try {
        const result = await login(formData.email, formData.password)
        if (result.success) {
          toast.success("Login successful!")
          navigate("/")
        } else {
          setServerError(result.error || "Invalid email or password")
        }
      } catch (error) {
        console.error("Login error:", error)
        setServerError("An error occurred during login")
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mt: 8,
          backgroundColor: "rgb(32, 33, 35)",
          color: "white",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography component="h1" variant="h5" gutterBottom>
            Login to DEP
          </Typography>

          <Tabs
            value={authMethod}
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              mb: 3,
              width: "100%",
              "& .MuiTabs-indicator": {
                backgroundColor: "#7c3aed",
              },
              "& .MuiTab-root": {
                color: "rgb(138, 143, 150)",
                "&.Mui-selected": {
                  color: "white",
                },
              },
            }}
          >
            <Tab label="OTP Login" />
            <Tab label="Password Login" />
          </Tabs>

          {serverError && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {serverError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="IITRPR Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }))
                setErrors((prev) => ({ ...prev, email: "" }))
                setServerError("")
              }}
              error={!!errors.email}
              helperText={errors.email || "Use your @iitrpr.ac.in email address"}
              disabled={loading || (authMethod === 0 && otpSent)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgb(95, 99, 104)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgb(138, 143, 150)",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "rgb(138, 143, 150)",
                },
                "& .MuiFormHelperText-root": {
                  color: errors.email ? "error.main" : "rgb(138, 143, 150)",
                },
              }}
            />

            {authMethod === 1 && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                  setErrors((prev) => ({ ...prev, password: "" }))
                  setServerError("")
                }}
                error={!!errors.password}
                helperText={errors.password}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "rgb(138, 143, 150)" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgb(95, 99, 104)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgb(138, 143, 150)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgb(138, 143, 150)",
                  },
                  "& .MuiFormHelperText-root": {
                    color: errors.password ? "error.main" : "rgb(138, 143, 150)",
                  },
                }}
              />
            )}

            {authMethod === 0 && otpSent && (
              <TextField
                margin="normal"
                required
                fullWidth
                name="otp"
                label="Enter OTP"
                id="otp"
                value={formData.otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                  setFormData((prev) => ({ ...prev, otp: value }))
                  setErrors((prev) => ({ ...prev, otp: "" }))
                  setServerError("")
                }}
                error={!!errors.otp}
                helperText={errors.otp || "Enter the 6-digit code sent to your email"}
                disabled={loading}
                inputProps={{ maxLength: 6 }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    "& fieldset": {
                      borderColor: "rgb(95, 99, 104)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgb(138, 143, 150)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgb(138, 143, 150)",
                  },
                  "& .MuiFormHelperText-root": {
                    color: errors.otp ? "error.main" : "rgb(138, 143, 150)",
                  },
                }}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "#7c3aed",
                "&:hover": {
                  bgcolor: "#6d28d9",
                },
                "&:disabled": {
                  bgcolor: "rgba(124, 58, 237, 0.5)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : authMethod === 0 ? (
                otpSent ? (
                  "Verify OTP"
                ) : (
                  "Get OTP"
                )
              ) : (
                "Login"
              )}
            </Button>

            {authMethod === 0 && otpSent && (
              <Button
                fullWidth
                variant="outlined"
                onClick={handleGenerateOTP}
                disabled={loading || resendDisabled}
                sx={{
                  mb: 2,
                  borderColor: "rgb(95, 99, 104)",
                  color: "white",
                  "&:hover": {
                    borderColor: "rgb(138, 143, 150)",
                    backgroundColor: "rgba(124, 58, 237, 0.1)",
                  },
                  "&:disabled": {
                    color: "rgba(255, 255, 255, 0.3)",
                    borderColor: "rgba(95, 99, 104, 0.5)",
                  },
                }}
              >
                {resendDisabled ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
              </Button>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2,
              }}
            >
              <Link
                to="/signup"
                style={{
                  color: "#7c3aed",
                  textDecoration: "none",
                }}
              >
                Don't have an account? Sign Up
              </Link>

              {authMethod === 1 && (
                <Link
                  to="/reset-password"
                  style={{
                    color: "#7c3aed",
                    textDecoration: "none",
                  }}
                >
                  Forgot Password?
                </Link>
              )}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default Login