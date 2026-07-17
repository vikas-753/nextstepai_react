import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// The single fixed admin account. Only this email can reach the admin panel.
// Regular sign-ups are always students. Override via ADMIN_EMAIL if desired.
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? "admin@nextstep.ai").toLowerCase()

export async function getSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function getUserId() {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export function isAdminEmail(email?: string | null) {
  return !!email && email.toLowerCase() === ADMIN_EMAIL
}
