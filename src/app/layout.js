import AppLayout from "@/components/layout/AppLayout";
import AuthInitializer from "@/components/auth/AuthInitializer";
import AuthProvider from "@/provider/AuthProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export const metadata = {
  title: "INNORA Luxury Hotel & Suites",
  description: "Experience Timeless Luxury, Oceanfront Suites & Unmatched Hospitality.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className="font-mono antialiased">
        <ReduxProvider>
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
