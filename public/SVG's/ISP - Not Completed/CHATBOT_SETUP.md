# AI Chatbot Setup Instructions

## Installation

1. Install the required dependencies:
```bash
npm install
```

This will install:
- express (backend server)
- cors (handle cross-origin requests)
- node-fetch (make API calls from Node.js)
- concurrently (run multiple commands)

## Running the Application

### Option 1: Run both frontend and backend together (Recommended)
```bash
npm run dev:all
```

This will start:
- Frontend (Vite) on http://localhost:5173
- Backend proxy server on http://localhost:3001

### Option 2: Run separately

Terminal 1 - Start the backend server:
```bash
npm run server
```

Terminal 2 - Start the frontend:
```bash
npm run dev
```

## How It Works

1. The chatbot UI sends messages to the local proxy server (localhost:3001)
2. The proxy server forwards requests to Groq API with your API key
3. Groq API responds with AI-generated answers
4. The response is sent back to the chatbot UI

## Features

- Real AI responses using Groq's Mixtral model
- School-specific context and knowledge
- Beautiful vanishing input animation
- Smooth message animations
- Professional school-friendly design

## Troubleshooting

If the chatbot shows connection errors:
1. Make sure the backend server is running (`npm run server`)
2. Check that port 3001 is not being used by another application
3. Verify the Groq API key is valid in `server.js`

## API Key Security

⚠️ **Important**: The API key is currently in the server.js file. For production:
1. Move the API key to an environment variable
2. Create a `.env` file with: `GROQ_API_KEY=your_key_here`
3. Update server.js to use: `process.env.GROQ_API_KEY`
4. Add `.env` to `.gitignore`
