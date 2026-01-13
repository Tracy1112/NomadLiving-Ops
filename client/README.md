# NomadLiving Ops Console - Frontend

Modern React application for the NomadLiving Ops Console - Internal operations dashboard for property maintenance and vendor management. Built with React 18, React Router v6, Redux Toolkit, and React Query.

## Features

- **Modern React Architecture**: Built with React 18 and functional components
- **State Management**: Redux Toolkit for global state, React Query for server state
- **Routing**: React Router v6 with data loaders and actions
- **UI/UX**: Styled Components, responsive design, dark/light theme
- **Data Visualization**: Recharts for interactive charts and statistics
- **Form Handling**: React Router form actions with validation
- **Error Handling**: Comprehensive error boundaries and error states
- **Performance**: Code splitting, lazy loading, query caching

## Tech Stack

- React 18
- React Router v6
- Redux Toolkit
- React Query (TanStack Query)
- Styled Components
- Recharts
- Axios
- React Toastify
- Vite

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/      # Reusable UI components
├── pages/          # Route pages with loaders/actions
├── features/       # Redux slices
├── utils/          # Utility functions and helpers
└── assets/         # Static assets (images, CSS, styled components)
```

## Environment Variables

The frontend connects to the backend API. Ensure the backend server is running and configured correctly.
