// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Paper,
//   Link,
//   CircularProgress,
//   Alert,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
//   InputAdornment,
//   IconButton,
// } from "@mui/material";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import ErrorIcon from '@mui/icons-material/Error';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// import toast from "react-hot-toast";
// import { useAuth } from '../context/auth/AuthContext';

// export default function Signup() {
//   const navigate = useNavigate();
//   const { signup } = useAuth();
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     confirmPassword: '',
//     email: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const validateForm = () => {
//     const newErrors = {};
    
//     // Username validation
//     if (!formData.username.trim()) {
//       newErrors.username = 'Username is required';
//     } else if (formData.username.length < 3) {
//       newErrors.username = 'Username must be at least 3 characters long';
//     } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
//       newErrors.username = 'Username can only contain letters, numbers, and underscores';
//     }
    
//     // Email validation
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!formData.email.endsWith('@iitrpr.ac.in')) {
//       newErrors.email = 'Only IITRPR email addresses are allowed';
//     } else if (!/^[a-zA-Z0-9._%+-]+@iitrpr\.ac\.in$/.test(formData.email)) {
//       newErrors.email = 'Invalid email format. Please use a valid IITRPR email address';
//     }
    
//     // Password validation
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters long';
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
//     }
    
//     // Confirm password validation
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log("Submitting form with:", {
//         username: formData.username,
//         email: formData.email,
//         password: formData.password
//       });
      
//       // Use fetch directly instead of the auth context's signup function
//       const response = await fetch('http://localhost:5000/signup', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           username: formData.username,
//           email: formData.email,
//           password: formData.password,
//         }),
//       });

//       const data = await response.json();
//       console.log("Signup response:", data);

//       if (response.ok) {
//         setSuccess(true);
//         toast.success('Account created successfully! Please login.');
//         setTimeout(() => {
//           navigate('/login');
//         }, 2000);
//       } else {
//         // Handle specific error cases
//         if (response.status === 409) {
//           if (data.error === 'Email already exists') {
//             toast.error('This email is already registered. Please use a different email or login.');
//             setErrors(prev => ({ ...prev, email: 'This email is already registered' }));
//           } else if (data.error === 'Username already exists') {
//             toast.error('This username is already taken. Please choose another username.');
//             setErrors(prev => ({ ...prev, username: 'This username is already taken' }));
//           } else {
//             toast.error(data.error || 'Failed to create account');
//             setErrors(prev => ({ ...prev, submit: data.error || 'Failed to create account' }));
//           }
//         } else {
//           toast.error(data.error || 'Failed to create account');
//           setErrors(prev => ({ ...prev, submit: data.error || 'Failed to create account' }));
//         }
//       }
//     } catch (error) {
//       console.error("Signup error:", error);
//       toast.error('Network error. Please try again.');
//       setErrors(prev => ({ ...prev, submit: 'Network error. Please try again.' }));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPasswordRequirements = () => {
//     const requirements = [
//       { text: 'At least 6 characters long', met: formData.password.length >= 6 },
//       { text: 'Contains at least one uppercase letter', met: /[A-Z]/.test(formData.password) },
//       { text: 'Contains at least one lowercase letter', met: /[a-z]/.test(formData.password) },
//       { text: 'Contains at least one number', met: /\d/.test(formData.password) },
//     ];
//     return requirements;
//   };

//   return (
//     <Container maxWidth="sm" sx={{ mt: 8 }}>
//       <Paper elevation={3} sx={{ p: 4 }}>
//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             gap: 2,
//           }}
//         >
//           <Typography variant="h4" component="h1" gutterBottom align="center">
//             Sign Up
//           </Typography>
          
//           {success && (
//             <Alert severity="success" sx={{ mb: 2 }}>
//               Account created successfully! Redirecting to login...
//             </Alert>
//           )}
          
//           {errors.submit && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {errors.submit}
//             </Alert>
//           )}
          
//           <TextField
//             label="Username"
//             value={formData.username}
//             onChange={(e) => {
//               console.log("Username changed:", e.target.value);
//               setFormData(prev => ({ ...prev, username: e.target.value }));
//               setErrors(prev => ({ ...prev, username: '' }));
//             }}
//             error={!!errors.username}
//             helperText={errors.username || "Username must be at least 3 characters long and can only contain letters, numbers, and underscores"}
//             required
//             fullWidth
//             disabled={loading}
//             autoComplete="username"
//           />
          
//           <TextField
//             label="IITRPR Email"
//             type="email"
//             value={formData.email}
//             onChange={(e) => {
//               console.log("Email changed:", e.target.value);
//               setFormData(prev => ({ ...prev, email: e.target.value }));
//               setErrors(prev => ({ ...prev, email: '' }));
//             }}
//             error={!!errors.email}
//             helperText={errors.email || "Enter your IITRPR email address (username@iitrpr.ac.in)"}
//             required
//             fullWidth
//             disabled={loading}
//             autoComplete="email"
//             placeholder="username@iitrpr.ac.in"
//           />
          
//           <TextField
//             label="Password"
//             type={showPassword ? 'text' : 'password'}
//             value={formData.password}
//             onChange={(e) => {
//               console.log("Password changed:", e.target.value);
//               setFormData(prev => ({ ...prev, password: e.target.value }));
//               setErrors(prev => ({ ...prev, password: '', confirmPassword: '' }));
//             }}
//             error={!!errors.password}
//             helperText={errors.password || "Password requirements:"}
//             required
//             fullWidth
//             disabled={loading}
//             autoComplete="new-password"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => setShowPassword(!showPassword)}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           {formData.password && (
//             <List dense sx={{ mt: -2, mb: 1 }}>
//               {getPasswordRequirements().map((req, index) => (
//                 <ListItem key={index} sx={{ py: 0.5 }}>
//                   <ListItemIcon sx={{ minWidth: 36 }}>
//                     {req.met ? (
//                       <CheckCircleIcon color="success" fontSize="small" />
//                     ) : (
//                       <ErrorIcon color="error" fontSize="small" />
//                     )}
//                   </ListItemIcon>
//                   <ListItemText 
//                     primary={req.text}
//                     sx={{ 
//                       '& .MuiListItemText-primary': {
//                         fontSize: '0.875rem',
//                         color: req.met ? 'success.main' : 'text.secondary'
//                       }
//                     }}
//                   />
//                 </ListItem>
//               ))}
//             </List>
//           )}
          
//           <TextField
//             label="Confirm Password"
//             type={showConfirmPassword ? 'text' : 'password'}
//             value={formData.confirmPassword}
//             onChange={(e) => {
//               setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
//               setErrors(prev => ({ ...prev, confirmPassword: '' }));
//             }}
//             error={!!errors.confirmPassword}
//             helperText={errors.confirmPassword || "Re-enter your password to confirm"}
//             required
//             fullWidth
//             disabled={loading}
//             autoComplete="new-password"
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     edge="end"
//                   >
//                     {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             disabled={loading}
//             sx={{ mt: 2 }}
//           >
//             {loading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               'Sign Up'
//             )}
//           </Button>

//           <Box sx={{ mt: 2, textAlign: 'center' }}>
//             <Link
//               component="button"
//               variant="body2"
//               onClick={() => navigate('/login')}
//             >
//               Already have an account? Login
//             </Link>
//           </Box>
//         </Box>
//       </Paper>
//     </Container>
//   );
// }

"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  MobileStepper,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import ErrorIcon from "@mui/icons-material/Error"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import toast from "react-hot-toast"
import { useAuth } from "../context/auth/AuthContext"

export default function Signup() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const { signup } = useAuth()

  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  })

  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [otpExpiryTime, setOtpExpiryTime] = useState(null)
  const [attemptsLeft, setAttemptsLeft] = useState(5)
  const [serverError, setServerError] = useState("")

  const steps = ["Create Account", "Verify Email"]

  useEffect(() => {
    let timer
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    } else if (resendTimer === 0) {
      setResendDisabled(false)
    }
    return () => clearInterval(timer)
  }, [resendTimer])

  // Add this useEffect hook after the existing useEffect hooks
  useEffect(() => {
    let timer
    if (otpExpiryTime) {
      // Update every second to show countdown
      timer = setInterval(() => {
        const now = new Date()
        if (now >= otpExpiryTime) {
          clearInterval(timer)
          if (activeStep === 1) {
            toast.error("Verification code has expired. Please request a new one.")
            setOtpSent(false)
            setActiveStep(0)
          }
        }
        // Force re-render to update the countdown
        setFormData((prev) => ({ ...prev }))
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [otpExpiryTime, activeStep])

  const validateForm = () => {
    const newErrors = {}
    
    if (activeStep === 0) {
      // Username validation
      if (!formData.username.trim()) {
        newErrors.username = "Username is required"
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters long"
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        newErrors.username = "Username can only contain letters, numbers, and underscores"
      }
      
      // Email validation
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!formData.email.endsWith("@iitrpr.ac.in")) {
        newErrors.email = "Only IITRPR email addresses are allowed"
      } else if (!/^[a-zA-Z0-9._%+-]+@iitrpr\.ac\.in$/.test(formData.email)) {
        newErrors.email = "Invalid email format. Please use a valid IITRPR email address"
      }
      
      // Password validation
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long"
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      }
      
      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    } else if (activeStep === 1) {
      // OTP validation
      if (!formData.otp.trim()) {
        newErrors.otp = "Please enter the verification code"
      } else if (!/^\d{6}$/.test(formData.otp)) {
        newErrors.otp = "Invalid verification code format"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const startResendTimer = () => {
    setResendDisabled(true)
    setResendTimer(30)
  }

  const startOtpExpiryTimer = () => {
    const expiryTime = new Date()
    expiryTime.setMinutes(expiryTime.getMinutes() + 10)
    setOtpExpiryTime(expiryTime)
  }

  const handleSendOTP = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          is_signup: true,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setOtpSent(true)
        setAttemptsLeft(5)
        startOtpExpiryTimer()
        startResendTimer()
        toast.success("Verification code sent to your email!")
      } else {
        toast.error(data.error || "Failed to send verification code")
        setServerError(data.message || data.error || "Failed to send verification code")
      }
    } catch (error) {
      console.error("Error sending OTP:", error)
      toast.error("Failed to send verification code")
      setServerError("Failed to send verification code")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (!resendDisabled) {
      try {
        setLoading(true)
        const response = await fetch("http://localhost:5000/generate-otp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            is_signup: true,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setAttemptsLeft(5)

          // Set expiry time based on server response
          const expiryTime = new Date()
          expiryTime.setSeconds(expiryTime.getSeconds() + (data.expires_in || 600))
          setOtpExpiryTime(expiryTime)

          toast.success("New verification code sent to your email!")
          startResendTimer()
        } else {
          toast.error(data.error || "Failed to send verification code")
          setServerError(data.message || data.error || "Failed to send verification code")
        }
      } catch (error) {
        toast.error("Failed to send verification code")
        setServerError("Failed to send verification code")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError("")

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      return
    }

    try {
      setLoading(true)

    if (activeStep === 0) {
        // First step: Check credentials and send OTP
        const checkResponse = await fetch("http://localhost:5000/check-credentials", {
          method: "POST",
                headers: {
            "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                }),
        })

        const checkData = await checkResponse.json()

            if (!checkResponse.ok) {
          if (checkData.error === "Email exists") {
            setErrors({ email: "This email is already registered. Please login instead." })
            toast.error("This email is already registered. Please login instead.")
            return
          } else if (checkData.error === "Username exists") {
            setErrors({ username: "This username is already taken. Please choose another one." })
            toast.error("This username is already taken. Please choose another one.")
            return
          }
        }

        // If credentials are unique, send OTP
        const otpResponse = await fetch("http://localhost:5000/generate-otp", {
          method: "POST",
                headers: {
            "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
            is_signup: true,
          }),
        })

        const otpData = await otpResponse.json()

        if (otpResponse.ok) {
          setOtpSent(true)
          setAttemptsLeft(5)

          // Set expiry time based on server response
          const expiryTime = new Date()
          expiryTime.setSeconds(expiryTime.getSeconds() + (otpData.expires_in || 600))
          setOtpExpiryTime(expiryTime)

          startResendTimer()
          setActiveStep(1)
          toast.success("Verification code sent to your email! Please verify to complete signup.")
            } else {
          toast.error(otpData.error || "Failed to send verification code")
          setServerError(otpData.message || otpData.error || "Failed to send verification code")
        }
                } else {
        // Second step: Verify OTP
        if (!formData.otp) {
          setErrors({ otp: "Please enter the verification code" })
          return
        }

        // Check if OTP has expired
        if (otpExpiryTime && new Date() > otpExpiryTime) {
          toast.error("Verification code has expired. Please request a new one.")
          setOtpSent(false)
          setActiveStep(0)
          return
        }

        console.log("Sending OTP verification request:", {
          email: formData.email,
          otp: formData.otp,
        })

        // First verify the OTP
        const verifyResponse = await fetch("http://localhost:5000/verify-otp", {
          method: "POST",
                headers: {
            "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                    otp: formData.otp,
                }),
        })

        console.log("Verification response status:", verifyResponse.status)
        const verifyData = await verifyResponse.json()
        console.log("Verification response data:", verifyData)

        if (!verifyResponse.ok) {
          if (verifyData.error === "Invalid code") {
            // Use attempts_left from backend response
            const remainingAttempts = verifyData.attempts_left || attemptsLeft - 1
            setAttemptsLeft(remainingAttempts)
            toast.error(`Invalid verification code. ${remainingAttempts} attempts remaining.`)
            setErrors({
              otp: `Invalid verification code. ${remainingAttempts} attempts remaining.`,
            })
            return
          } else if (verifyData.error === "Code expired") {
            toast.error("Verification code has expired. Please request a new one.")
            setOtpSent(false)
            setActiveStep(0)
            return
          } else if (verifyData.error === "Max attempts reached") {
            toast.error("Maximum number of attempts reached. Please request a new verification code.")
            setOtpSent(false)
            setActiveStep(0)
            return
          } else {
            console.error("Verification failed:", verifyData)
            toast.error(verifyData.message || verifyData.error || "Verification failed")
            setServerError(verifyData.message || verifyData.error || "Verification failed")
            return
          }
        }

        // If OTP verification is successful, create the account
        try {
          console.log("Creating account after successful verification")
          const signupResponse = await fetch("http://localhost:5000/signup", {
            method: "POST",
                    headers: {
              "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: formData.username,
                        email: formData.email,
                        password: formData.password,
                        verified: true,
                    }),
          })

          console.log("Signup response status:", signupResponse.status)
          const signupData = await signupResponse.json()
          console.log("Signup response data:", signupData)

                if (signupResponse.ok) {
            setSuccess(true)
            toast.success("Account created successfully! Redirecting to login...")
                    setTimeout(() => {
              navigate("/login")
            }, 2000)
                } else {
            toast.error(signupData.error || signupData.message || "Failed to create account")
            setServerError(signupData.error || signupData.message || "Failed to create account")
            }
        } catch (error) {
          console.error("Signup error:", error)
          toast.error("Failed to create account. Please try again.")
          setServerError("Failed to create account. Please try again.")
        }
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error("An error occurred. Please try again.")
      setServerError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const getPasswordRequirements = () => {
    const requirements = [
      { text: "At least 6 characters long", met: formData.password.length >= 6 },
      { text: "Contains at least one uppercase letter", met: /[A-Z]/.test(formData.password) },
      { text: "Contains at least one lowercase letter", met: /[a-z]/.test(formData.password) },
      { text: "Contains at least one number", met: /\d/.test(formData.password) },
    ]
    return requirements
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              label="Username"
              value={formData.username}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, username: e.target.value }))
                setErrors((prev) => ({ ...prev, username: "" }))
                setServerError("")
              }}
              error={!!errors.username}
              helperText={errors.username || "Username must be at least 3 characters long"}
              required
              fullWidth
              disabled={loading}
              autoComplete="username"
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
                  color: errors.username ? "error.main" : "rgb(138, 143, 150)",
                },
              }}
            />
            
            <TextField
              label="IITRPR Email"
              type="email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }))
                setErrors((prev) => ({ ...prev, email: "" }))
                setServerError("")
              }}
              error={!!errors.email}
              helperText={errors.email || "Enter your IITRPR email address"}
              required
              fullWidth
              disabled={loading}
              autoComplete="email"
              placeholder="username@iitrpr.ac.in"
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
            
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, password: e.target.value }))
                setErrors((prev) => ({ ...prev, password: "", confirmPassword: "" }))
                setServerError("")
              }}
              error={!!errors.password}
              helperText={errors.password || "Password requirements:"}
              required
              fullWidth
              disabled={loading}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: "rgb(138, 143, 150)" }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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

            {formData.password && (
              <List dense sx={{ mt: -2, mb: 1 }}>
                {getPasswordRequirements().map((req, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {req.met ? (
                        <CheckCircleIcon color="success" fontSize="small" />
                      ) : (
                        <ErrorIcon color="error" fontSize="small" />
                      )}
                    </ListItemIcon>
                    <ListItemText 
                      primary={req.text}
                      sx={{ 
                        "& .MuiListItemText-primary": {
                          fontSize: "0.875rem",
                          color: req.met ? "success.main" : "text.secondary",
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
            
            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                setServerError("")
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword || "Re-enter your password to confirm"}
              required
              fullWidth
              disabled={loading}
              autoComplete="new-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: "rgb(138, 143, 150)" }}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
                  color: errors.confirmPassword ? "error.main" : "rgb(138, 143, 150)",
                },
              }}
            />
          </>
        )
      case 1:
        return (
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body1" sx={{ mb: 3, color: "white" }}>
              We've sent a verification code to your email address: {formData.email}
            </Typography>

            {otpExpiryTime && (
              <Typography variant="body2" sx={{ mb: 2, color: "rgb(138, 143, 150)" }}>
                Code expires in: {Math.max(0, Math.floor((otpExpiryTime - new Date()) / 1000))} seconds
              </Typography>
            )}
            
            <TextField
              label="Verification Code"
              value={formData.otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                setFormData((prev) => ({ ...prev, otp: value }))
                setErrors((prev) => ({ ...prev, otp: "" }))
                setServerError("")
              }}
              error={!!errors.otp}
              helperText={errors.otp}
              required
              fullWidth
              disabled={loading}
              sx={{
                mb: 2,
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
              inputProps={{ maxLength: 6 }}
            />
            
            <Button
              variant="text"
              disabled={resendDisabled || loading}
              onClick={handleResendOTP}
              sx={{
                mb: 2,
                color: resendDisabled ? "rgba(255, 255, 255, 0.3)" : "#7c3aed",
              }}
            >
              {resendDisabled ? `Resend code in ${resendTimer}s` : "Resend verification code"}
            </Button>
          </Box>
        )
      default:
        return null
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          backgroundColor: "rgb(32, 33, 35)",
          color: "white",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Sign Up
          </Typography>

          {!isMobile ? (
            <Stepper
              activeStep={activeStep}
              sx={{
                mb: 4,
                "& .MuiStepLabel-label": {
                  color: "rgb(138, 143, 150)",
                },
                "& .MuiStepLabel-label.Mui-active": {
                  color: "white",
                },
                "& .MuiStepLabel-label.Mui-completed": {
                  color: "white",
                },
                "& .MuiStepIcon-root": {
                  color: "rgb(95, 99, 104)",
                },
                "& .MuiStepIcon-root.Mui-active": {
                  color: "#7c3aed",
                },
                "& .MuiStepIcon-root.Mui-completed": {
                  color: "#7c3aed",
                },
              }}
            >
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          ) : (
            <MobileStepper
              variant="dots"
              steps={steps.length}
              position="static"
              activeStep={activeStep}
              sx={{
                maxWidth: 400,
                flexGrow: 1,
                mb: 4,
                backgroundColor: "transparent",
                "& .MuiMobileStepper-dot": {
                  backgroundColor: "rgb(95, 99, 104)",
                },
                "& .MuiMobileStepper-dot.MuiMobileStepper-dotActive": {
                  backgroundColor: "#7c3aed",
                },
              }}
              nextButton={<Box />}
              backButton={<Box />}
            />
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Account successfully verified! Redirecting to login...
            </Alert>
          )}
          
          {serverError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {serverError}
            </Alert>
          )}
          
          {renderStepContent(activeStep)}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 2,
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
            ) : activeStep === 0 ? (
              "Continue"
            ) : (
              "Verify Account"
            )}
          </Button>

          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link
              to="/login"
              style={{
                color: "#7c3aed",
                textDecoration: "none",
              }}
            >
              Already have an account? Login
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}