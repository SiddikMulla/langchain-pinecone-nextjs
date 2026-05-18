# AI Semantic Search — LangChain + Pinecone + Next.js

An AI-powered conversational search app built with a full RAG (Retrieval-Augmented Generation) pipeline. Ask questions in natural language and get answers grounded in your own documents using vector search.

**Live demo:** [chat.siddik.tech](https://chat.siddik.tech)

---

## Features

- **RAG pipeline** — documents are chunked, embedded, and stored in Pinecone vector DB
- **Conversational AI** — multi-turn chat powered by OpenAI via LangChain
- **Next.js App Router** — streaming responses with server actions
- **Auth** — Clerk authentication
- **UI** — Tailwind CSS + shadcn/ui components

##  Architecture
User Query
↓ 
Next.js API Route
↓
LangChain ConversationalRetrievalChain
↓                    ↓
OpenAI Embeddings   Pinecone Vector Store
↓                    ↓
OpenAI LLM (GPT)
↓
Streamed Response

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript |
| AI / LLM | LangChain.js, OpenAI GPT |
| Vector DB | Pinecone |
| Auth | Clerk |
| Styling | Tailwind CSS, shadcn/ui |
| Formatter | Prettier |

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/SiddikMulla/langchain-pinecone-nextjs.git
cd langchain-pinecone-nextjs
npm install
```

### 2. Set up environment variables

```bash
cp sampleEnv .env.local
```

Fill in your keys:

```env
OPENAI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

### 3. Run locally

```bash
npm run dev
```
## 📄 License

MIT
Open [http://localhost:3000](http://localhost:3000)

