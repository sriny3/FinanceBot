# FinBot 📈🤖

An AI-powered equity research analyst chatbot that provides structured, data-driven analysis of publicly traded companies. This project uses **LangGraph**, **FastAPI**, and **Next.js** to evaluate financial information, perform valuations, and analyze news sentiment, delivering actionable insights without making speculative predictions.

## Features

- **📊 Stock Fundamentals Analysis**: Pulls live data such as Price, P/E ratio, Market Cap, and Revenue Growth using Yahoo Finance (`yfinance`).
- **📰 News Sentiment**: Evaluates recent news on a given ticker/company via Google News (SerpAPI) to gauge market sentiment (Bullish, Neutral, Bearish).
- **🧠 Advanced Reasoning**: Built on LangChain and LangGraph utilizing Groq's low-latency inference for structured output.
- **⚡ Modern UI**: Beautiful, responsive chat interface built with Next.js 16, React 19, Tailwind CSS v4, and Shadcn UI.
- **🛡️ Structured Analyst Briefs**: Delivers analysis formatted neatly into Fundamentals, Valuation Signals, News Sentiment, Key Risks, and an Outlook summary.

## Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **LLM Orchestration**: [LangChain](https://python.langchain.com/) / [LangGraph](https://langchain-ai.github.io/langgraph/)
- **Inference/Models**: [Groq](https://groq.com/)
- **Tools API**: `yfinance` & `google-search-results` (SerpAPI)
- **Package Management**: `uv` / `pip`

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / Radix UI
- **Markdown Rendering**: `react-markdown` with `remark-gfm`

## Getting Started

### Prerequisites

You need API keys for the following services to run the backend agents:
- **Groq API Key**: For fast LLM inference.
- **SerpAPI Key**: To fetch Google News for sentiment analysis.

### 1. Backend Setup

From the root `finbot` directory, install the Python dependencies and run the server.

```bash
# 1. Provide your Environment Variables
# Create a .env file based on the keys needed
echo "GROQ_API_KEY=your_groq_api_key_here" > .env
echo "SERPAPI_API_KEY=your_serpapi_key_here" >> .env

# 2. Install dependencies (using uv or pip)
uv sync # OR pip install -r requirements.txt (if exported)

# 3. Start the FastAPI server
uvicorn app.api:app --reload --port 8000
```
The backend API will be available at `http://localhost:8000`.

### 2. Frontend Setup

In a new terminal, navigate to the `frontend` folder and start the Next.js development server.

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The application UI will be running on `http://localhost:3000`. Open this in your browser to start chatting with FinBot!

## System Prompt & Analyst Rules

FinBot is inherently designed to rely strictly on real-time data explicitly omitting speculative buy/sell advice. It enforces structured formatting:

1. Gather data before analysis. Never rely on memory.
2. Present only data-driven signals.
3. Flag notable risks and red flags based on the data queried.

Enjoy analyzing equities with FinBot! 🚀
