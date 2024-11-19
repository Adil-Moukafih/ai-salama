# SALAMA Frontend Application

The frontend component of the SALAMA railway safety monitoring system, built with Next.js, React, and TypeScript.

## Features

- 📊 **Interactive Dashboard**

  - Real-time camera grid display
  - Performance charts and statistics
  - System activity monitoring
  - Alert notifications panel

- 🎥 **Camera Management**

  - Add/Edit/Delete cameras
  - Real-time camera feed display
  - Camera status monitoring
  - Detection zone configuration

- 🚨 **Alert System**

  - Real-time alert notifications
  - Alert history and management
  - Severity-based categorization
  - Alert details and actions

- 📈 **Analytics**
  - Performance metrics
  - Historical data analysis
  - Custom date range reports
  - Export capabilities

## Tech Stack

- **Framework**: Next.js 15.0
- **Language**: TypeScript
- **UI Components**: React 19
- **Styling**: TailwindCSS
- **Charts**: Chart.js
- **Real-time Updates**: WebSocket
- **State Management**: React Context + Custom Hooks
- **Development Tools**: ESLint, PostCSS

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── alerts/            # Alert management pages
│   ├── analytics/         # Analytics and reporting
│   ├── cameras/           # Camera management
│   ├── dashboard/         # Main dashboard
│   └── settings/          # System settings
├── components/            # React components
│   ├── alerts/           # Alert-related components
│   ├── auth/             # Authentication components
│   ├── cameras/          # Camera-related components
│   ├── dashboard/        # Dashboard components
│   └── shared/           # Shared/common components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
└── stores/              # State management
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Create a `.env.local` file with:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

3. Run the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

5. Start production server:

```bash
npm start
```

## Development Guidelines

### Component Structure

- Use TypeScript for all components
- Implement proper type definitions
- Follow functional component patterns
- Include component documentation

### Styling

- Use TailwindCSS for styling
- Follow responsive design principles
- Maintain consistent theme variables
- Use CSS modules when needed

### State Management

- Use React Context for global state
- Implement custom hooks for reusable logic
- Follow proper state management patterns
- Handle side effects appropriately

### Testing

- Write unit tests for components
- Include integration tests
- Test real-time functionality
- Verify responsive behavior

## Docker Support

Build and run using Docker:

```bash
# Build the image
docker build -t salama-frontend .

# Run the container
docker run -p 3000:3000 salama-frontend
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler check

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the coding standards
2. Write meaningful commit messages
3. Update documentation as needed
4. Add appropriate tests
5. Create detailed pull requests

## Additional Resources

- [Main Project Documentation](../README.md)
- [Technical Documentation](./docs/)
- [Docker Setup Guide](./README.Docker.md)
