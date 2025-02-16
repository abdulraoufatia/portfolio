# Technical Documentation

## Architecture Overview

The portfolio application is built using a modern web architecture with the following key components:

### Frontend
- React with TypeScript for type safety
- Vite for fast development and optimized builds
- Tailwind CSS for styling
- Framer Motion for animations
- React Router for navigation
- React Context for state management

### Backend
- Supabase for:
  - PostgreSQL database
  - Authentication with 2FA
  - Row Level Security (RLS)
  - Real-time subscriptions
  - Storage for media files

### Security
- Two-Factor Authentication (2FA)
  - TOTP (Time-based One-Time Password)
  - QR code setup
  - Compatible with standard authenticator apps
- Rate limiting for authentication
- Secure password requirements
- HTTP security headers
- Docker security hardening

### Deployment
- GitHub Actions for CI/CD
- Docker containerization
- Netlify hosting
- Automated security scanning

## Database Schema

### Projects Table
- id: uuid (Primary Key)
- title: text
- description: text
- image_url: text
- github_url: text
- tags: text[]
- created_at: timestamptz
- updated_at: timestamptz
- user_id: uuid (Foreign Key)

### Articles Table
- id: uuid (Primary Key)
- title: text
- excerpt: text
- content: text
- image_url: text
- read_time: text
- created_at: timestamptz
- updated_at: timestamptz
- user_id: uuid (Foreign Key)

### Experiences Table
- id: uuid (Primary Key)
- company: text
- position: text
- period: text
- description: text
- technologies: text[]
- created_at: timestamptz
- updated_at: timestamptz
- user_id: uuid (Foreign Key)

## API Documentation

### Authentication
- POST /auth/signup
  - Creates new user account
  - Enables 2FA
  - Returns QR code for TOTP setup

- POST /auth/signin
  - First step: Email/password verification
  - Second step: 2FA verification
  - Returns JWT on successful authentication

### Projects
- GET /projects
  - Lists all projects
  - Public access

- POST /projects
  - Creates new project
  - Requires authentication

- PUT /projects/:id
  - Updates project
  - Requires authentication
  - Owner only

- DELETE /projects/:id
  - Deletes project
  - Requires authentication
  - Owner only

### Articles
- GET /articles
  - Lists all articles
  - Public access

- POST /articles
  - Creates new article
  - Requires authentication

- PUT /articles/:id
  - Updates article
  - Requires authentication
  - Owner only

- DELETE /articles/:id
  - Deletes article
  - Requires authentication
  - Owner only

### Experiences
- GET /experiences
  - Lists all experiences
  - Public access

- POST /experiences
  - Creates new experience
  - Requires authentication

- PUT /experiences/:id
  - Updates experience
  - Requires authentication
  - Owner only

- DELETE /experiences/:id
  - Deletes experience
  - Requires authentication
  - Owner only

## Security Implementation

### Authentication Flow
1. User enters email/password
2. Server validates credentials
3. If valid, prompts for 2FA code
4. User enters TOTP code from authenticator app
5. Server validates TOTP code
6. If valid, issues JWT

### Rate Limiting
- 5 attempts per 15 minutes for login
- Lockout after exceeded attempts
- Separate counters per IP and email

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Row Level Security
- Public read access for content
- Authenticated write access
- Owner-only update/delete
- User isolation for private data

## Development Setup

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later
- Git
- Docker (optional)
- Authenticator app

### Local Development
1. Clone repository
2. Install dependencies
3. Set up environment variables
4. Run development server
5. Run tests

### Docker Development
1. Build Docker image
2. Run container
3. Access application

## Testing Strategy

### Unit Tests
- Components
- Utilities
- Hooks
- Context providers

### Integration Tests
- API interactions
- Authentication flows
- Form submissions
- Navigation

### End-to-End Tests
- User journeys
- Authentication
- CRUD operations
- Responsive design

## Deployment Process

### CI/CD Pipeline
1. Code push triggers workflow
2. Run tests
3. Security scanning
4. Build Docker image
5. Deploy to Netlify

### Production Deployment
1. Environment validation
2. Database migrations
3. Asset optimization
4. Cache configuration
5. Health checks