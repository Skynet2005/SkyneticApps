# Skynetic Apps

Skynetic Apps is a cutting-edge platform that offers a suite of innovative tools designed to inspire creativity and ignite the imagination. This application leverages modern web technologies to deliver a seamless user experience, featuring a robust battle simulator, secure user authentication, and a fully customizable theme for a tailored user interface.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Internationalization](#internationalization)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Battle Simulator**: Engage in simulated battles, powered by OpenAI, with in-depth explanations and strategy analysis.
- **User Authentication**: Secure login and role-based access control, powered by NextAuth.js with GitHub and Google OAuth support.
- **Responsive Design**: Optimized for desktop and mobile devices, built with modern UI components.
- **Internationalization (i18n)**: Multilingual support for a variety of languages, including English, French, German, Spanish, Portuguese, and Turkish.
- **Customizable Themes**: Supports light and dark modes with Tailwind CSS for dynamic theming.

## Installation

To get started with Skynetic Apps, clone the repository and install the required dependencies:

```bash
git clone https://github.com/yourusername/SkyneticApps.git
cd Skynetic Apps
npm install
```

## Usage

To start the application in development mode, run:

```bash
npm run dev
```

This will start the application at `http://localhost:3000`.

To build the project for production, run:

```bash
npm run build
```

To start the application in production:

```bash
npm run start
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory to configure environment variables. Here are the required environment variables for Skynetic Apps:

```bash
# Database Configuration
DATABASE_URL=your_database_url
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

# Optional: For Prisma if using direct connection URL
DIRECT_URL=your_database_direct_url

# Authentication Secret (for NextAuth.js)
AUTH_SECRET=your_auth_secret

# GitHub OAuth Credentials
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Resend API Key (for email notifications)
RESEND_API_KEY=your_resend_api_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Prisma

Ensure Prisma is set up and the database schema is migrated before running the application. Run the following command to apply any schema changes:

```bash
npx prisma migrate dev
```

To generate Prisma client after installation or changes:

```bash
npx prisma generate
```

### Tailwind CSS

Tailwind CSS is configured in `tailwind.config.ts`. You can customize the theme, colors, and components in this file.

```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
};
```

### ESLint

Skynetic Apps uses ESLint for code consistency and quality. The configuration is defined in `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "react-hooks/exhaustive-deps": "off"
  }
}
```

## Internationalization

Currently, Skynetic Apps only supports internationalization on the Battle Simulator page using `next-intl`. Language files for this feature are located in the `messages` directory, with each language having its own JSON file.

- English: `messages/en.json`
- French: `messages/fr.json`
- German: `messages/de.json`
- Spanish: `messages/es.json`
- Portuguese: `messages/pt.json`
- Turkish: `messages/tr.json`

To add a new language for the Battle Simulator page, create a JSON file in the `messages` directory and follow the format of existing files.

## Development

### Available Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the application for production.
- `npm run start`: Start the production server.
- `npm run lint`: Run ESLint for code linting and formatting.

### File Structure

- `src/app`: Main application pages and components.
- `src/components/ui`: Reusable UI components such as buttons and forms.
- `src/lib`: Utility functions and helper classes.
- `src/hooks`: Custom React hooks.
- `src/app/[locale]/page.tsx`: Home page component.
- `src/app/[locale]/(protected)/(routes)/dashboard/layout.tsx`: Dashboard layout for authenticated users.
- `src/app/[locale]/auth/layout.tsx`: Authentication layout for login and registration.

## Contributing

Contributions are welcome! Please fork the repository, create a feature branch, and submit a pull request with your changes. For major changes, please open an issue first to discuss the proposed updates.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
