export default {
  SUGGSTIONS: [
    "Create ToDo App in React",
    "Create Budget Track App",
    "Create Gym Managment Portal Dashboard",
    "Create Quizz App On History",
    "Create Login Signup Screen",
  ],
  HERO_HEADING: "Build Your Next Project",
  HERO_DESC: "Transform your ideas into reality with AI-powered development.",
  INPUT_PLACEHOLDER: "Describe your project idea...",
  //Rest to be modify
  SIGNIN_HEADING: "Continue With Holtex AI",
  SIGNIN_SUBHEADING:
    "To use Holtex AI you must log into an existing account or create one.",
  SIGNIn_AGREEMENT_TEXT:
    "By using Holtex AI, you agree to the collection of usage data for analytics.",

  DEFAULT_FILE: {
    "/public/index.html": {
      code: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body>
      <div id="root"></div>
    </body>
  </html>`,
    },
    "/App.css": {
      code: `
              @tailwind base;
  @tailwind components;
  @tailwind utilities;`,
    },
    "/tailwind.config.js": {
      code: `
              /** @type {import('tailwindcss').Config} */
  module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      extend: {},
    },
    plugins: [],
  }`,
    },
    "/postcss.config.js": {
      code: `/** @type {import('postcss-load-config').Config} */
  const config = {
    plugins: {
      tailwindcss: {},
    },
  };
  
  export default config;
  `,
    },
  },
  DEPENDANCY: {
    postcss: "^8",
    tailwindcss: "^3.4.1",
    autoprefixer: "^10.0.0",
    uuid4: "^2.0.3",
    "tailwind-merge": "^2.4.0",
    "tailwindcss-animate": "^1.0.7",
    "lucide-react": "^0.469.0",
    "react-router-dom": "^7.1.1",
    firebase: "^11.1.0",
    "@google/generative-ai": "^0.21.0",
    "date-fns": "^4.1.0",
    "react-chartjs-2": "^5.3.0",
    "chart.js": "^4.4.7",
  },

  PRICING_DESC:
    "Start with a free account to speed up your workflow on public projects or boost your entire team with instantly-opening production environments.",
  PRICING_OPTIONS: [
    {
      name: "Student Plan",
      tokens: "1 Million",
      value: 5000,
      price: 20,
      priceId: "price_1R193JCz7HC1fTXop5jT79oV",
      support1: "Custom AI Development",
      support2: "Backend Development",
      desc: "Perfect for student",
    },
    {
      name: "Personal Plan",
      tokens: "1 Million",
      value: 50000,
      price: 75,
      priceId: "price_1R193JCz7HC1fTXop5jT79oV",
      support1: "Custom AI Development",
      support2: "Backend Development",
      support3: "2hr P/M Ugent Engineering",
      support4: "1 Standard SSL Socket",
      desc: "Perfect for individual users",
    },
    {
      name: "Business Plan",
      tokens: "2 Million",
      value: 500000,
      price: 400,
      priceId: "price_1R195ICz7HC1fTXoHcx4RPpj",
      support1: "2hrs Custom AI Development",
      support2: "2hrs  Backend Development",
      support3: "24/7/365 dedicated Manager ",
      support4: "2hr P/M Ugent Engineering",
      support5: "1 Domain Name & Standard SSL Socket",
      desc: "Ideal for small businesses",
    },
    {
      name: "Corporate Plan",
      tokens: "2 Million",
      value: 2000000,
      price: 5000,
      priceId: "price_1R195rCz7HC1fTXoD2sBlHQQ",
      support1: "10hrs Custom AI Development",
      support2: "10hrs P/M Backend Development",
      support3: "24/7/365 dedicated Manager ",
      support4: "2hr P/M Ugent Engineering",
      support5: "1 Domain Name & Wild SSL Socket",
      desc: "Enterprise-level solution",
    },
  ],
};
