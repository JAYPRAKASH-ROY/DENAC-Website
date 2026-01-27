"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

export default function UserMenu({ user }: { user: User }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative pointer-events-auto">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 focus:outline-none"
            >
                {user.image ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                        <Image
                            src={user.image}
                            alt={user.name || "User"}
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white font-bold">
                        {user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black/90 backdrop-blur-md border border-white/10 rounded-md shadow-lg py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 border-b border-white/10">
                        <p className="text-sm text-white font-medium truncate">{user.name}</p>
                        <p className="text-xs text-white/50 truncate">{user.email}</p>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full text-left px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
            )}

            {/* Backdrop to close on click outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
