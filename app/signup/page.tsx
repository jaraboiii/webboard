
import SignupForm from './signup-form';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm w-full max-w-sm">
        <SignupForm />
      </div>
    </div>
  );
}
