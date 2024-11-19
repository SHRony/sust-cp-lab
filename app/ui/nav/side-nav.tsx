'use client';
import React, { ReactNode, useContext } from "react";
import Image from "next/image";
import { authContext } from "@/app/lib/AuthProvider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import logo from '@/public/logo.png';
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Trophy, 
  BarChart2, 
  MessageSquare, 
  Users, 
  User, 
  Settings,
  LogOut,
} from "lucide-react";

const navLinks = [
  {
    url: "/dashboard",
    icon: Home,
    text: "Dashboard"
  }, 
  {
    url: "/contests",
    icon: Trophy,
    text: "Contests"
  },
  {
    url: "/cfviz",
    icon: BarChart2,
    text: "CF Viz",
  },
  {
    url: "/forum",
    icon: MessageSquare,
    text: "Forum",
  },
  {
    url: "/users",
    icon: Users,
    text: "Users"
  }, 
  {
    url: "/profile",
    icon: User,
    text: "Profile"
  },
  {
    url: "/settings",
    icon: Settings,
    text: "Settings"
  }
];

const SideNavButton = ({
  children, 
  url, 
  isActive,
  onClick
}: {
  children: ReactNode;
  url: string;
  isActive: boolean;
  onClick?: () => void;
}) => {
  return (
    <Link href={url} className="w-full">
      <motion.div
        className={`
          flex items-center gap-3 px-4 py-3 mx-2 rounded-lg
          ${isActive 
            ? 'text-blue-600 bg-blue-50' 
            : 'text-gray-600 hover:bg-gray-50'
          }
          transition-colors duration-200
        `}
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </motion.div>
    </Link>
  );
};

export default function SideNav() {
  const auth = useContext(authContext);
  const pathname = usePathname();
  
  // Return early if auth context is not ready
  if (!auth) return null;
  
  const handleLogout = async () => {
    await auth.signOut();
  };

  return (
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full w-16 laptop:w-64 bg-white border-r border-gray-200"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-6 border-b border-gray-100">
        <Link href="/">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Image 
                src={logo} 
                alt="CP Lab Logo" 
                width={32} 
                height={32}
                className="rounded-lg"
              />
            </motion.div>
            <span className="hidden laptop:block text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              CP LAB
            </span>
          </motion.div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 space-y-1 overflow-y-auto">
        <AnimatePresence>
          {navLinks.map((link, index) => {
            const isActive = pathname.startsWith(link.url);
            const Icon = link.icon;
            
            return (
              <motion.div
                key={link.url}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <SideNavButton 
                  url={link.url} 
                  isActive={isActive}
                >
                  <Icon 
                    className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}
                  />
                  <span className="hidden laptop:block font-medium">
                    {link.text}
                  </span>
                </SideNavButton>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-100 p-2">
        <motion.button
          className="flex items-center gap-3 w-full px-4 py-3 mx-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          onClick={handleLogout}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut className="w-5 h-5" />
          <span className="hidden laptop:block font-medium">
            Sign Out
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}