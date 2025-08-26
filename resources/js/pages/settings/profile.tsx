// resources/js/Pages/Settings/Profile.jsx
import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;
    const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null);
    const [companyLogoPreview, setCompanyLogoPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        profile_photo: null,
        company_logo: null,
        _method: 'patch',
    });

    const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('profile_photo', file);
            const reader = new FileReader();
            reader.onload = () => {
                setProfilePhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCompanyLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('company_logo', file);
            const reader = new FileReader();
            reader.onload = () => {
                setCompanyLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Debug: Log form data
        console.log('=== FORM SUBMIT DEBUG ===');
        console.log('Form data:', data);
        console.log('Profile photo:', data.profile_photo);
        console.log('Company logo:', data.company_logo);
        console.log('Profile photo is File:', data.profile_photo instanceof File);
        console.log('Company logo is File:', data.company_logo instanceof File);

        // Buat FormData untuk mengirim file
        const formData = new FormData();
        formData.append('_method', 'patch');
        formData.append('name', data.name);
        formData.append('email', data.email);

        if (data.profile_photo instanceof File) {
            formData.append('profile_photo', data.profile_photo);
            console.log('✅ Profile photo added to FormData:', {
                name: data.profile_photo.name,
                size: data.profile_photo.size,
                type: data.profile_photo.type,
                lastModified: data.profile_photo.lastModified,
            });
        } else {
            console.log('❌ Profile photo NOT added - not a File instance');
        }

        if (data.company_logo instanceof File) {
            formData.append('company_logo', data.company_logo);
            console.log('✅ Company logo added to FormData:', {
                name: data.company_logo.name,
                size: data.company_logo.size,
                type: data.company_logo.type,
            });
        } else {
            console.log('❌ Company logo NOT added - not a File instance');
        }

        // Debug: Log FormData entries
        console.log('=== FORMDATA CONTENTS ===');
        for (let pair of formData.entries()) {
            if (pair[1] instanceof File) {
                console.log(`${pair[0]}:`, {
                    fileName: pair[1].name,
                    fileSize: pair[1].size,
                    fileType: pair[1].type,
                });
            } else {
                console.log(`${pair[0]}:`, pair[1]);
            }
        }

        // Debug: Log current user data
        console.log('=== CURRENT USER DATA ===');
        console.log('Current profile_photo:', auth.user.profile_photo);
        console.log('Current company_logo:', auth.user.company_logo);

        post(route('profile.update'), {
            data: formData,
            preserveScroll: true,
            forceFormData: true,
            onStart: () => {
                console.log('🚀 Request started');
            },
            onSuccess: (page) => {
                console.log('✅ Upload successful');
                console.log('New user data:', page.props.auth.user);
                setProfilePhotoPreview(null);
                setCompanyLogoPreview(null);
                setData('profile_photo', null);
                setData('company_logo', null);
                // Force page refresh untuk memastikan data terbaru
                window.location.reload();
            },
            onError: (errors) => {
                console.log('❌ Upload errors:', errors);
            },
            onFinish: () => {
                console.log('🏁 Request finished');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />
            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your profile and company information" />
                    <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />
                            <InputError className="mt-2" message={errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                className="mt-1 block w-full"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoComplete="username"
                                placeholder="Email address"
                            />
                            <InputError className="mt-2" message={errors.email} />
                        </div>
                        {/* Profile Photo Upload - DIPERBAIKI */}
                        {/* <div className="grid gap-2">
                            <Label htmlFor="profile_photo">Profile Photo</Label>
                            <div className="flex items-center space-x-4">
                                <div className="relative" style={{ width: '80px', height: '80px' }}>
                                    {profilePhotoPreview || auth.user.profile_photo ? (
                                        <img
                                            src={profilePhotoPreview || `/storage/${auth.user.profile_photo}`}
                                            alt="Profile"
                                            className="absolute inset-0 h-full w-full rounded-full border-2 border-gray-200"
                                            style={{ objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex h-full w-full items-center justify-center rounded-full bg-gray-200">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        id="profile_photo"
                                        type="file"
                                        className="mt-1 block w-full"
                                        accept="image/*"
                                        onChange={handleProfilePhotoChange}
                                    />
                                    <p className="mt-1 text-sm text-gray-500">JPG, JPEG, PNG. Max 2MB</p>
                                </div>
                            </div>
                        </div> */}
                        {/* Company Logo Upload - DIPERBAIKI */}
                        <div className="grid gap-2">
                            <Label htmlFor="company_logo">Company Logo</Label>
                            <div className="flex items-center space-x-4">
                                <div className="relative" style={{ width: '80px', height: '80px' }}>
                                    {companyLogoPreview || auth.user.company_logo ? (
                                        <img
                                            src={companyLogoPreview || `/storage/${auth.user.company_logo}`}
                                            alt="Company Logo"
                                            className="absolute inset-0 h-full w-full rounded-lg border-2 border-gray-200 bg-gray-100 p-1"
                                            style={{ objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex h-full w-full items-center justify-center rounded-lg bg-gray-200">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 text-gray-500"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <Input
                                        id="company_logo"
                                        type="file"
                                        className="mt-1 block w-full"
                                        accept="image/*"
                                        onChange={handleCompanyLogoChange}
                                    />
                                    <p className="mt-1 text-sm text-gray-500">JPG, JPEG, PNG. Max 2MB</p>
                                </div>
                            </div>
                        </div>
                        
                        {mustVerifyEmail && auth.user.email_verified_at === null && (
                            <div>
                                <p className="-mt-4 text-sm text-muted-foreground">
                                    Your email address is unverified.{' '}
                                    <Link
                                        href={route('verification.send')}
                                        method="post"
                                        as="button"
                                        className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                    >
                                        Click here to resend the verification email.
                                    </Link>
                                </p>
                                {status === 'verification-link-sent' && (
                                    <div className="mt-2 text-sm font-medium text-green-600">
                                        A new verification link has been sent to your email address.
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save'}
                            </Button>
                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>
                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
