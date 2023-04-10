# Auto-GPT WebUI

This project is a frontend web application that runs and interacts with [Auto-GPT](https://github.com/Torantulino/Auto-GPT). The backend application provides the core logic and functionality, while this frontend application wraps over it and offers a user-friendly interface.

### 🌟 Special thanks to [the original Auto-GPT project](https://github.com/Torantulino/Auto-GPT) and its creator, [Torantulino](https://github.com/Torantulino), for his hard work and for making this project possible! 🌟

---

## Disclaimer: Limited Availability for Maintenance

Please note that I developed this project primarily for personal amusement and as a learning experience.
My availability to address issues, review pull requests, or implement new features may be limited, as I have other full-time commitments.

If you find this project useful and would like to contribute, I welcome and highly appreciate community involvement. 💛

Thank you for your understanding, and I hope you find this helpful!

---

## 🛠️ Installation & Usage

Clone the repo, then enter the root directory and run the folling commands:

```bash
npm install
npm run setup-auto-gpt
```

- The first command will install the required dependencies.
- The second command will clone the Auto-GPT repository and install its dependencies.

Run the following command in order to start both the frontend application and the Node.js server, which will in turn start and stop the python script, and inform the frontend of the script's output:

```bash
npm start
```

When you first open up the web app, you will see a few alerts about missing API Keys. You need to fill these in in order for the application to work correctly. Look below for instructions.

---

## ⚙ Requirements and Configuration

### OpenAI API key

Follow these steps to obtain an OpenAI API key:

1. Visit the [**OpenAI Platform**](https://platform.openai.com/signup) website.
1. If you don't have an account yet, sign up by providing your email, name, and creating a password.
1. After signing up or logging in, go to the [**API Keys**](https://platform.openai.com/account/api-keys) section in your account.
1. Click the **Create an API key** button to generate a new API key.
1. Copy the API key and paste it in the WebUI to use it with Auto-GPT.

- ⚠️ Keep your API key secure and never share it with anyone. Treat it like a password.

### Pinecone API key

Follow these steps to obtain a Pinecone API key:

1. Visit the [**Pinecone**](https://app.pinecone.io/register) website.
1. If you don't have an account yet, sign up by providing your email and creating a password.
1. After signing up or logging in, go to the [**Projects**](https://app.pinecone.io/projects) page.
1. Click on the default project, or create a new one if desired.
1. In the left sidebar, click on the **API Keys** section.
1. Create a new API key and copy-paste it in the WebUI to use it with Auto-GPT.

- ⚠️ Keep your API key secure and never share it with anyone. Treat it like a password.

### Python environment

You will also need both [Python 3.8 or later](https://www.tutorialspoint.com/how-to-install-python-in-windows) and [Node.js](https://nodejs.org/en) installed on your system.

---

## 🛠 Tools and Libraries

- [**Auto-GPT**](https://github.com/Torantulino/Auto-GPT) - As mentioned, the backend logic and the meat of this application is provided by the Auto-GPT project. Check out the repo for more information if you'd like to [contribute to](https://github.com/Torantulino/Auto-GPT/blob/master/CONTRIBUTING.md) or [sponsor](https://github.com/sponsors/Torantulino) the project.
- [**Turborepo**](https://turborepo.org/) - A high-performance build system and repository organizer for JavaScript and TypeScript codebases.
- [**Vite**](https://vitejs.dev/) - A build tool and development server for web applications, designed to be fast and lightweight.
- [**React**](https://reactjs.org/) - A JavaScript library for building user interfaces, developed and maintained by Facebook.
- [**Chakra UI**](https://chakra-ui.com/) - A simple, modular, and accessible component library for React.
- [**Zustand**](https://github.com/pmndrs/zustand) - A lightweight and easy-to-use state management library for React.
- [**Express**](https://expressjs.com/) - A fast, unopinionated, minimalist web framework for Node.js.
- [**dotenv**](https://www.npmjs.com/package/dotenv) - A library that loads environment variables from a `.env` file into your Node.js application.
- [**Emotion**](https://emotion.sh/docs/introduction) - A library for CSS-in-JS, allowing you to style your React components using JavaScript.
- [**TypeScript**](https://www.typescriptlang.org/) - A popular superset of JavaScript that adds static types and other features for better code maintainability.
- [**ESLint**](https://eslint.org/) - A tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
- [**Prettier**](https://prettier.io/) - A widely-used code formatter that enforces a consistent style by parsing your code and re-printing it with its own rules.
