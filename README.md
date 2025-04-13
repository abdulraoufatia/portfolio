# Portfolio Application

A modern, secure portfolio application built with React, TypeScript, and Supabase.

## React & TypeScript Implementation Details

### React Features Utilized

1. **Functional Components with TypeScript**
   - All components are written as functional components with proper TypeScript interfaces
   - Example from `ArticleToc.tsx`:
   ```typescript
   interface ArticleTocProps {
     content: string;
   }

   function ArticleToc({ content }: ArticleTocProps) {
     // Component implementation
   }
   ```

2. **Custom Hooks**
   - `useAuth` hook for authentication state management
   - Proper TypeScript typing for hook returns and parameters
   ```typescript
   function useAuth(): {
     user: User | null;
     loading: boolean;
     signIn: (email: string, password: string) => Promise<void>;
     signOut: () => Promise<void>;
   }
   ```

3. **Context API**
   - Authentication context with TypeScript interfaces
   - Strongly typed context values and providers
   ```typescript
   interface AuthContextType {
     user: User | null;
     loading: boolean;
     signIn: typeof auth.signIn;
     signOut: typeof auth.signOut;
   }
   ```

4. **React Router Integration**
   - Type-safe routing with React Router v6
   - Protected routes implementation
   - Route parameters with TypeScript

5. **Error Boundaries**
   - Class component implementation with TypeScript
   - Proper error typing and handling

6. **Form Handling**
   - Controlled components with TypeScript interfaces
   - Form validation with TypeScript types
   - Type-safe event handlers

### TypeScript Features

1. **Strict Type Checking**
   - Strict mode enabled in `tsconfig.json`
   - No implicit any
   - Strict null checks

2. **Interface Definitions**
   - Clear interface definitions for all data structures
   ```typescript
   interface Article {
     id: string;
     title: string;
     excerpt: string;
     content: string;
     image_url: string;
     read_time: string;
     category: string;
     slug?: string;
     created_at: string;
     updated_at: string;
   }
   ```

3. **Type Guards**
   - Custom type guards for runtime type checking
   - Error handling with TypeScript discriminated unions

4. **Generic Components**
   - Reusable components with generic types
   - Type-safe props and state

5. **API Type Safety**
   - Type-safe API calls using TypeScript interfaces
   - Response type definitions
   - Error type handling

### State Management

1. **React Hooks**
   - `useState` with TypeScript generics
   ```typescript
   const [articles, setArticles] = useState<Article[]>([]);
   ```
   - `useEffect` with proper dependency typing
   - `useCallback` with typed parameters and return values

2. **Context API with TypeScript**
   - Strongly typed context values
   - Type-safe context providers and consumers

### Component Architecture

1. **Smart vs Presentational Components**
   - Smart components handle logic and state
   - Presentational components focus on UI
   - Clear TypeScript interfaces for props

2. **Component Composition**
   - Type-safe component composition
   - Proper prop typing for child components

3. **Higher-Order Components**
   - TypeScript generics for HOC implementation
   - Proper type inference and prop forwarding

### Testing Implementation

1. **Unit Tests**
   - TypeScript-aware testing with Vitest
   - Strongly typed mocks and assertions
   ```typescript
   test('renders component', () => {
     const props: ComponentProps = {
       title: 'Test',
       onClick: vi.fn()
     };
     render(<Component {...props} />);
   });
   ```

2. **Integration Tests**
   - Type-safe component integration testing
   - API mocking with TypeScript types

3. **End-to-End Tests**
   - Playwright with TypeScript
   - Page object models with TypeScript

### Performance Optimizations

1. **React.memo**
   - Type-safe component memoization
   - Proper prop comparison functions

2. **Code Splitting**
   - Dynamic imports with TypeScript
   - Route-based code splitting

3. **Lazy Loading**
   - Type-safe lazy loading implementation
   - Suspense with TypeScript

### Security Implementations

1. **Type-Safe Authentication**
   - Strongly typed auth context
   - Type-safe JWT handling

2. **Form Validation**
   - TypeScript-based validation schemas
   - Type-safe error handling

### Best Practices Demonstrated

1. **Code Organization**
   - Feature-based folder structure
   - Clear separation of concerns
   - Type definitions in separate files

2. **Error Handling**
   - Type-safe error boundaries
   - Proper error typing
   - Error state management

3. **Performance**
   - Memoization with proper typing
   - Type-safe event handlers
   - Optimized re-renders

4. **Accessibility**
   - Type-safe aria attributes
   - Proper HTML element typing
   - Keyboard navigation handling

This project demonstrates a comprehensive understanding of both React and TypeScript, showing how they can be effectively combined to create a type-safe, maintainable, and scalable application. The implementation showcases modern React patterns while leveraging TypeScript's type system to catch errors early and improve development experience.

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

## 🧪 Testing

The project includes comprehensive test coverage with unit, integration, and end-to-end tests.

### Unit and Integration Tests

Run unit and integration tests using Vitest:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### End-to-End Tests

End-to-end tests are implemented using Playwright:

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI mode
npm run test:e2e:ui
```

The E2E test suite includes:
- Navigation flows
- Responsive design testing
- Authentication flows
- Form validation
- Cross-browser compatibility

Test configurations:
- Desktop browsers: Chrome, Firefox, Safari
- Mobile devices: iPhone 12, Pixel 5

### Continuous Integration

Tests are automatically run in the CI pipeline for:
- Pull requests
- Pushes to main branch
- Deployment verification

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
- **Testing**: 
  - Unit/Integration: Vitest, React Testing Library
  - E2E: Playwright
  - API Mocking: MSW (Mock Service Worker)
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
├── e2e/             # End-to-end tests
├── public/          # Static assets
├── .github/         # GitHub Actions workflows
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

## 📝 License

MIT License - see LICENSE file for details