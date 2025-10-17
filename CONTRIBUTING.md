# Contributing to Brain Battle 3.0 Backend

Thank you for your interest in contributing to the Brain Battle 3.0 Backend! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Docker Setup](#docker-setup)
- [Local Development Setup](#local-development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (with npm)
- Docker and Docker Compose
- PostgreSQL (if not using Docker)
- Git

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your forked repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/brain-battle-backend.git
   cd brain-battle-backend
   ```

## 🐳 Docker Setup

The easiest way to set up the development environment is using Docker:

### 1. Start the Database

```bash
# Start PostgreSQL database
docker compose up -d postgres
```

### 2. Run Database Migrations

```bash
# Generate Prisma client
docker compose exec app npm run prisma:generate

# Run database migrations
docker compose exec app npm run prisma:migrate
```

### 3. Seed the Database (Optional)

```bash
# Add sample data
docker compose exec app npm run seed
```

### 4. Start the Application

```bash
# Start the development server
docker compose up -d
```

The application will be available at `http://localhost:4000`

## 💻 Local Development Setup

If you prefer to run the application locally without Docker:

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start PostgreSQL

You can use Docker to run just the database:

```bash
docker compose up -d postgres
```

Or install and run PostgreSQL locally.

### 4. Run Database Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 5. Seed the Database (Optional)

```bash
npm run seed
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:4000`

## 📁 Project Structure

```
src/
├── app.ts              # Express app instance
├── server.ts           # Server bootstrap and listener
├── config/
│   └── db.ts           # Database connection (Prisma)
├── controllers/
│   ├── registrationController.ts
│   └── adminController.ts
├── middleware/
│   ├── auth.ts
│   ├── errorHandler.ts
│   └── notFound.ts
├── routes/
│   ├── registrationRoutes.ts
│   └── adminRoutes.ts
├── utils/
│   └── qrGenerator.ts
prisma/
├── schema.prisma       # Prisma models
├── seed.ts             # Seed script
└── migrations/         # Database migrations
```

## 🔧 Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

- Follow the coding standards outlined below
- Add tests for new functionality
- Update documentation as needed

### 3. Compile TypeScript

```bash
npm run build
```

### 4. Test Your Changes

```bash
# Run any available tests
npm test
```

### 5. Commit Changes

```bash
git add .
git commit -m "feat: description of your changes"
```

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict type checking
- Use meaningful variable and function names
- Add JSDoc comments for complex functions

### Code Style

- Follow the existing code style
- Use 2 spaces for indentation
- Keep lines under 100 characters
- Use meaningful commit messages

### Error Handling

- Always handle errors appropriately
- Use the existing error handling middleware
- Provide meaningful error messages

### Security

- Never commit sensitive information
- Validate all user inputs
- Use environment variables for secrets

## 🧪 Testing

### Running Tests

```bash
npm test
```

### Writing Tests

- Place test files in `__tests__` directories
- Use Jest for unit tests
- Use Supertest for API integration tests
- Aim for high test coverage

## 📤 Submitting Changes

### 1. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 2. Create a Pull Request

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your branch
- Fill out the PR template
- Submit the pull request

### Pull Request Guidelines

- Keep PRs focused on a single feature or bug fix
- Include a clear description of the changes
- Reference any related issues
- Ensure all tests pass
- Follow the coding standards

## 🐛 Reporting Issues

### Before Submitting an Issue

- Check if the issue already exists
- Try to reproduce the issue
- Gather relevant information

### Submitting an Issue

- Use a clear and descriptive title
- Describe the steps to reproduce
- Include expected and actual behavior
- Provide environment information
- Include relevant code snippets or logs

## 🎉 Thank You!

Thank you for contributing to Brain Battle 3.0 Backend! Your contributions help make this project better for everyone.

If you have any questions or need help, feel free to:

- Open an issue
- Contact the maintainers
- Join our community discussions
