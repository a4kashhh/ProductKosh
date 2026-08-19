// Base URL for the ProductKOSH FastAPI backend
// In production, set NEXT_PUBLIC_API_URL in your hosting environment (e.g. Vercel)
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000"
