# Portfolio Application

A modern, secure portfolio application built with React, TypeScript, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later
- Git
- Docker (optional)
- Authenticator app (Google Authenticator, Authy, etc.) for 2FA

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Set up a Supabase project at https://supabase.com
   - Update `.env` with your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

### Docker Setup

1. **Build the image**
   ```bash
   docker build -t portfolio .
   ```

2. **Run the container**
   ```bash
   docker run -p 8080:8080 portfolio
   ```

## 🔒 Security Features

### Two-Factor Authentication (2FA)
- Mandatory 2FA for all new accounts
- TOTP (Time-based One-Time Password) implementation
- QR code setup during registration
- Compatible with standard authenticator apps
- Secure recovery process

### Additional Security
- Row Level Security (RLS) with Supabase
- Security headers with Nginx
- SAST scanning in CI/CD
- Docker security hardening
- Rate limiting for authentication attempts

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **State Management**: React Context
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Authentication**: Supabase Auth with 2FA
- **Database**: Supabase (PostgreSQL)
- **Testing**: Vitest
- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Deployment**: Netlify

## 📦 Project Structure

```
├── src/
│   ├── components/    # Reusable UI components
│   ├── contexts/      # React contexts
│   ├── lib/          # Utilities and API clients
│   ├── pages/        # Page components
│   └── types/        # TypeScript type definitions
├── public/           # Static assets
├── .github/          # GitHub Actions workflows
└── supabase/        # Supabase migrations
```

## 🔐 Authentication

The application uses Supabase Authentication with:
- Email/Password authentication
- Mandatory Two-Factor Authentication
  - TOTP-based implementation
  - QR code setup process
  - Compatible with Google Authenticator, Authy, etc.
- Rate limiting (5 attempts per 15 minutes)
- Session management
- Secure password requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

## 🚀 Deployment

Automated deployment via GitHub Actions to Netlify:
1. Push to main branch
2. CI/CD pipeline runs tests and security scans
3. Builds Docker image
4. Deploys to Netlify

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📝 License

MIT License - see LICENSE file for details