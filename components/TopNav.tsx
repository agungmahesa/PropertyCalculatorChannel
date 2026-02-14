import { MagnifyingGlassIcon, BellIcon } from '@heroicons/react/24/outline';

export default function TopNav() {
    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 h-16 transition-all duration-200">
            <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                {/* Left Section: Breadcrumb / Page Title */}
                <div className="flex items-center gap-4">
                    {/* ... Mobile Menu Button (implementation detail) ... */}
                    <nav className="hidden sm:flex items-center text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-900 dark:text-white">Dashboard</span>
                        <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
                        <span className="hover:text-indigo-600 transition-colors cursor-pointer">Overview</span>
                    </nav>
                </div>

                {/* Right Section: Search & Actions */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Search Bar */}
                    <div className="hidden md:flex items-center relative group">
                        <MagnifyingGlassIcon className="absolute left-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-9 pr-4 py-1.5 w-64 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 transition-all"
                        />
                    </div>

                    {/* Notification Icon */}
                    <button className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                        <BellIcon className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                    </button>

                    {/* Separator */}
                    <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

                    {/* Help/Support */}
                    <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
                        <span>Help</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
