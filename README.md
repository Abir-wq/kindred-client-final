# Kindred — Social Development Events Platform

Kindred connects people through local community-service events. Discover opportunities, organize events, and track your participation.

## Live Website

https://kindred-client-final.vercel.app/

## Features

- Email/password registration and login, plus GitHub sign-in.
- Browse upcoming community events and view public event details.
- Create events with a title, description, type, image, location, and future date.
- Join events and view your joined events sorted by date.
- Manage, update, and delete your own events.
- Protected pages that preserve login when refreshed.
- Switch between light and dark themes.
- Responsive layouts for mobile, tablet, and desktop.
- Homepage featuring recent upcoming events, a community gallery, and a newsletter section.

## Technology Stack

- Frontend: Next.js App Router, JavaScript, Tailwind CSS, DaisyUI
- Backend: Express.js and MongoDB
- Authentication: Better Auth with MongoDB adapter and JWT
- Hosting: Vercel

## Repositories

- Client: https://github.com/Abir-wq/kindred-client-final
- Server: https://github.com/Abir-wq/kindred-server-final

## Local Development

1. Clone the client repository.
2. Install dependencies with `npm ci`.
3. Create a `.env.local` file containing:

   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_GITHUB_AUTH_ENABLED=true

4. Configure and start the backend on port 5000.
5. Run `npm run dev` in the client directory.
6. Open http://localhost:3000.

GitHub sign-in requires valid OAuth credentials configured on the backend.

Keep database credentials and authentication secrets in the backend's private environment settings. Never commit them to Git.

## Assignment

B14-A8_Cat-Hermione — Social Development Events Platform
