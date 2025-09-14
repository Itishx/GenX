# GenX Landing Page

Welcome to the GenX landing page project! This project is built using React, TypeScript, Tailwind CSS, and Framer Motion to create a modern and responsive landing page for the "GenX" multi-agent AI platform.

## Project Structure

The project is organized as follows:

```
genx-landing
├── index.html          # Main HTML document
├── package.json        # NPM configuration file
├── tsconfig.json       # TypeScript configuration file
├── vite.config.ts      # Vite configuration file
├── postcss.config.js   # PostCSS configuration for Tailwind CSS
├── tailwind.config.ts   # Tailwind CSS configuration
├── README.md           # Project documentation
└── src
    ├── main.tsx        # Entry point of the React application
    ├── App.tsx         # Main App component
    ├── index.css       # Global styles
    ├── lib
    │   └── utils.ts    # Utility functions
    └── components
        ├── Navbar.tsx   # Navigation bar component
        ├── MobileMenu.tsx # Mobile menu component
        ├── Hero.tsx     # Hero section component
        ├── Footer.tsx   # Footer component
        ├── SocialIcons.tsx # Social media icons component
        └── ui
            ├── button.tsx # Button component
            └── sheet.tsx  # Sheet component for modals
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd genx-landing
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the landing page.

## Features

- **Responsive Navigation Bar:** Includes the "AgentX" logo and links to "Home", "Agents", "Pricing", and "Login". The navigation collapses into a hamburger menu on mobile devices.
- **Full-Screen Hero Section:** Features a gradient background with a bold headline, subtext, and action buttons. Animations are handled using Framer Motion.
- **Elegant Footer:** Contains the AgentX logo, navigation links, and social media icons (Twitter, LinkedIn, GitHub).

## Technologies Used

- **React:** For building the user interface.
- **TypeScript:** For type safety and better development experience.
- **Tailwind CSS:** For styling and responsive design.
- **Framer Motion:** For animations and transitions.
- **shadcn/ui:** For UI components.

## Contributing

Feel free to submit issues or pull requests if you have suggestions or improvements for the project.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.