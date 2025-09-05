# Welcome to React Router!

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.

## Azure Web App + MongoDB Atlas (MERN) Deployment

1. Create a free MongoDB Atlas cluster and whitelist access. Get your connection string.
2. In Azure Portal, create a Web App (Linux, Node 20 LTS). Choose a pricing tier.
3. Configure environment variables in Web App → Configuration:
   - `MONGODB_CONNECTION_STRING`: your Atlas URI
   - `NODE_ENV`: `production`
4. Build locally and deploy via GitHub or Container:
   - GitHub: push this app to a repository (e.g., `mern-app`) and connect via Deployment Center.
   - Container: use the provided `Dockerfile` and deploy to Azure Web App for Containers.
5. Start command (if needed): `npm run start` (already default here).
6. Test the app using the Web App URL.

Local env: duplicate `.env.example` to `.env` and set `MONGODB_CONNECTION_STRING` for local development.

## Vercel Deployment (Docker)

This project includes a Dockerfile, which is the simplest way to run React Router SSR on Vercel without serverless adapters.

Steps:

1. Push your code to GitHub (repo name suggestion: `mern-app`).
2. In Vercel, "Add New..." → "Project" → Import your `mern-app` repo.
3. Framework Preset: "Other". Build Command: `npm run build`. Output: leave default.
4. Enable "Use a Dockerfile" so Vercel builds your container.
5. Environment Variables (Project Settings → Environment Variables):
   - `MONGODB_CONNECTION_STRING` → your MongoDB Atlas URI
   - `NODE_ENV` → `production`
6. Deploy. Once deployed, visit the Vercel URL to test.

Notes:

- The app listens via `npm run start` using `react-router-serve` and the build output.
- Vercel will provide `PORT` automatically; no extra config needed.
