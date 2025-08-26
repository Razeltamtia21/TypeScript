import AppLogoIcon from './app-logo-icon';
import { usePage } from '@inertiajs/react';

export default function AppLogo() {
    const { props }: any = usePage(); 
    const user = props.auth?.user;

    // ambil nama PT dari user login
    const companyName = user?.company_name || "My Company";
    // ambil huruf pertama dari nama PT (uppercase)
    const initial = companyName.charAt(0).toUpperCase();
    // ambil logo custom (kalau user sudah upload)
    const logo = user?.company_logo; // misalnya field di DB

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                {logo ? (
                    // kalau ada file gambar di DB → render img
                    <img
                        src={`/storage/${logo}`}
                        alt={companyName}
                        className="size-full object-cover"
                    />
                ) : (
                    // kalau belum upload logo → fallback ke huruf awal PT
                    <span className="text-white dark:text-black font-bold text-lg">
                        {initial}
                    </span>
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {companyName}
                </span>
            </div>
        </>
    );
}
