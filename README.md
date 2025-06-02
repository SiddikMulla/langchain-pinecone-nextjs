# Next.js AI-Enhanced Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), enhanced with powerful tools like **Appwrite**, **Pinecone**, **LangChain**, **Cohere API**, **Embeddings**, **Clerk Auth**, and **DaisyUI**.

---

## 🔧 Tech Stack

- **Next.js** – React-based framework for building fast web apps.
- **Appwrite** – Backend-as-a-service for authentication, database, and storage.
- **Pinecone** – Vector database for storing and querying embeddings.
- **LangChain** – Framework for building AI agents and applications using LLMs.
- **Cohere API** – Used for text generation and embedding.
- **Embeddings** – Semantic vector representations used in AI features.
- **Clerk** – Seamless and secure authentication provider.
- **DaisyUI** – Component library built on top of Tailwind CSS.

---

## 🚀 Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open http://localhost:3000 in your browser to view the result.

You can start editing the page by modifying `app/page.tsx` The page auto-updates as you edit the file.

## 🔐 Authentication (Clerk)

This project uses Clerk for authentication and user management. Protected routes are secured using middleware, and users can register, login, and manage sessions seamlessly.

## 🧠 AI Integration

- Appwrite Functions are used for backend tasks like document storage and retrieval.

- Pinecone stores vector embeddings for fast and scalable semantic search.

- Cohere API is used to generate embeddings and perform NLP tasks.

- LangChain orchestrates AI workflows and chains for advanced use cases.

- Embeddings are used to convert user input into vectors for contextual relevance.

## 🎨 Styling

- Tailwind CSS provides utility-first CSS.

- DaisyUI adds ready-to-use component classes built on Tailwind.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
