"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
  { href: "/mining-core", label: "MINING CORE" },
  { href: "/database", label: "DATABASE" },
  { href: "/leaderboard", label: "LEADERBOARD" },
  { href: "/info", label: "INFORMATION" },
];

export function NavButtons() {
  const pathname = usePathname();

  return (
    <div className="flex gap-4 w-full justify-around">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            "w-40 h-14 flex items-center justify-center border-2 border-gray-600 rounded-md text-xs font-bold tracking-wide",
            "bg-neutral-800 text-gray-300 hover:bg-green-400 hover:text-black transition",
            pathname === item.href && "bg-green-500 text-black border-green-400"
          )}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
