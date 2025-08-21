import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SignInForm } from '@/components/auth/signin-form';



export default async function SignInPage({
  searchParams
}:any) {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/chat');
  }

  const error = searchParams?.error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to start chatting with your AI assistant
          </p>

          {error === 'OAuthAccountNotLinked' && (
            <p className="mt-4 text-sm text-red-500">
              This email is already linked to another login method. Please use the provider you signed up with.
            </p>
          )}
        </div>

        <SignInForm />
      </div>
    </div>
  );
}
