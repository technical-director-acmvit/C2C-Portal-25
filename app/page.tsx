"use client";

import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const [isChecking, setIsChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.backendToken) {
      try {
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    if (status === "unauthenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      if (!session?.user?.isAdmin) {
        setAccessDenied(true);
      } else {
      }
      setIsChecking(false);
    }
  }, [session, status, router]);

  const [showAdminGuide, setShowAdminGuide] = useState(false);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="grid grid-cols-12 h-full w-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div 
                key={i} 
                className="border border-[#48BA86]/20 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#48BA86]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#48BA86]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 border-4 border-[#48BA86] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Initializing Secure Access</h2>
            <p className="text-gray-400">Authenticating your credentials...</p>
          </div>
          
          <button 
            onClick={() => signIn("google")}
            className="group relative px-8 py-4 bg-gradient-to-r from-[#48BA86] to-[#3da574] text-black font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_#48BA86] focus:outline-none focus:ring-2 focus:ring-[#48BA86]"
          >
            <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-700" />
            <div className="relative flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Sign in with Google</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Warning background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 35px,
              #48BA86 35px,
              #48BA86 70px
            )`
          }} />
        </div>
        
        {/* Red alert glow */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
          <div className="max-w-md w-full">
            {/* Access Denied Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mb-6 animate-pulse">
                <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-8V9m0 0V7m0 2h2m-2 0H10m8 4a8 8 0 11-16 0 8 8 0 0116 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-red-400 mb-2 tracking-wider">ACCESS DENIED</h1>
              <p className="text-gray-400 text-lg">Insufficient privileges detected</p>
            </div>
            
            {/* User info card */}
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-[#48BA86] to-[#3da574] rounded-full flex items-center justify-center">
                  <span className="text-black font-bold text-lg">
                    {session?.user?.name?.[0] || session?.user?.email?.[0] || '?'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">Signed in as</p>
                  <p className="text-[#48BA86] text-sm font-mono">
                    {session?.user?.name || session?.user?.email}
                  </p>
                </div>
              </div>
              <div className="border-t border-gray-700 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Security Level:</span>
                  <span className="text-red-400 text-sm font-bold">STANDARD USER</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-gray-400 text-sm">Admin Access:</span>
                  <span className="text-red-400 text-sm font-bold">DENIED</span>
                </div>
              </div>
            </div>
            
            {/* Action button */}
            <button 
              onClick={() => signOut()}
              className="w-full group relative px-6 py-4 bg-gradient-to-r from-[#48BA86] to-[#3da574] text-black font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_#48BA86] focus:outline-none focus:ring-2 focus:ring-[#48BA86]"
            >
              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-700" />
              <div className="relative flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Matrix-style grid */}
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-20 gap-1 h-full w-full">
            {Array.from({ length: 400 }).map((_, i) => (
              <div 
                key={i} 
                className="border border-[#48BA86]/20 hover:bg-[#48BA86]/10 transition-colors duration-300"
                style={{ 
                  animationDelay: `${i * 0.05}s`,
                  animation: 'pulse 3s infinite'
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#48BA86]/20 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#48BA86]/15 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-[#48BA86]/25 rounded-full blur-xl animate-bounce" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
        
        {/* Scanning lines */}
        <div className="absolute inset-0">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#48BA86] to-transparent animate-pulse" style={{ top: '20%' }} />
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#48BA86] to-transparent animate-pulse" style={{ top: '60%', animationDelay: '1s' }} />
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#48BA86] to-transparent animate-pulse" style={{ top: '80%', animationDelay: '2s' }} />
        </div>
      </div>
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-[#48BA86] to-white bg-clip-text text-transparent mb-2">
                ADMIN CONSOLE
              </h1>
              <p className="text-gray-400 text-xl">Secure Administrative Interface</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-[#48BA86] rounded-full animate-pulse" />
                <span className="text-[#48BA86] font-mono text-sm">SYSTEM ACTIVE</span>
              </div>
              <div className="text-gray-400 text-sm font-mono">
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 hover:border-[#48BA86]/50 transition-all duration-300 hover:shadow-[0_0_30px_#48BA86/20]">
              <h2 className="text-2xl font-bold text-[#48BA86] mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Administrator Profile
              </h2>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#48BA86] to-[#3da574] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-black font-bold text-2xl">
                    {session?.user?.name?.[0] || session?.user?.email?.[0] || 'A'}
                  </span>
                </div>
                <h3 className="text-white text-xl font-bold mb-2">
                  {session?.user?.name || 'Administrator'}
                </h3>
                <p className="text-[#48BA86] font-mono text-sm break-all">
                  {session?.user?.email}
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-400">Security Level</span>
                  <span className="text-[#48BA86] font-bold">ADMIN</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-400">Access Level</span>
                  <span className="text-[#48BA86] font-bold">FULL</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                  <span className="text-gray-400">Session Status</span>
                  <span className="text-green-400 font-bold flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                    ACTIVE
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => signOut()}
                className="w-full group relative px-6 py-3 bg-gradient-to-r from-[#48BA86] to-[#3da574] text-black font-bold rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_#48BA86] focus:outline-none focus:ring-2 focus:ring-[#48BA86]"
              >
                <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-transform duration-700" />
                <div className="relative flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Secure Sign Out</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Admin Controls */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* System Status */}
              <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 hover:border-[#48BA86]/50 transition-all duration-300 hover:shadow-[0_0_30px_#48BA86/20]">
                <h3 className="text-xl font-bold text-[#48BA86] mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Server Status</span>
                    <span className="text-green-400 font-bold">ONLINE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Database</span>
                    <span className="text-green-400 font-bold">CONNECTED</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Security</span>
                    <span className="text-[#48BA86] font-bold">ACTIVE</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 hover:border-[#48BA86]/50 transition-all duration-300 hover:shadow-[0_0_30px_#48BA86/20]">
                <h3 className="text-xl font-bold text-[#48BA86] mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-black/30 rounded-lg hover:bg-[#48BA86]/20 transition-colors border border-transparent hover:border-[#48BA86]/50">
                    <svg className="w-6 h-6 text-[#48BA86] mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    <span className="text-xs text-white">Users</span>
                  </button>
                  <button className="p-3 bg-black/30 rounded-lg hover:bg-[#48BA86]/20 transition-colors border border-transparent hover:border-[#48BA86]/50">
                    <svg className="w-6 h-6 text-[#48BA86] mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs text-white">Settings</span>
                  </button>
                  <button className="p-3 bg-black/30 rounded-lg hover:bg-[#48BA86]/20 transition-colors border border-transparent hover:border-[#48BA86]/50">
                    <svg className="w-6 h-6 text-[#48BA86] mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-xs text-white">Analytics</span>
                  </button>
                  <button className="p-3 bg-black/30 rounded-lg hover:bg-[#48BA86]/20 transition-colors border border-transparent hover:border-[#48BA86]/50">
                    <svg className="w-6 h-6 text-[#48BA86] mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs text-white">Security</span>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="mt-6 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-6 hover:border-[#48BA86]/50 transition-all duration-300 hover:shadow-[0_0_30px_#48BA86/20]">
              <h3 className="text-xl font-bold text-[#48BA86] mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-black/30 rounded-lg">
                  <div className="w-2 h-2 bg-[#48BA86] rounded-full mr-3 animate-pulse" />
                  <span className="text-white flex-1">Admin login successful</span>
                  <span className="text-gray-400 text-sm">Just now</span>
                </div>
                <div className="flex items-center p-3 bg-black/30 rounded-lg">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                  <span className="text-white flex-1">System status: All services operational</span>
                  <span className="text-gray-400 text-sm">2 min ago</span>
                </div>
                <div className="flex items-center p-3 bg-black/30 rounded-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                  <span className="text-white flex-1">Security scan completed</span>
                  <span className="text-gray-400 text-sm">5 min ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}