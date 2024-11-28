import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

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
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left side - Image */}
        <div className="hidden w-1/2 lg:block">
          <div className="relative h-full">
            <img
              src="/api/placeholder/1200/800"
              alt="Login background"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-indigo-600/30" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h2 className="text-3xl font-bold">Welcome Back</h2>
              <p className="mt-2 text-lg">Sign in to continue to your account</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full lg:w-1/2">
          <div className="flex flex-col justify-center min-h-screen px-8 py-12 sm:px-12 lg:px-16">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <Link href="/" className="flex justify-center mb-8">
                <div className="w-12 h-12 bg-indigo-600 rounded-lg" />
              </Link>

              {status && (
                <div className="p-4 mb-6 rounded-md bg-green-50">
                  <div className="text-sm text-green-700">{status}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.target.value)}
                    className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    autoComplete="username"
                    autoFocus
                  />
                  {form.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{form.errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={form.data.password}
                    onChange={(e) => form.setData('password', e.target.value)}
                    className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    autoComplete="current-password"
                  />
                  {form.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{form.errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      checked={form.data.remember}
                      onChange={(e) => form.setData('remember', e.target.checked)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="remember" className="block ml-2 text-sm text-gray-700">
                      Se souvenir de moi
                    </label>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <button
                    type="submit"
                    disabled={form.processing}
                    className="w-full px-6 py-3 text-sm font-semibold text-white transition duration-200 bg-indigo-600 rounded-md shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Se connecter
                  </button>

                  {canResetPassword && (
                    <Link
                      href={route('password.request')}
                      className="text-sm text-center text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Mot de passe oublié?
                    </Link>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

