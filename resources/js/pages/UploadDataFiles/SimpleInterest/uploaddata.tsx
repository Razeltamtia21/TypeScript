import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Data',
        href: '/uploaddata1',
    },
];

export default function UploadData() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Data" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-bold">Report Securities</h1>
                <p>Halaman untuk menampilkan laporan sekuritas</p>
                {/* Tambahkan konten halaman Report Securities di sini */}
            </div>
        </AppLayout>
    );
}