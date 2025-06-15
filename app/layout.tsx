import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { neobrutalism } from '@clerk/themes'

export const metadata = {
  title: 'DocuChat',
  description: '',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      signIn: { baseTheme: neobrutalism },
    }}>
      <html lang="en">
        <body className="min-h-screen h-screen overflow-hidden flex flex-col">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
