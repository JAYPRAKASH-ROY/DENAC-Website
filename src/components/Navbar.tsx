import Link from 'next/link';
import { auth } from "@/auth";
import UserMenu from "./UserMenu";

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="absolute top-0 left-0 w-full flex justify-between items-start py-6 px-8 z-50 pointer-events-none mix-blend-difference text-white">
            {/* Brand */}
            <div className="pointer-events-auto">
                <span className="font-bold text-xl tracking-tighter">DENAC</span>
            </div>

            {/* Menu */}
            <div className="pointer-events-auto flex items-center space-x-8 text-xs font-medium tracking-wide">
                {session?.user ? (
                    <UserMenu user={session.user} />
                ) : (
                    <Link href="/login" className="hover:text-white/70 transition-colors uppercase">Account</Link>
                )}
                <button className="hover:text-white/70 transition-colors uppercase">Cart</button>
            </div>
        </nav>
    );
}
