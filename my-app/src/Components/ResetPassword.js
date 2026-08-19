// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//     Container,
//     Box,
//     Typography,
//     TextField,
//     Button,
//     Paper,
//     Alert,
//     CircularProgress,
//     InputAdornment,
//     IconButton,
//     List,
//     ListItem,
//     ListItemIcon,
//     ListItemText,
//     LinearProgress,
// } from '@mui/material';
// import {
//     Visibility,
//     VisibilityOff,
//     CheckCircle as CheckCircleIcon,
//     Error as ErrorIcon,
// } from '@mui/icons-material';
// import toast from 'react-hot-toast';

// const PasswordReset = () => {
//     const navigate = useNavigate();
//     const [formData, setFormData] = useState({
//         email: '',
//         otp: '',
//         newPassword: '',
//         confirmPassword: '',
//     });
//     const [loading, setLoading] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [step, setStep] = useState(1); // 1: email, 2: OTP & new password
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [countdown, setCountdown] = useState(0);
//     const [otpExpiryTime, setOtpExpiryTime] = useState(0);

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

//     const validatePassword = () => {
//         if (!formData.newPassword) {
//             setErrors(prev => ({ ...prev, newPassword: 'Password is required' }));
//             return false;
//         }
//         if (formData.newPassword.length < 6) {
//             setErrors(prev => ({ ...prev, newPassword: 'Password must be at least 6 characters long' }));
//             return false;
//         }
//         if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
//             setErrors(prev => ({ ...prev, newPassword: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' }));
//             return false;
//         }
//         if (formData.newPassword !== formData.confirmPassword) {
//             setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
//             return false;
//         }
//         setErrors(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
//         return true;
//     };

//     const handleRequestOTP = async () => {
//         if (!validateEmail()) return;

//         setLoading(true);
//         try {
//             const response = await fetch('http://localhost:5000/request-password-reset', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ email: formData.email })
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 toast.success('OTP sent to your email');
//                 setStep(2);
//                 setOtpExpiryTime(data.expires_in);
//                 setCountdown(60); // 1 minute cooldown for resend
//             } else {
//                 toast.error(data.error);
//                 setErrors(prev => ({ ...prev, email: data.error }));
//             }
//         } catch (error) {
//             toast.error('Failed to send OTP. Please try again.');
//             setErrors(prev => ({ ...prev, submit: 'Failed to send OTP' }));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleResetPassword = async () => {
//         if (!validatePassword()) return;
//         if (!formData.otp) {
//             setErrors(prev => ({ ...prev, otp: 'OTP is required' }));
//             return;
//         }

//         setLoading(true);
//         try {
//             const response = await fetch('http://localhost:5000/verify-reset-otp', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     email: formData.email,
//                     otp: formData.otp,
//                     new_password: formData.newPassword
//                 })
//             });

//             const data = await response.json();

//             if (response.ok) {
//                 toast.success('Password reset successful!');
//                 setTimeout(() => {
//                     navigate('/login');
//                 }, 2000);
//             } else {
//                 toast.error(data.error);
//                 setErrors(prev => ({ ...prev, otp: data.error }));
//             }
//         } catch (error) {
//             toast.error('Failed to reset password. Please try again.');
//             setErrors(prev => ({ ...prev, submit: 'Failed to reset password' }));
//         } finally {
//             setLoading(false);
//         }
//     };

//     const calculatePasswordStrength = (password) => {
//         let score = 0;
//         if (!password) return 0;

//         // Length check
//         if (password.length >= 8) score += 20;
//         if (password.length >= 12) score += 10;

//         // Character variety checks
//         if (/[A-Z]/.test(password)) score += 20;
//         if (/[a-z]/.test(password)) score += 20;
//         if (/[0-9]/.test(password)) score += 20;
//         if (/[^A-Za-z0-9]/.test(password)) score += 10;

//         return Math.min(100, score);
//     };

//     const getStrengthColor = (strength) => {
//         if (strength < 40) return 'error';
//         if (strength < 70) return 'warning';
//         return 'success';
//     };

//     const getStrengthLabel = (strength) => {
//         if (strength < 40) return 'Weak';
//         if (strength < 70) return 'Medium';
//         return 'Strong';
//     };

//     const getPasswordRequirements = () => {
//         const requirements = [
//             { text: 'At least 6 characters long', met: formData.newPassword.length >= 6 },
//             { text: 'Contains at least one uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
//             { text: 'Contains at least one lowercase letter', met: /[a-z]/.test(formData.newPassword) },
//             { text: 'Contains at least one number', met: /\d/.test(formData.newPassword) },
//             { text: 'Passwords match', met: formData.newPassword && formData.newPassword === formData.confirmPassword }
//         ];
//         return requirements;
//     };

//     return (
//         <Container maxWidth="sm">
//             <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
//                 <Typography variant="h4" component="h1" align="center" gutterBottom>
//                     Reset Password
//                 </Typography>

//                 <Box component="form" sx={{ mt: 3 }}>
//                     {step === 1 ? (
//                         <>
//                             <TextField
//                                 fullWidth
//                                 label="IITRPR Email"
//                                 value={formData.email}
//                                 onChange={(e) => {
//                                     setFormData(prev => ({ ...prev, email: e.target.value }));
//                                     setErrors(prev => ({ ...prev, email: '' }));
//                                 }}
//                                 error={!!errors.email}
//                                 helperText={errors.email}
//                                 disabled={loading}
//                                 margin="normal"
//                                 placeholder="username@iitrpr.ac.in"
//                             />

//                             <Button
//                                 fullWidth
//                                 variant="contained"
//                                 onClick={handleRequestOTP}
//                                 disabled={loading}
//                                 sx={{ mt: 3 }}
//                             >
//                                 {loading ? <CircularProgress size={24} /> : 'Request OTP'}
//                             </Button>
//                         </>
//                     ) : (
//                         <>
//                             <TextField
//                                 fullWidth
//                                 label="Enter OTP"
//                                 value={formData.otp}
//                                 onChange={(e) => {
//                                     const value = e.target.value.replace(/\D/g, '').slice(0, 6);
//                                     setFormData(prev => ({ ...prev, otp: value }));
//                                     setErrors(prev => ({ ...prev, otp: '' }));
//                                 }}
//                                 error={!!errors.otp}
//                                 helperText={errors.otp || `OTP expires in ${Math.ceil(otpExpiryTime / 60)} minutes`}
//                                 margin="normal"
//                                 disabled={loading}
//                             />

//                             <TextField
//                                 fullWidth
//                                 label="New Password"
//                                 type={showPassword ? 'text' : 'password'}
//                                 value={formData.newPassword}
//                                 onChange={(e) => {
//                                     setFormData(prev => ({ ...prev, newPassword: e.target.value }));
//                                     setErrors(prev => ({ ...prev, newPassword: '' }));
//                                 }}
//                                 error={!!errors.newPassword}
//                                 helperText={errors.newPassword}
//                                 margin="normal"
//                                 disabled={loading}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton
//                                                 onClick={() => setShowPassword(!showPassword)}
//                                                 edge="end"
//                                             >
//                                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />

//                             {formData.newPassword && (
//                                 <>
//                                     <Box sx={{ mt: 2, mb: 1 }}>
//                                         <Typography variant="body2" gutterBottom>
//                                             Password Strength: {getStrengthLabel(calculatePasswordStrength(formData.newPassword))}
//                                         </Typography>
//                                         <LinearProgress
//                                             variant="determinate"
//                                             value={calculatePasswordStrength(formData.newPassword)}
//                                             color={getStrengthColor(calculatePasswordStrength(formData.newPassword))}
//                                             sx={{ height: 8, borderRadius: 4 }}
//                                         />
//                                     </Box>
//                                     <List dense sx={{ mt: 1, mb: 1 }}>
//                                         {getPasswordRequirements().map((req, index) => (
//                                             <ListItem key={index} sx={{ py: 0.5 }}>
//                                                 <ListItemIcon sx={{ minWidth: 36 }}>
//                                                     {req.met ? (
//                                                         <CheckCircleIcon color="success" fontSize="small" />
//                                                     ) : (
//                                                         <ErrorIcon color="error" fontSize="small" />
//                                                     )}
//                                                 </ListItemIcon>
//                                                 <ListItemText
//                                                     primary={req.text}
//                                                     sx={{
//                                                         '& .MuiListItemText-primary': {
//                                                             fontSize: '0.875rem',
//                                                             color: req.met ? 'success.main' : 'text.secondary'
//                                                         }
//                                                     }}
//                                                 />
//                                             </ListItem>
//                                         ))}
//                                     </List>
//                                 </>
//                             )}

//                             <TextField
//                                 fullWidth
//                                 label="Confirm New Password"
//                                 type={showConfirmPassword ? 'text' : 'password'}
//                                 value={formData.confirmPassword}
//                                 onChange={(e) => {
//                                     setFormData(prev => ({ ...prev, confirmPassword: e.target.value }));
//                                     setErrors(prev => ({ ...prev, confirmPassword: '' }));
//                                 }}
//                                 error={!!errors.confirmPassword}
//                                 helperText={errors.confirmPassword}
//                                 margin="normal"
//                                 disabled={loading}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton
//                                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                                 edge="end"
//                                             >
//                                                 {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />

//                             <Button
//                                 fullWidth
//                                 variant="contained"
//                                 onClick={handleResetPassword}
//                                 disabled={loading}
//                                 sx={{ mt: 3 }}
//                             >
//                                 {loading ? <CircularProgress size={24} /> : 'Reset Password'}
//                             </Button>

//                             <Button
//                                 fullWidth
//                                 variant="outlined"
//                                 onClick={handleRequestOTP}
//                                 disabled={loading || countdown > 0}
//                                 sx={{ mt: 2 }}
//                             >
//                                 {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
//                             </Button>
//                         </>
//                     )}

//                     <Button
//                         fullWidth
//                         variant="text"
//                         onClick={() => navigate('/login')}
//                         sx={{ mt: 2 }}
//                     >
//                         Back to Login
//                     </Button>
//                 </Box>
//             </Paper>
//         </Container>
//     );
// };

// export default PasswordReset; 
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
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import { Visibility, VisibilityOff, CheckCircle as CheckCircleIcon, Error as ErrorIcon } from "@mui/icons-material"
import toast from "react-hot-toast"

const ResetPassword = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [otpExpiryTime, setOtpExpiryTime] = useState(null)
  const [serverError, setServerError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isOtpVerified, setIsOtpVerified] = useState(false)

  const steps = ["Enter Email", "Verify OTP", "Reset Password"]

  useEffect(() => {
    let timer
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [countdown])

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

  const validateOTP = () => {
    if (!formData.otp) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }))
      return false
    }
    if (!/^\d{6}$/.test(formData.otp)) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be 6 digits" }))
      return false
    }
    setErrors((prev) => ({ ...prev, otp: "" }))
    return true
  }

  const validatePassword = () => {
    if (!formData.newPassword) {
      setErrors((prev) => ({ ...prev, newPassword: "Password is required" }))
      return false
    }
    if (formData.newPassword.length < 6) {
      setErrors((prev) => ({ ...prev, newPassword: "Password must be at least 6 characters long" }))
      return false
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }))
      return false
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }))
      return false
    }
    setErrors((prev) => ({ ...prev, newPassword: "", confirmPassword: "" }))
    return true
  }

  const handleRequestOTP = async (e) => {
    e.preventDefault()
    setServerError("")

    if (!validateEmail()) return

    setLoading(true)
    try {
      console.log("Checking if account exists...")
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
      console.log("Account check response:", checkData)

      if (!checkResponse.ok) {
        if (checkData.error === "Account not found") {
          setErrors((prev) => ({ ...prev, email: "No account found with this email" }))
          toast.error("No account found with this email")
          return
        } else if (!checkData.is_verified) {
          setErrors((prev) => ({ ...prev, email: "Please complete your signup verification first" }))
          toast.error("Please complete your signup verification first")
          return
        }
      }

      console.log("Requesting password reset OTP...")
      const response = await fetch("http://localhost:5000/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()
      console.log("Password reset OTP response:", data)

      if (response.ok) {
        toast.success("Password reset instructions sent to your email")
        setActiveStep(1)
        setOtpExpiryTime(Date.now() + 10 * 60 * 1000) // 10 minutes
        setCountdown(60) // 1 minute cooldown for resend
      } else {
        if (response.status === 429) {
          // Handle rate limiting
          const retryAfter = response.headers.get('Retry-After')
          const waitTime = retryAfter ? parseInt(retryAfter) : 60
          setCountdown(waitTime)
          toast.error(`Too many attempts. Please try again in ${waitTime} seconds.`)
        } else if (data.error === "Too many attempts") {
          toast.error("Too many attempts. Please try again later.")
          setCountdown(600) // 10 minutes cooldown
        } else {
          toast.error(data.error || "Failed to send reset instructions")
        }
        setServerError(data.message || data.error || "Failed to send reset instructions")
      }
    } catch (error) {
      console.error("Error requesting password reset:", error)
      toast.error("Failed to send reset instructions. Please try again.")
      setServerError("Failed to send reset instructions. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setServerError("")

    if (!validateOTP()) return

    setLoading(true)
    try {
      console.log("Verifying OTP...", {
        email: formData.email,
        otp: formData.otp,
        verify_only: false
      })
      
      const response = await fetch("http://localhost:5000/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          verify_only: false
        }),
      })

      console.log("OTP verification response status:", response.status)
      const data = await response.json()
      console.log("OTP verification response data:", data)

      if (response.ok) {
        toast.success("OTP verified successfully")
        setIsOtpVerified(true)
        setActiveStep(2)
      } else {
        if (data.error === "Invalid code") {
          toast.error(data.message || "Invalid OTP")
          setErrors((prev) => ({ ...prev, otp: data.message || "Invalid OTP" }))
        } else if (data.error === "Code expired") {
          toast.error("OTP has expired. Please request a new one.")
          setActiveStep(0)
        } else if (data.error === "Max attempts reached") {
          toast.error("Too many attempts. Please request a new OTP.")
          setActiveStep(0)
        } else {
          toast.error(data.message || data.error || "Failed to verify OTP")
          setServerError(data.message || data.error || "Failed to verify OTP")
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      toast.error("Failed to verify OTP. Please try again.")
      setServerError("Failed to verify OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setServerError("")

    if (!validatePassword()) return

    if (!isOtpVerified) {
      toast.error("Please verify your OTP first")
      return
    }

    setLoading(true)
    try {
      console.log("Proceeding with password reset...")
      const response = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: formData.email,
          new_password: formData.newPassword
        }),
      })

      console.log("Password reset response status:", response.status)
      const data = await response.json()
      console.log("Password reset response data:", data)

      if (response.ok) {
        setSuccess(true)
        toast.success("Password reset successful! Redirecting to login...")
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      } else {
        if (data.error === "Please verify your OTP first") {
          toast.error("Please verify your OTP first")
          setActiveStep(1)
        } else {
          toast.error(data.message || data.error || "Failed to reset password")
          setServerError(data.message || data.error || "Failed to reset password")
        }
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      toast.error("Failed to reset password. Please try again.")
      setServerError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return

    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("New OTP sent to your email")
        setOtpExpiryTime(Date.now() + 10 * 60 * 1000) // 10 minutes
        setCountdown(60) // 1 minute cooldown for resend
      } else {
        toast.error(data.error || "Failed to send OTP")
        setServerError(data.message || data.error || "Failed to send OTP")
      }
    } catch (error) {
      console.error("Error resending OTP:", error)
      toast.error("Failed to send OTP. Please try again.")
      setServerError("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const calculatePasswordStrength = (password) => {
    let score = 0
    if (!password) return 0

    // Length check
    if (password.length >= 8) score += 20
    if (password.length >= 12) score += 10

    // Character variety checks
    if (/[A-Z]/.test(password)) score += 20
    if (/[a-z]/.test(password)) score += 20
    if (/[0-9]/.test(password)) score += 20
    if (/[^A-Za-z0-9]/.test(password)) score += 10

    return Math.min(100, score)
  }

  const getStrengthColor = (strength) => {
    if (strength < 40) return "error"
    if (strength < 70) return "warning"
    return "success"
  }

  const getStrengthLabel = (strength) => {
    if (strength < 40) return "Weak"
    if (strength < 70) return "Medium"
    return "Strong"
  }

  const getPasswordRequirements = () => {
    const requirements = [
      { text: "At least 6 characters long", met: formData.newPassword.length >= 6 },
      { text: "Contains at least one uppercase letter", met: /[A-Z]/.test(formData.newPassword) },
      { text: "Contains at least one lowercase letter", met: /[a-z]/.test(formData.newPassword) },
      { text: "Contains at least one number", met: /\d/.test(formData.newPassword) },
      { text: "Passwords match", met: formData.newPassword && formData.newPassword === formData.confirmPassword },
    ]
    return requirements
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleRequestOTP}>
            <TextField
              fullWidth
              required
              label="IITRPR Email"
              value={formData.email}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, email: e.target.value }))
                setErrors((prev) => ({ ...prev, email: "" }))
                setServerError("")
              }}
              error={!!errors.email}
              helperText={errors.email || "Enter your IITRPR email address"}
              disabled={loading}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Instructions"}
            </Button>
          </Box>
        )
      case 1:
        return (
          <Box component="form" onSubmit={handleVerifyOTP}>
            <Typography variant="body1" gutterBottom sx={{ color: "white", textAlign: "center", mb: 2 }}>
              We've sent a verification code to your email address: {formData.email}
            </Typography>

            <TextField
              fullWidth
              required
              label="Enter OTP"
              value={formData.otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                setFormData((prev) => ({ ...prev, otp: value }))
                setErrors((prev) => ({ ...prev, otp: "" }))
                setServerError("")
              }}
              error={!!errors.otp}
              helperText={errors.otp || "Enter the 6-digit code sent to your email"}
              margin="normal"
              disabled={loading}
              inputProps={{ maxLength: 6 }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  "& fieldset": {
                    borderColor: "rgb(95, 99, 104)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgb(138, 14399,104)",
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

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              <Typography variant="body2" sx={{ color: "rgb(138, 143, 150)" }}>
                {otpExpiryTime &&
                  `OTP expires in ${Math.max(0, Math.floor((otpExpiryTime - Date.now()) / 60000))} minutes`}
              </Typography>
              <Button
                variant="text"
                onClick={handleResendOTP}
                disabled={loading || countdown > 0}
                sx={{
                  color: countdown > 0 ? "rgba(255, 255, 255, 0.3)" : "#7c3aed",
                }}
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
              </Button>
            </Box>

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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Verify OTP"}
            </Button>
          </Box>
        )
      case 2:
        return (
          <Box component="form" onSubmit={handleResetPassword}>
            <TextField
              fullWidth
              required
              label="New Password"
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, newPassword: e.target.value }))
                setErrors((prev) => ({ ...prev, newPassword: "" }))
                setServerError("")
              }}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
              margin="normal"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
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
                  color: errors.newPassword ? "error.main" : "rgb(138, 143, 150)",
                },
              }}
            />

            {formData.newPassword && (
              <>
                <Box sx={{ mt: 2, mb: 1 }}>
                  <Typography variant="body2" gutterBottom sx={{ color: "white" }}>
                    Password Strength: {getStrengthLabel(calculatePasswordStrength(formData.newPassword))}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={calculatePasswordStrength(formData.newPassword)}
                    color={getStrengthColor(calculatePasswordStrength(formData.newPassword))}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <List dense sx={{ mt: 1, mb: 1 }}>
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
              </>
            )}

            <TextField
              fullWidth
              required
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                setServerError("")
              }}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              margin="normal"
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: "rgb(138, 143, 150)" }}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Reset Password"}
            </Button>
          </Box>
        )
      default:
        return null
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
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Reset Password
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
          <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
            <Typography variant="body1" sx={{ color: "white" }}>
              Step {activeStep + 1} of 3: {steps[activeStep]}
            </Typography>
          </Box>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Password reset successful! Redirecting to login...
          </Alert>
        )}

        {serverError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {serverError}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Link
            to="/login"
            style={{
              color: "#7c3aed",
              textDecoration: "none",
            }}
          >
            Back to Login
          </Link>
        </Box>
      </Paper>
    </Container>
  )
}

export default ResetPassword