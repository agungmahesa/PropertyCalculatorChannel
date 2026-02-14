'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    CalculatorIcon,
    ArrowsRightLeftIcon,
    ChartBarIcon,
    TagIcon,
    HomeIcon,
    Bars3Icon,
    XMarkIcon,
    BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Calculator', href: '/dashboard/calculator', icon: CalculatorIcon },
    { name: 'Comparison', href: '/dashboard/comparison', icon: ArrowsRightLeftIcon },
    { name: 'Occupancy', href: '/dashboard/occupancy', icon: ChartBarIcon },
    { name: 'Promo Sim', href: '/dashboard/promo', icon: TagIcon },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Menu Button - Only visible on mobile when closed */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-md hover:bg-slate-800 transition-colors"
                >
                    <Bars3Icon className="h-6 w-6" />
                </button>
            )}

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static flex flex-col border-r border-slate-800
                ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                {/* Logo Section */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800 bg-slate-950/50">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/20">
                            <BuildingOfficeIcon className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">ProfitStay</span>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden text-slate-400 hover:text-white transition-colors">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-8 custom-scrollbar">
                    {/* Main Menu */}
                    <div>
                        <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                            Menu
                        </h3>
                        <ul className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.name}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsOpen(false)} // Close sidebar on link click
                                            className={`
                                                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                                                ${isActive
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                                                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                                }
                                            `}
                                        >
                                            <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                            {item.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/30">
                    <div className="flex items-center gap-3 px-2">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-inner border border-white/10">
                            AG
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">Agung</p>
                            <p className="text-xs text-slate-500 truncate">Admin</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
