import { PrismaClient } from "@prisma/client";
import QuestionPage from "./QuestionPage";
import AuthProvider from "../components/auth/AuthContext";
import AuthGuard from "../components/auth/AuthGuard";


export default async function Home() {




  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg mt-10">
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">Math Genius</h1>
      <p className="text-lg text-gray-700 mb-6">
        Welcome to Math Genius, a competitive math quiz website where you can test your math skills against others.
      </p>

      <AuthProvider>
        <AuthGuard>
          <QuestionPage />
        </AuthGuard>
      </AuthProvider>

    </div>
  );
}
