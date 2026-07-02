import * as authSvc from '../services/auth.service.js';
import { asyncHandler, ok } from '../utils/apiError.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authSvc.register(req.body);
  ok(res, user, 'Registered. Check your email to verify.', 201);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  await authSvc.verifyEmail(req.body);
  ok(res, null, 'Email verified');
});

export const login = asyncHandler(async (req, res) => {
  const out = await authSvc.login({
    ...req.body,
    ua: req.headers["user-agent"],
    ip: req.ip,
  });

  // Frontend is Bearer-token based (localStorage + Authorization header).
  // Tokens are returned in the body; the client mirrors auth_token/auth_role
  // into cookies for the edge middleware. No httpOnly cookies here so logout
  // can fully clear auth client-side.
  return ok(
    res,
    { user: out.user, accessToken: out.accessToken, refreshToken: out.refreshToken },
    "Logged in"
  );
});
export const google = asyncHandler(async (req, res) => {
  const out = await authSvc.googleAuth({
    idToken: req.body.idToken,
    ua: req.headers['user-agent'],
    ip: req.ip,
  });
  return ok(res, { user: out.user, accessToken: out.accessToken, refreshToken: out.refreshToken }, 'Logged in with Google');
});

export const refresh = asyncHandler(async (req, res) => {
  const out = await authSvc.refresh(req.body);
  ok(res, out, 'Token refreshed');
});

export const logout = asyncHandler(async (req, res) => {
  await authSvc.logout(req.body);
  // Clear any legacy httpOnly cookies set by older sessions
  res.clearCookie("auth_token", { path: "/" });
  res.clearCookie("refresh_token", { path: "/" });
  ok(res, null, 'Logged out');
});

export const logoutAll = asyncHandler(async (req, res) => {
  await authSvc.logoutAll(req.user.id);
  ok(res, null, 'All sessions revoked');
});

// controllers/auth.controller.js

// controllers/auth.controller.js

export const forgot = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
        data: null,
      });
    }

    await authSvc.requestPasswordReset({ email });

    return res.status(200).json({
      success: true,
      message: 'If account exists, reset email sent',
      data: {
        success:true,
        emailSent: true,
        email,
      },
    });
  } catch (error) {
    console.error(
      'Forgot controller error:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        'Something went wrong while processing request',
      data: null,
    });
  }
});

export const reset = asyncHandler(async (req, res) => {
  try {
    console.log('Reset password request received:', req.body);
    const { token, email, newPassword } =
      req.body;

    // Validation
    if (!token || !email || !newPassword) {
      return res.status(400).json({
        success: false,
        message:
          'Token, email and new password are required',
        data: null,
      });
    }

    await authSvc.resetPassword(req.body);

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: {
         success: true,
        passwordReset: true,
         message: 'Password reset successfully',
      },
    });
  } catch (error) {
    console.error(
      'Reset password controller erro   r:',
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        'Failed to reset password',
      data: null,
    });
  }
});

export const me = asyncHandler(async (req, res) => {
  console.log("asdd")
  const User = (await import('../models/User.js')).default;
  const user = await User.findById(req.user.id);
  ok(res, user);
});