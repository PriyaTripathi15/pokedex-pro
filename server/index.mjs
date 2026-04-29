import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import FileStore from 'session-file-store';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 3000);

const appBaseUrl =
  process.env.APP_BASE_URL ||
  (isProduction
    ? 'https://pokedex-pro-ks7o.onrender.com'
    : `http://localhost:${port}`);

const app = express();

app.set('trust proxy', 1); // ✅ IMPORTANT (for Render cookies)

const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const githubConfigured = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

app.use(express.json());

// ✅ FIXED SESSION CONFIG with FileStore for production
const StoreFactory = FileStore(session);
const sessionStore = isProduction 
  ? new StoreFactory({ path: './sessions' })
  : undefined;

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'pokedex-pro-dev-session-secret',
    resave: false,

    // 🔥 IMPORTANT FIX
    saveUninitialized: true,

    cookie: {
      httpOnly: true,

      // ✅ FIXED for production + localhost
      sameSite: isProduction ? 'none' : 'lax',

      secure: isProduction, // must be true in production (https)
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const normalizeProfile = (provider, profile) => ({
  id: `${provider}:${profile.id}`,
  provider,
  name: profile.displayName || profile.username || 'Pokémon Trainer',
  email: profile.emails?.[0]?.value || null,
  avatar: profile.photos?.[0]?.value || null,
  accent: provider === 'google' ? 'from-red-500 to-yellow-300' : 'from-yellow-300 to-red-500',
});

// ================= GOOGLE =================
if (googleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.GOOGLE_CALLBACK_URL ||
          `${appBaseUrl}/auth/google/callback`,
      },
      (_accessToken, _refreshToken, profile, done) =>
        done(null, normalizeProfile('google', profile))
    )
  );
}

// ================= GITHUB =================
if (githubConfigured) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.GITHUB_CALLBACK_URL ||
          `${appBaseUrl}/auth/github/callback`,
        scope: ['user:email'],
      },
      (_accessToken, _refreshToken, profile, done) =>
        done(null, normalizeProfile('github', profile))
    )
  );
}

// ================= AUTH APIs =================
app.get('/api/auth/me', (req, res) => {
  res.json({
    user: req.user || null,
    configured: {
      google: googleConfigured,
      github: githubConfigured,
    },
  });
});

// GOOGLE LOGIN
app.get('/auth/google', (req, res, next) => {
  if (!googleConfigured) return res.status(501).send('Google OAuth not configured');
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/auth/google/callback', (req, res, next) => {
  if (!googleConfigured) return res.status(501).send('Google OAuth not configured');

  passport.authenticate('google', { failureRedirect: '/' })(
    req,
    res,
    () => {
      res.redirect(process.env.CLIENT_URL || '/');
    }
  );
});

// GITHUB LOGIN
app.get('/auth/github', (req, res, next) => {
  if (!githubConfigured) return res.status(501).send('GitHub OAuth not configured');
  passport.authenticate('github')(req, res, next);
});

app.get('/auth/github/callback', (req, res, next) => {
  if (!githubConfigured) return res.status(501).send('GitHub OAuth not configured');

  passport.authenticate('github', { failureRedirect: '/' })(
    req,
    res,
    () => {
      res.redirect(process.env.CLIENT_URL || '/');
    }
  );
});

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect(process.env.CLIENT_URL || '/');
    });
  });
});