import AppLayout from "@/components/layout/AppLayout";
import AuthInitializer from "@/components/auth/AuthInitializer";
import AuthProvider from "@/provider/AuthProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from 'react-hot-toast';
import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const metadata = {
  title: "INNORA Luxury Hotel & Suites",
  description: "Experience Timeless Luxury, Oceanfront Suites & Unmatched Hospitality.",
};

async function getPreloadedUser() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("authToken")?.value;

    if (authToken) {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "innora-super-secret-jwt-key-2026-production-ready"
      );
      const { payload } = await jwtVerify(authToken, secret);
      if (payload && (payload.sub || payload.id)) {
        return {
          id: (payload.sub as string) || (payload.id as string),
          _id: (payload.sub as string) || (payload.id as string),
          email: payload.email as string,
          role: payload.role as string,
          firstName: (payload.firstName as string) || "",
          lastName: (payload.lastName as string) || "",
          fullName:
            (payload.fullName as string) ||
            `${payload.firstName || ""} ${payload.lastName || ""}`.trim() ||
            (payload.email as string),
          avatar: (payload.avatarUrl as string) || (payload.avatar as string) || null,
          avatarUrl: (payload.avatarUrl as string) || (payload.avatar as string) || null,
        };
      }
    }

    // Fallback: in case user_session cookie is still lingering
    const sessionCookie = cookieStore.get("user_session")?.value;
    if (sessionCookie) {
      return JSON.parse(decodeURIComponent(sessionCookie));
    }
  } catch {
    // Expired/invalid token -> guest state
  }

  return undefined;
}

export default async function RootLayout({ children }) {
  const preloadedUser = await getPreloadedUser();

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="font-mono antialiased" suppressHydrationWarning>
        <ReduxProvider preloadedUser={preloadedUser}>
          <AuthInitializer>
            <AuthProvider>
              <Toaster position="bottom-right" reverseOrder={false} />
              <AppLayout>{children}</AppLayout>
            </AuthProvider>
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
