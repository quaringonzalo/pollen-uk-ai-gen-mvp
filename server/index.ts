import express, { type Request, Response, NextFunction } from "express";
import session, { type Session } from "express-session";

// Extend Express Request interface for authentication
declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      role: string;
    }
    
    interface Request {
      session: Session & Partial<SessionData>;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    userRole?: string;
  }
}
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { registerRoutes } from "./routes";
import { seedNotifications } from "./seed-notifications";
import { setupVite, serveStatic, log } from "./vite";
import { storage } from "./storage";

const app = express();

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static assets from attached_assets directory
app.use('/attached_assets', express.static('attached_assets'));

// Session configuration - Updated for deployment compatibility
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Disable secure cookies for now to work in deployment
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

// Basic authentication strategy (simplified for the behavioral assessment)
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await storage.getUserByEmail(email);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Add mock authentication for testing purposes
app.use((req, res, next) => {
  const isProfileEndpoint = req.path.startsWith('/api/behavioral-assessment') || 
                           req.path.startsWith('/api/behavioural-assessment') ||
                           req.path.startsWith('/api/checkpoint-progress') ||
                           req.path.startsWith('/api/profile-completion-status') ||
                           req.path.startsWith('/api/profile-completeness') ||
                           req.path.startsWith('/api/assessment-questions') ||
                           req.path.startsWith('/api/notifications');
                           
  if (!req.user && isProfileEndpoint) {
    // Create a mock user for profile-related endpoint testing
    const role = req.path.startsWith('/api/notifications') ? 'employer' : 'job_seeker';
    req.user = { id: 1, email: 'test@example.com', role: role };
    
    // Also set session userId for notifications endpoints
    if (!req.session) {
      req.session = {} as any;
    }
    req.session.userId = 1;
  }
  
  // Always provide isAuthenticated method  
  if (!req.isAuthenticated) {
    req.isAuthenticated = () => !!req.user;
  }
  
  next();
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Skip JSON interception for PDF endpoints
  if (path === '/api/generate-pdf') {
    res.on("finish", () => {
      const duration = Date.now() - start;
      log(`${req.method} ${path} ${res.statusCode} in ${duration}ms :: PDF response`);
    });
    return next();
  }

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Seed demo notifications
    await seedNotifications();
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error(`Server error: ${message}`, err);
      res.status(status).json({ message });
    });

  // Setup Vite for development
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  
    // Test database connection on startup
    try {
      await storage.getUser(1);
      log("Database connection successful");
    } catch (error) {
      console.error("Database connection failed:", error);
      process.exit(1);
    }
    
    server.listen(port, "0.0.0.0", () => {
      log(`serving on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();