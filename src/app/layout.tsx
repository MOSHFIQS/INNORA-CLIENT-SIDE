import AppLayout from "@/components/layout/AppLayout";
import AuthInitializer from "@/components/auth/AuthInitializer";
import AuthProvider from "@/provider/AuthProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from 'react-hot-toast';
import { cookies } from "next/headers";
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const metadata = {
  title: "INNORA Luxury Hotel & Suites",
  description: "Experience Timeless Luxury, Oceanfront Suites & Unmatched Hospitality.",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("user_session")?.value;
  let preloadedUser = undefined;
  if (sessionCookie) {
    try {
      preloadedUser = JSON.parse(decodeURIComponent(sessionCookie));
    } catch {
      // ignore
    }
  }

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
