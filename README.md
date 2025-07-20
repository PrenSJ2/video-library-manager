# VideoLib - Full-Stack Video Library Manager

VideoLib is a clean and modern full-stack web application for browsing and managing a personal video library. It provides a simple, intuitive interface for users to view existing videos, add new entries, and generate video ideas using AI.

## Features

-   **Node.js Backend:** A secure and scalable Express.js backend manages data and business logic.
-   **Secure AI Idea Generation:** The backend acts as a proxy to the Google Gemini API, keeping your API key safe.
-   **RESTful API:** A well-defined API for fetching and creating videos.
-   **Responsive Video Grid:** Browse videos in a responsive grid layout that looks great on all devices.
-   **Sort Functionality:** Easily sort the video library by creation date.
-   **Create New Videos:** Add new videos with server-side validation.
-   **Modern UI:** A sleek, dark-themed interface built with React and Tailwind CSS.
-   **Robust Error Handling:** Gracefully handles potential API and network errors on both client and server.

## Tech Stack

-   **Backend:**
    -   **Node.js & Express.js:** For building the server and RESTful API.
    -   **TypeScript:** Adds static typing for a more robust backend.
    -   **Google Gemini API:** Powers the AI video idea generation.
    -   **Dotenv:** For managing environment variables.
-   **Frontend:**
    -   **React:** A JavaScript library for building user interfaces.
    -   **TypeScript:** Adds static typing to JavaScript for improved code quality.
    -   **React Router:** Handles client-side routing.
    -   **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
    -   **esbuild:** A fast and modern JavaScript bundler.
-   **Testing:**
    -   **Jest & React Testing Library:** For comprehensive unit and integration tests.

## Project Structure

-   `dist/`: Contains the compiled output for both the client and server.
-   `server/`: Contains the Node.js backend source code.
-   `src/`, `pages/`, `components/`, etc.: Contains all the client-side React source code.
-   `data/`: Contains static data, like the initial `videos.json`.
-   `tests/`: Contains all Jest tests for the frontend.

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file.
    ```bash
    cp .env.example .env
    ```
    Open the `.env` file and add your Google Gemini API key. You can also set the `PORT` here if you need to use something other than the default.

3.  **Install dependencies:**
    This command will install dependencies for both the client and server.
    ```bash
    npm install
    ```

## Development

To run the application in development mode with live-reloading for both the frontend and backend:

```bash
npm run dev
```
This will start the application on `http://localhost:3001`. The frontend will automatically rebuild when you save a file, and the backend server will restart.

## Running for Production

To create a production-ready build and run it:

```bash
npm start
```
This command first builds the optimized frontend and backend code, then starts the server. Open your browser and navigate to `http://localhost:3001`.

## Running Tests

This project uses Jest and React Testing Library for frontend component testing.

1.  **Run tests:**
    Execute the test suite using the following command.
    ```bash
    npm test
    ```

## Future Improvements

If given more time, the following areas could be further polished or reworked:

- **Comprehensive Testing:** Increase test coverage for both frontend and backend, including integration and end-to-end tests.
- **CI/CD Pipeline:** Set up automated workflows for linting, testing, and deployment.
- **UI/UX Polish:** Refine the user interface and add animations or transitions for a smoother experience.

