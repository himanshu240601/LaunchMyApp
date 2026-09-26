# LaunchMyApp

A web-based tool for creating polished App Store screenshots from raw mobile app screenshots.

LaunchMyApp was built as a product experiment for simplifying the process of preparing App Store marketing screenshots. It provides a focused editor for uploading screenshots, adding marketing copy, adjusting layouts, and creating consistent screenshot sets.

> **Project Status**
>
> This project is no longer deployed and currently exists as a source-code repository only.
>
> The original backend/Supabase project associated with the application is no longer available. Because of that, any functionality that depended on the original backend may not work without additional setup.
>
> The repository is preserved as a portfolio project and as a record of the product and UI experimentation involved in building LaunchMyApp.

## Overview

Creating App Store screenshots can become repetitive whenever an application's UI, features, or marketing messaging changes.

LaunchMyApp explored a more focused workflow for mobile developers:

1. Upload application screenshots
2. Add titles and supporting text
3. Customize the presentation
4. Adjust screenshot and text positioning
5. Preview the screenshot set
6. Prepare the assets for export

The goal was to make App Store screenshot creation faster without requiring a full design workflow for every release.

## Features

The project includes UI and flows for:

- Uploading multiple screenshots
- Creating multi-screen App Store screenshot sets
- Adding custom titles
- Adding subtitles
- Switching between screenshot templates
- Customizing background colors
- Adjusting background opacity
- Changing text colors
- Choosing typography options
- Enabling or disabling device framing
- Adjusting screenshot scale
- Repositioning screenshots
- Adjusting title and subtitle size
- Repositioning text
- Previewing changes
- Navigating between multiple screenshot designs
- Preparing screenshot sets for export

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- JSZip
- Class Variance Authority
- clsx
- tailwind-merge

## Project Structure

```text
LaunchMyApp/
│
├── app/
│   ├── create/
│   │   ├── edit/
│   │   └── studio/
│   └── page.tsx
│
├── components/
│   ├── landing/
│   ├── screenshots/
│   └── ui/
│
├── data/
├── lib/
├── public/
├── types/
│
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## Local Setup

Clone the repository:

```bash
git clone https://github.com/himanshu240601/LaunchMyApp.git
cd LaunchMyApp
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Available Scripts

Start development mode:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run the production build:

```bash
npm run start
```

Run ESLint:

```bash
npm run lint
```

Run TypeScript checks:

```bash
npm run typecheck
```

## Backend Status

The original backend/Supabase project used during development no longer exists.

This means any functionality that originally depended on:

- authentication
- persisted user data
- saved projects
- cloud storage
- database records

would need to be recreated before the application could work end-to-end again.

The current repository should therefore be considered a preserved frontend/product prototype rather than a live production service.

## Security

Environment files are excluded from the repository through `.gitignore`, including:

```text
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

Any future backend configuration should continue to use environment variables instead of hardcoding credentials.

Server-side secrets such as:

```text
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_SECRET_KEY
database credentials
private API keys
```

should never be committed to source control or exposed to client-side code.

## Why I Built It

As a mobile developer, preparing App Store screenshots is a recurring part of shipping and updating applications.

General-purpose design tools work well, but rebuilding screenshot layouts repeatedly can become tedious.

LaunchMyApp was an experiment in creating a more focused workflow specifically for mobile developers who want to turn raw app screenshots into polished App Store assets quickly.

## What I Worked On

This project involved:

- Building a component-driven React interface
- Working with TypeScript
- Designing interactive editing controls
- Managing complex client-side UI state
- Handling image uploads
- Building real-time previews
- Creating reusable screenshot templates
- Implementing dynamic styling controls
- Working with responsive layouts
- Experimenting with client-side export workflows
- Building polished motion and interaction states

## Project Status

LaunchMyApp is currently **not live and is not under active deployment**.

The source code is kept publicly as a portfolio project and reference implementation.

Re-running the complete original product experience would require recreating the backend infrastructure that previously supported the application.

## Author

**Himanshu Goyal**

GitHub: [@himanshu240601](https://github.com/himanshu240601)

## License

No open-source license is currently specified for this repository.
