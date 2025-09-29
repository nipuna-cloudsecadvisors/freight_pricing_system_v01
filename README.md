# Freight Pricing System

An export-only freight pricing & activity system for Sri Lanka forwarder built with Next.js 14, NestJS, PostgreSQL, and Redis.

## 🚀 Features

### Core Modules
- **Pre-defined Rates**: Region-based trade lanes with validity windows and visual highlights
- **Rate Requests**: FCL/LCL requests with comprehensive validation and workflow
- **Booking Management**: Complete procurement workflow from rate selection to job completion
- **Itineraries & Activities**: Weekly planning and sales activity tracking
- **Reports & Dashboards**: KPI tracking and management insights
- **Admin Panel**: User management, system configuration, and global search

### Key Features
- ✅ **Export-Only Focus**: Sea Export + Air Export (no import workflows)
- ✅ **Role-Based Access**: ADMIN, SBU_HEAD, SALES, CSE, PRICING, MGMT
- ✅ **Real-time Notifications**: System, Email, and SMS notifications
- ✅ **Comprehensive Validation**: Business rules enforcement and data integrity
- ✅ **Modern UI**: Responsive design with Tailwind CSS
- ✅ **API Documentation**: Swagger/OpenAPI integration
- ✅ **Docker Ready**: Complete containerization with Docker Compose

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, TanStack Query
- **Backend**: NestJS, TypeScript, Prisma ORM
- **Database**: PostgreSQL with Redis for caching/queues
- **Authentication**: JWT with refresh tokens
- **Notifications**: SMTP email + pluggable SMS providers
- **Infrastructure**: Docker Compose with Nginx reverse proxy

### Project Structure
```
freight-pricing-system/
├── apps/
│   ├── api/                 # NestJS API server
│   │   ├── src/
│   │   │   ├── auth/        # Authentication & authorization
│   │   │   ├── users/       # User management
│   │   │   ├── customers/   # Customer management
│   │   │   ├── masters/     # Master data (ports, trade lanes, etc.)
│   │   │   ├── rates/       # Predefined rates & rate requests
│   │   │   ├── booking/     # Booking management
│   │   │   ├── itineraries/ # Itinerary planning
│   │   │   ├── activities/  # Sales activities
│   │   │   ├── notifications/ # Notification system
│   │   │   ├── reports/     # Reports & analytics
│   │   │   ├── dashboard/   # Dashboard data
│   │   │   └── admin/       # Admin panel
│   │   └── prisma/          # Database schema & migrations
│   └── web/                 # Next.js frontend
│       └── src/
│           ├── app/         # Next.js app router
│           ├── components/  # Reusable UI components
│           └── lib/         # Utilities & helpers
├── docker-compose.yml       # Docker services
├── nginx.conf              # Nginx configuration
└── package.json            # Monorepo configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm 8+
- Docker and Docker Compose
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd freight-pricing-system

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env
```

### 2. Configure Environment
Edit `.env` file with your settings:
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/freight_pricing?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# JWT Secrets (generate strong secrets for production)
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@yourcompany.com"

# App URLs
WEB_URL="http://localhost:3000"
API_URL="http://localhost:3001"
```

### 3. Start with Docker Compose
```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down
```

### 4. Manual Setup (Alternative)
```bash
# Start database and Redis
docker compose up -d db redis

# Generate Prisma client
cd apps/api
pnpm prisma generate

# Run database migrations
pnpm prisma db push

# Seed database
pnpm prisma db seed

# Start API server
pnpm dev

# In another terminal, start web app
cd apps/web
pnpm dev
```

### 5. Access the Application
- **Web App**: http://localhost:3000
- **API Docs**: http://localhost:3001/api/docs
- **Database**: localhost:5432 (postgres/password)

## 🔐 Test Accounts

The system comes with pre-seeded test accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| Admin | admin@freight.com | admin123 | Full system access |
| SBU Head | sbuhead@freight.com | sbuhead123 | Sales management |
| Sales | sales@freight.com | sales123 | Sales operations |
| CSE | cse@freight.com | cse123 | Customer service |
| Pricing | pricing@freight.com | pricing123 | Rate management |
| Management | mgmt@freight.com | mgmt123 | Read-only dashboards |

## 📋 Business Rules

### Rate Requests
- **Sea Export**: POL defaults to Colombo if not specified
- **Equipment Validation**: Flat Rack/Open Top requires pallet dimensions
- **Vessel Details**: Required when `vessel_required=true`
- **Reference Numbers**: Auto-generated for all requests

### Booking Workflow
1. Sales selects predefined rate or submits rate request
2. Pricing team responds with quotes
3. Sales confirms booking
4. Lines place booking and provide RO
5. CSE opens ERP job and completes final details

### Notifications
- **Rate Request Created**: Notifies all pricing team members
- **Response Posted**: Notifies requesting salesperson
- **Itinerary Submitted**: Notifies SBU Head for approval
- **Booking Confirmed**: Notifies salesperson
- **RO Received**: Notifies CSE team

## 🧪 Testing

### E2E Tests
```bash
# Run end-to-end tests
pnpm test:e2e
```

Key test scenarios:
- Sea export POL defaults to Colombo
- Vessel details required when `vessel_required=true`
- Only one selected line quote per rate request
- Booking cancellation requires reason

### Unit Tests
```bash
# Run unit tests
pnpm test
```

## 📊 API Documentation

The API is fully documented with Swagger/OpenAPI. Access the interactive documentation at:
- **Development**: http://localhost:3001/api/docs
- **Production**: https://your-domain.com/api/docs

### Key Endpoints

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/reset/request-otp` - Request password reset OTP
- `POST /auth/reset/confirm` - Confirm OTP and reset password

#### Rate Management
- `GET /rates/predefined` - Get predefined rates with filters
- `POST /rates/requests` - Create rate request
- `POST /rates/requests/:id/respond` - Respond to rate request
- `POST /rates/requests/:id/complete` - Complete rate request

#### Booking Management
- `POST /booking-requests` - Create booking request
- `POST /booking-requests/:id/confirm` - Confirm booking
- `POST /booking-requests/:id/ro` - Add RO document
- `POST /jobs/:id/complete` - Complete job

## 🔧 Development

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint + Prettier**: Code formatting and linting
- **Conventional Commits**: Standardized commit messages
- **Small Commits**: Focused, cohesive changes

### Database Management
```bash
# Generate Prisma client
pnpm db:generate

# Push schema changes
pnpm db:push

# Create migration
pnpm db:migrate

# Seed database
pnpm db:seed

# Open Prisma Studio
pnpm db:studio
```

### Adding New Features
1. Create feature branch
2. Implement backend API endpoints
3. Add frontend components
4. Write tests
5. Update documentation
6. Submit pull request

## 🚀 Deployment

### Production Environment
1. Set up production database (PostgreSQL)
2. Configure Redis instance
3. Set up SMTP/SMS providers
4. Update environment variables
5. Build and deploy with Docker

### Environment Variables (Production)
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db:5432/freight_pricing
REDIS_URL=redis://prod-redis:6379
JWT_SECRET=your-production-secret
SMTP_HOST=your-smtp-host
# ... other production settings
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is proprietary software for internal use.

## 🆘 Support

For technical support or questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

---

**Built with ❤️ for efficient freight pricing and management**