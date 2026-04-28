import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT || 3000);
const appBaseUrl = process.env.APP_BASE_URL || `http://localhost:${port}`;

const googleConfigured = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
const githubConfigured = Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);

const app = express();

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'pokedex-pro-dev-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
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

if (googleConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${appBaseUrl}/auth/google/callback`,
      },
      (_accessToken, _refreshToken, profile, done) => done(null, normalizeProfile('google', profile))
    )
  );
}

if (githubConfigured) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${appBaseUrl}/auth/github/callback`,
        scope: ['user:email'],
      },
      (_accessToken, _refreshToken, profile, done) => done(null, normalizeProfile('github', profile))
    )
  );
}

app.get('/api/auth/me', (req, res) => {
  res.json({
    user: req.user || null,
    configured: {
      google: googleConfigured,
      github: githubConfigured,
    },
  });
});

app.get('/auth/google', (req, res, next) => {
  if (!googleConfigured) {
    res.status(501).send('Google OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.');
    return;
  }

  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

app.get('/auth/google/callback', (req, res, next) => {
  if (!googleConfigured) {
    res.status(501).send('Google OAuth is not configured.');
    return;
  }

  passport.authenticate('google', { failureRedirect: '/' })(req, res, () => {
    res.redirect('/');
  });
});

app.get('/auth/github', (req, res, next) => {
  if (!githubConfigured) {
    res.status(501).send('GitHub OAuth is not configured. Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET.');
    return;
  }

  passport.authenticate('github')(req, res, next);
});

app.get('/auth/github/callback', (req, res, next) => {
  if (!githubConfigured) {
    res.status(501).send('GitHub OAuth is not configured.');
    return;
  }

  passport.authenticate('github', { failureRedirect: '/' })(req, res, () => {
    res.redirect('/');
  });
});

app.get('/auth/logout', (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

let vite;

if (!isProduction) {
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  app.use(vite.middlewares);
} else {
  app.use('/assets', express.static(path.resolve(root, 'dist/client/assets')));
}

app.use('*', async (req, res, next) => {
  try {
    const url = req.originalUrl;
    let template;
    let render;

    if (!isProduction) {
      template = fs.readFileSync(path.resolve(root, 'index.html'), 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.jsx')).render;
    } else {
      template = fs.readFileSync(path.resolve(root, 'dist/client/index.html'), 'utf-8');
      render = (await import(path.resolve(root, 'dist/server/entry-server.mjs'))).render;
    }

    const initialState = {
      ssr: true,
      user: req.user || null,
    };

    const appHtml = await render(url, initialState);
    const html = template
      .replace('<!--app-html-->', appHtml)
      .replace(
        'window.__INITIAL_STATE__ = { ssr: false }',
        `window.__INITIAL_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')}`
      );

    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
  } catch (error) {
    if (vite) {
      vite.ssrFixStacktrace(error);
    }
    next(error);
  }
});

app.listen(port, () => {
  console.log(`SSR server running at ${appBaseUrl}`);
});