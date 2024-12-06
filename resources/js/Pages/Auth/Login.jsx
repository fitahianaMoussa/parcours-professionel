import React, { useEffect } from 'react';
import { Link, useForm } from '@inertiajs/react';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export default function LoginPage({ status, canResetPassword }) {
  const form = useForm({
    email: '',
    password: '',
    remember: false,
  });

  useEffect(() => {
    return () => form.reset('password');
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    form.post(route('login'));
  };

  return (
    <div className="min-h-screen bg-gray-100/50">
      <div className="grid h-screen lg:grid-cols-2">
        {/* Left Side - Login Form */}
        <div className="flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-[480px]">
            {/* Logo */}
            <div className="mb-8">
              <Link href="/" className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded">
                  <span className="text-xl font-bold text-white">M</span>
                </div>
                <span className="ml-3 text-2xl font-semibold text-gray-900">Modernize</span>
              </Link>
            </div>

            {/* Welcome Text */}
            <div className="mb-8">
              <h1 className="text-3xl font-semibold text-gray-900">Welcome back!</h1>
              <p className="mt-2 text-gray-600">Please sign in to continue</p>
            </div>

            {/* Status Message */}
            {status && (
              <div className="p-4 mb-6 text-sm text-green-700 rounded-lg bg-green-50">
                {status}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={form.data.email}
                    onChange={e => form.setData('email', e.target.value)}
                    className="block w-full py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your email"
                    autoComplete="username"
                  />
                </div>
                {form.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{form.errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={form.data.password}
                    onChange={e => form.setData('password', e.target.value)}
                    className="block w-full py-3 pl-12 pr-4 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </div>
                {form.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{form.errors.password}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={form.data.remember}
                    onChange={e => form.setData('remember', e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                {canResetPassword && (
                  <Link
                    href={route('password.request')}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot Password?
                  </Link>
                )}
              </div>

              <button
                type="submit"
                disabled={form.processing}
                className="relative flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                Sign In
                <FiArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-0 bg-indigo-600/20" />
          <img
            src="/api/placeholder/1200/800"
            alt="Login"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
            <blockquote className="text-2xl font-light">
              "Efficiency is doing better what is already being done."
            </blockquote>
            <p className="mt-2 text-lg font-medium">— Peter Drucker</p>
          </div>
        </div>
      </div>
    </div>
  );
}