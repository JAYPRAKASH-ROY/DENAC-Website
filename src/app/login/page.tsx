
import { signIn } from "@/auth"
import { FcGoogle } from "react-icons/fc"
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px]" />

            <div className="relative z-10 w-full max-w-md px-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
                    <div className="text-center mb-10">
                        <Link href="/" className="inline-block mb-8 hover:opacity-80 transition-opacity">
                            <span className="text-3xl font-bold tracking-tighter text-white">DENAC</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-white/40 text-sm">Sign in to access your saved preferences and orders.</p>
                    </div>

                    <form
                        action={async () => {
                            "use server"
                            await signIn("google", { redirectTo: "/" })
                        }}
                    >
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all duration-200 group"
                        >
                            <FcGoogle className="text-2xl group-hover:scale-110 transition-transform" />
                            <span>Continue with Google</span>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-white/30 text-xs">
                            By continuing, you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
