import { useEffect } from 'react';
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
    <GuestLayout>
      <Head title="Log in" />

      <div className="w-full space-y-6">
        {status && (
          <div className="p-4 rounded-md bg-green-50">
            <div className="text-sm text-green-700">{status}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.data.email}
              onChange={(e) => form.setData('email', e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              autoComplete="username"
              autoFocus
            />
            {form.errors.email && (
              <p className="mt-1 text-sm text-red-600">{form.errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={form.data.password}
              onChange={(e) => form.setData('password', e.target.value)}
              className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              autoComplete="current-password"
            />
            {form.errors.password && (
              <p className="mt-1 text-sm text-red-600">{form.errors.password}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={form.data.remember}
              onChange={(e) => form.setData('remember', e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor="remember"
              className="block ml-2 text-sm text-gray-700"
            >
              Se souvenez de moi
            </label>
          </div>

          <div className="flex items-center justify-end space-x-4">
            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="text-sm text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Mot de passe oublié?
              </Link>
            )}

            <button
              type="submit"
              disabled={form.processing}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Se connecter
            </button>
          </div>
        </form>
      </div>
    </GuestLayout>
  );
}