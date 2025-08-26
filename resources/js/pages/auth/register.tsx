import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Register() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Baca preferensi tema dari localStorage saat komponen dimuat
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
        } else if (savedTheme === 'light') {
            setIsDark(false);
        } else {
            // Jika belum ada preferensi tersimpan, gunakan preferensi sistem
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDark(prefersDark);
        }
    }, []);

    useEffect(() => {
        // Terapkan tema ke DOM dan simpan ke localStorage
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    return (
        <AuthLayout title="PSAK" description="Masukkan detail Anda di bawah untuk membuat akun">
            <Head title="Register" />

            {/* Button Kembali ke Halaman Awal - Fixed Position */}
            <div className="fixed top-4 left-4 z-50">
                <Link
                    href={route('home')}
                    className="flex items-center gap-1 rounded-md bg-white/90 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-gray-700 shadow-md hover:bg-gray-100 dark:bg-gray-800/90 dark:text-gray-200 dark:hover:bg-gray-700/90 transition-all duration-200"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>
            </div>

            {/* Theme Toggle - Fixed Position */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={toggleTheme}
                    className="rounded-lg bg-white/90 backdrop-blur-sm p-2.5 text-gray-600 shadow-md transition-all duration-200 hover:bg-gray-100 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:bg-gray-700/90"
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            <Form
                method="post"
                action={route('register')}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6 mt-16"> {/* Tambahkan margin-top untuk menghindari tumpang tindih dengan tombol fixed */}
                            {/* Nama Lengkap */}
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nama Lengkap
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Masukkan nama lengkap Anda"
                                    className="w-full bg-white dark:bg-gray-800"
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Nama PT */}
                            <div className="grid gap-2">
                                <Label htmlFor="company_name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nama PT
                                </Label>
                                <Input
                                    id="company_name"
                                    type="text"
                                    required
                                    tabIndex={2}
                                    autoComplete="organization"
                                    name="company_name"
                                    placeholder="Masukkan nama perusahaan"
                                    className="w-full bg-white dark:bg-gray-800"
                                />
                                <InputError message={errors.company_name} />
                            </div>

                            {/* Alamat PT */}
                            <div className="grid gap-2">
                                <Label htmlFor="company_address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Alamat PT
                                </Label>
                                <Input
                                    id="company_address"
                                    type="text"
                                    required
                                    tabIndex={3}
                                    name="company_address"
                                    placeholder="Masukkan alamat perusahaan"
                                    className="w-full bg-white dark:bg-gray-800"
                                />
                                <InputError message={errors.company_address} />
                            </div>

                            {/* Tipe Perusahaan */}
                            <div className="grid gap-2">
                                <Label htmlFor="company_type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tipe Perusahaan
                                </Label>
                                <Select name="company_type" required>
                                    <SelectTrigger className="w-full bg-white dark:bg-gray-800">
                                        <SelectValue placeholder="Pilih tipe perusahaan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="bank">Bank</SelectItem>
                                        <SelectItem value="fee_company">Perusahaan Biaya</SelectItem>
                                        <SelectItem value="insurance_company">Perusahaan Asuransi</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.company_type} />
                            </div>

                            {/* Email */}
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={4}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="w-full bg-white dark:bg-gray-800"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    className="w-full bg-white dark:bg-gray-800"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Konfirmasi Password */}
                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Konfirmasi Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Konfirmasi password"
                                    className="w-full bg-white dark:bg-gray-800"
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button type="submit" className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500" tabIndex={7}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Buat Akun
                            </Button>
                        </div>

                        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                            Sudah memiliki akun?{' '}
                            <TextLink
                                href={route('login')}
                                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                tabIndex={8}
                            >
                                Masuk
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}