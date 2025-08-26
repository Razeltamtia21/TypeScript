import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Moon, Sun, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [isDark, setIsDark] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') setIsDark(true);
        else if (savedTheme === 'light') setIsDark(false);
        else setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }, []);

    useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark((prev) => !prev);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
        <AuthLayout title="PSAK" description="Masukkan detail Anda di bawah untuk masuk">
            <Head title="Log in" />
            
            {/* Button Kembali ke Halaman Awal - Fixed Position */}
            <div className="fixed top-4 left-4 z-50">
                <Link
                    href={route('home')}
                    className="flex items-center gap-1 rounded-md bg-white/90 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-md backdrop-blur-sm transition-all duration-200 hover:bg-gray-100 dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-700/90"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>
            </div>
            
            {/* Theme Toggle */}
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={toggleTheme}
                    className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
            
            {status && <div className="mb-4 rounded-md bg-green-50 p-4 text-sm text-green-700">{status}</div>}
            
            <Form method="post" action={route('login')} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="Masukkan Email anda..."
                                    className="w-full bg-white dark:bg-gray-800"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>
                            
                            {/* Password Input */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={route('password.request')}
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                            tabIndex={5}
                                        >
                                            Lupa Password?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Masukkan Password anda..."
                                        className="w-full bg-white dark:bg-gray-800 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                        tabIndex={3}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <InputError message={errors.password} className="mt-1" />
                            </div>
                            
                            {/* Remember Me */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={4}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600"
                                />
                                <Label htmlFor="remember" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Ingat saya
                                </Label>
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
                            tabIndex={5}
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Masuk
                        </Button>
                        
                        {/* Sign Up Link */}
                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Belum memiliki Akun?{' '}
                            <TextLink
                                href={route('register')}
                                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                tabIndex={6}
                            >
                                Daftar
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}