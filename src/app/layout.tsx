import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "react-quill/dist/quill.snow.css";
import "./globals.css";
import AuthProvider from "./context/AuthProvider";
import Provider from "@/components/Provider";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import { UserProvider } from "./context/UserContext";
import { ChangeLogProvider } from "./context/ChangeLogContext";
import { ProjectProvider } from "./context/ProjectContext";
import { WEB_DETAILS } from "@/Utils/constants";
import { ReleaseTagProvider } from "./context/ReleaseTagContext";
import { ReleaseCategoryProvider } from "./context/ReleaseCategoryContext";
import { FeedbackBoardProvider } from "./context/FeedbackBoardContext";
import { FeedbackPostProvider } from "./context/FeedbackPostContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: WEB_DETAILS.name,
  description: WEB_DETAILS.description,
  icons: [
    {
      rel: "icon",
      url: WEB_DETAILS.favicon,
    },
  ],
  openGraph: {
    title: WEB_DETAILS.name,
    description: WEB_DETAILS.description,
    url: process.env.BASEURL,
    siteName: WEB_DETAILS.name,
    images: [
      {
        url: `${process.env.BASEURL}/api/ogImage`,
        width: 1200,
        height: 630,
      },
    ]
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <AuthProvider>
          <Provider>
            <UserProvider>
              <FeedbackPostProvider>
                <FeedbackBoardProvider>
                  <ReleaseCategoryProvider>
                    <ReleaseTagProvider>
                      <ProjectProvider>
                        <ChangeLogProvider>
                          <div className="bg-gray-50 h-screen">{children}</div>
                          <ToastContainer
                            pauseOnHover={false}
                            pauseOnFocusLoss={false}
                          />
                        </ChangeLogProvider>
                      </ProjectProvider>
                    </ReleaseTagProvider>
                  </ReleaseCategoryProvider>
                </FeedbackBoardProvider>
              </FeedbackPostProvider>
            </UserProvider>
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}
