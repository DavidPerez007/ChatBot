import { useState } from 'react';

export default function Login() {
    return(
            
    <div className="flex flex-col md:flex-row min-h-screen">
        <div className="bg-blue-500 text-white p-8 md:p-12 md:w-1/2 relative overflow-hidden">
        <div className="z-10 relative">
            <h2 className="text-2xl font-bold mb-6">Your Logo</h2>
            <div className="mt-20 md:mt-32">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sign in to</h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">Lorem Ipsum is simply</h2>
            <p className="max-w-md opacity-90">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard dummy text ever since the 1500s.
            </p>
            </div>
        </div>

        <div className="absolute right-0 top-1/3 transform translate-x-1/4">
            <div className="relative w-64 h-64">
            <svg className="text-white/20 absolute top-10 left-10 w-16 h-16" xmlns="http://www.w3.org/2000/svg" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>

            <svg className="text-white/20 absolute bottom-10 right-10 w-20 h-20" xmlns="http://www.w3.org/2000/svg"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                viewBox="0 0 24 24">
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-40 h-40">
                <svg className="text-orange-400 w-40 h-40 transform rotate-45" xmlns="http://www.w3.org/2000/svg" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    viewBox="0 0 24 24">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path
                    d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                </svg>
                </div>
            </div>
            </div>
        </div>

        <svg className="text-white/20 absolute bottom-10 left-10 w-24 h-24" xmlns="http://www.w3.org/2000/svg" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
        </div>

        <div className="p-8 md:p-12 md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
            <div className="text-right mb-4">
            <span className="text-gray-500">No Account?</span>
            <a href="#" className="text-blue-500 font-medium">Sign up</a>
            </div>

            <div className="mb-8">
            <p className="text-gray-600 mb-1">
                Welcome to <span className="text-blue-500 font-bold">LOREM</span>
            </p>
            <h1 className="text-4xl font-bold">Sign in</h1>
            </div>

            <div className="flex flex-col space-y-4 mb-8">
            <button className="flex items-center justify-center gap-2 h-12 border border-gray-200 rounded-md hover:bg-gray-50">
                Sign in with Google
                </button>
            <div className="flex gap-4">
                <button className="flex-1  h-12 border border-gray-200 rounded-md hover:bg-gray-50"> <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-600"
                    >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg></button>
                <button className="flex-1 h-12 border border-gray-200 rounded-md hover:bg-gray-50"> <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-800"
                    >
                    <path d="M9 7c-3 0-4 3-4 5.5 0 3 2 7.5 5 7.5 1.5 0 2.5-.5 3.5-1.5"></path>
                    <path d="M9 12h13"></path>
                    <path d="M15 7c3 0 4 3 4 5.5 0 3-2 7.5-5 7.5-1.5 0-2.5-.5-3.5-1.5"></path>
                    </svg></button>
            </div>
            </div>

            <form>
            <div className="space-y-6">
                <div className="space-y-2">
                <label for="email" className="block text-sm font-medium text-gray-700">
                    Enter your username or email address
                    </label>
                <input id="email" type="text" placeholder="Username or email address"
                    className="w-full h-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>

                <div className="space-y-2">
                <label for="password" className="block text-sm font-medium text-gray-700">
                    Enter your Password
                    </label>
                <input id="password" type="password" placeholder="Password"
                    className="w-full h-12 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                <div className="text-right">
                    <a href="#" className="text-blue-500 text-sm">Forgot Password</a>
                </div>
                </div>

                <button type="submit"
                    className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition duration-200">
                    Sign in
                </button>
            </div>
            </form>
        </div>
        </div>

        <div className="hidden lg:block absolute bottom-8 left-8">
        <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-800">Login as</h3>
        </div>
        <div className="flex space-x-4">
            <div className="bg-gray-100 rounded-lg p-4 w-36 relative">
            <div className="flex flex-col items-center">
                <div className="mb-2">
                <img src="/placeholder.svg" alt="john doe" width="60" height="60" className="rounded-full" />
                </div>
                <h4 className="text-sm font-medium text-center">John Doe</h4>
                <p className="text-xs text-gray-500 text-center mt-1">John Doe</p>
            </div>
            </div>
        </div>
        </div>
    </div>
    )
  
}

