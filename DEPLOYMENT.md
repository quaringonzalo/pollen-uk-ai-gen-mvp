# Pollen Platform - Self-Hosting Guide

## Overview

Pollen is a self-hostable skills-first career platform built with modern web technologies. This guide covers deployment options and future extensibility considerations.

## Architecture

### Tech Stack
- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: PostgreSQL-backed sessions
- **File Storage**: Local filesystem (extensible to S3/cloud storage)

### Self-Hosting Requirements

#### Minimum System Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 20GB SSD
- **OS**: Linux (Ubuntu 20.04+ recommended)

#### Dependencies
- Node.js 18+
- PostgreSQL 14+
- nginx (for production reverse proxy)
- SSL certificate (Let's Encrypt recommended)

## Deployment Options

### Option 1: Docker Deployment (Recommended)

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 5000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  pollen-app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://username:password@db:5432/pollen
      - SESSION_SECRET=your-secure-session-secret
      - NODE_ENV=production
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=pollen
      - POSTGRES_USER=username
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - pollen-app
    restart: unless-stopped

volumes:
  postgres_data:
```

### Option 2: Manual Deployment

```bash
# 1. Clone repository
git clone <your-repo-url>
cd pollen-platform

# 2. Install dependencies
npm install

# 3. Set environment variables
export DATABASE_URL="postgresql://username:password@localhost:5432/pollen"
export SESSION_SECRET="your-secure-session-secret"
export NODE_ENV="production"

# 4. Build application
npm run build

# 5. Run database migrations
npm run db:push

# 6. Start application
npm start
```

### Option 3: Cloud Platform Deployment

The platform is compatible with:
- **Railway**: One-click deployment with built-in PostgreSQL
- **Render**: Web service + PostgreSQL addon
- **DigitalOcean App Platform**: Managed container deployment
- **AWS ECS/Fargate**: Enterprise container deployment
- **Google Cloud Run**: Serverless container deployment

## Environment Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Session Management
SESSION_SECRET=your-secure-random-string

# Application
NODE_ENV=production
PORT=5000

# Optional: File Storage (for future S3 integration)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=

# Optional: Email Service (for future notifications)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### Security Considerations

1. **Use strong passwords** for database and session secrets
2. **Enable SSL/TLS** for all communications
3. **Implement rate limiting** (already configured)
4. **Regular security updates** for dependencies
5. **Database backups** with encryption
6. **Environment variable encryption** in production

## Future Extensibility

### Planned Integration Points

#### 1. ATS (Applicant Tracking System) Integration
```typescript
// server/integrations/ats/
interface ATSIntegration {
  syncApplications(): Promise<Application[]>;
  pushCandidate(candidate: JobSeekerProfile): Promise<void>;
  getJobPostings(): Promise<Job[]>;
  updateApplicationStatus(id: string, status: string): Promise<void>;
}

// Supported ATS systems (future):
// - Greenhouse
// - Lever
// - BambooHR
// - Workday
// - JazzHR
```

#### 2. External Job Board Integration
```typescript
// server/integrations/job-boards/
interface JobBoardIntegration {
  fetchJobs(filters: JobFilters): Promise<Job[]>;
  postJob(job: Job): Promise<string>;
  syncApplications(): Promise<void>;
}

// Supported job boards (future):
// - Indeed
// - LinkedIn
// - AngelList
// - Stack Overflow Jobs
// - RemoteOK
```

#### 3. Skills Assessment Platform Integration
```typescript
// server/integrations/assessments/
interface AssessmentIntegration {
  createChallenge(challenge: Challenge): Promise<string>;
  getResults(attemptId: string): Promise<AssessmentResult>;
  validateSkills(skills: string[]): Promise<SkillValidation>;
}

// Supported platforms (future):
// - HackerRank
// - Codility
// - CodinGame
// - TestGorilla
```

### Database Migration Strategy

The platform uses Drizzle ORM for type-safe database migrations:

```bash
# Generate migration
npm run db:generate

# Apply migration
npm run db:push

# Rollback (if needed)
npm run db:drop
```

### API Extensibility

The REST API is designed for easy extension:

```typescript
// New integration example
app.use('/api/integrations/ats', atsRouter);
app.use('/api/integrations/job-boards', jobBoardRouter);
app.use('/api/integrations/assessments', assessmentRouter);
```

### Plugin Architecture (Future)

```typescript
// Plugin interface for future extensions
interface PollenPlugin {
  name: string;
  version: string;
  initialize(app: Express): Promise<void>;
  routes?: Router;
  middleware?: RequestHandler[];
  hooks?: {
    beforeJobCreation?: (job: Job) => Promise<Job>;
    afterApplicationSubmission?: (application: Application) => Promise<void>;
  };
}
```

## Monitoring and Maintenance

### Health Checks
- Database connectivity: `/api/health/db`
- Application status: `/api/health/app`
- Memory usage: `/api/health/memory`

### Logging
- Application logs: `logs/app.log`
- Error logs: `logs/error.log`
- Access logs: `logs/access.log`

### Backup Strategy
1. **Database**: Daily automated backups with 30-day retention
2. **File storage**: Incremental backups to S3/cloud storage
3. **Configuration**: Version-controlled environment configs

### Performance Monitoring
- Response time monitoring
- Database query performance
- Memory and CPU usage
- Error rate tracking

## Support and Updates

### Self-Hosting Support
- Community forum for self-hosting questions
- Documentation wiki with common issues
- Docker images with security updates
- Migration guides for major versions

### Update Process
1. Review changelog and breaking changes
2. Backup database and configuration
3. Pull latest code/Docker image
4. Run database migrations
5. Test in staging environment
6. Deploy to production
7. Verify functionality

## Compliance and Data Privacy

### Data Protection
- GDPR compliance features built-in
- Data export/deletion capabilities
- Audit logging for sensitive operations
- Encryption at rest and in transit

### Regional Deployment
- Multi-region database replication
- CDN integration for global performance
- Compliance with local data residency requirements

This self-hosting approach ensures you maintain full control over your data while enabling future growth and integration capabilities.