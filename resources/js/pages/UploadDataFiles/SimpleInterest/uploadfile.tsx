import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Download, Play, RefreshCw, Search, Trash2, Upload, XCircle } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Upload Data Files', href: '#' },
    { title: 'Simple Interest', href: '#' },
    { title: 'Upload File', href: '/upload-data-files/simple-interest/upload-file' },
];

interface LoanData {
    id?: number;
    no_acc?: string;
    no_branch?: string;
    deb_name?: string;
    status?: string;
    ln_type?: string;
    org_date?: string;
    term?: string;
    mtr_date?: string;
    org_bal?: number;
    rate?: number;
    cbal?: number;
}

export default function UploadFile() {
    const {
        loanData: rawLoanData,
        successMessage,
        errorMessage,
        warningMessage,
    } = usePage().props as {
        loanData?: LoanData[];
        successMessage?: string;
        errorMessage?: string;
        warningMessage?: string;
    };

    const [loanDataState, setLoanDataState] = useState<LoanData[]>([]);
    const [filters, setFilters] = useState({
        month: 'all',
        year: 'all',
        search: '',
        status: 'all',
        lnType: 'all',
    });
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;
    const [localError, setLocalError] = useState<string | null>(null);

    // Initialize state with props data
    useEffect(() => {
        setLoanDataState(Array.isArray(rawLoanData) ? rawLoanData : []);
    }, [rawLoanData]);

    const filteredData = useMemo(() => {
        return loanDataState.filter((item) => {
            if (!item) return false;

            let dateMatch = true;
            if (item.org_date && filters.year !== 'all') {
                try {
                    const itemDate = new Date(item.org_date);
                    const itemYear = itemDate.getFullYear().toString();
                    const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');
                    dateMatch = (filters.year === 'all' || itemYear === filters.year) && (filters.month === 'all' || itemMonth === filters.month);
                } catch {
                    dateMatch = false;
                }
            }

            const searchMatch =
                filters.search === '' ||
                (item.no_acc && item.no_acc.toLowerCase().includes(filters.search.toLowerCase())) ||
                (item.deb_name && item.deb_name.toLowerCase().includes(filters.search.toLowerCase())) ||
                (item.no_branch && item.no_branch.toLowerCase().includes(filters.search.toLowerCase()));

            const statusMatch = filters.status === 'all' || item.status === filters.status;
            const lnTypeMatch = filters.lnType === 'all' || item.ln_type === filters.lnType;

            return dateMatch && searchMatch && statusMatch && lnTypeMatch;
        });
    }, [loanDataState, filters]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const uniqueStatuses = [...new Set(loanDataState.map((item) => item.status).filter(Boolean))];
    const uniqueLnTypes = [...new Set(loanDataState.map((item) => item.ln_type).filter(Boolean))];

    const handleFilterChange = useCallback((key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    }, []);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];

    const handleUpload = useCallback(() => {
        document.getElementById('file-upload')?.click();
    }, []);

    const handleExecute = useCallback(() => {
        // Check if there's data to execute
        if (loanDataState.length === 0) {
            setLocalError('Tidak ada data untuk dieksekusi. Silakan upload file terlebih dahulu.');
            return;
        }

        setLoading(true);
        router.post(
            '/upload-data-files/simple-interest/execute',
            {},
            {
                onFinish: () => setLoading(false),
                onSuccess: () => {
                    setLoanDataState([]);
                },
                onError: () => setLoading(false),
            },
        );
    }, [loanDataState.length]);

    const handleClearData = useCallback(() => {
        // Check if there's data to clear
        if (loanDataState.length === 0) {
            setLocalError('Tidak ada data untuk dihapus.');
            return;
        }

        if (!confirm('Apakah Anda yakin ingin membersihkan semua data?')) return;

        setLoading(true);
        router.delete('/upload-data-files/simple-interest/clear-data', {
            onFinish: () => {
                setLoading(false);
            },
            onSuccess: () => {
                setLoanDataState([]);
            },
            onError: () => {
                setLoading(false);
            },
        });
    }, [loanDataState.length]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (!token) {
            setLocalError('CSRF token tidak ditemukan. Silakan refresh halaman.');
            return;
        }

        const allowedExtensions = ['xlsx', 'xls', 'csv'];
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!ext || !allowedExtensions.includes(ext)) {
            setLocalError('Ekstensi file tidak valid. Harap unggah file dengan format XLSX, XLS, atau CSV.');
            return;
        }

        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            setLocalError('Ukuran file terlalu besar. Maksimal ukuran file adalah 2MB.');
            return;
        }

        setLocalError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        axios
            .post('/upload-data-files/simple-interest/upload-file', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-CSRF-TOKEN': token,
                },
            })
            .then((response) => {
                // Reload halaman untuk mendapatkan data terbaru
                window.location.reload();
            })
            .catch((error) => {
                console.error('Upload error:', error);
                const errorMsg = error.response?.data?.message || error.message || 'Gagal mengupload file';
                setLocalError(`Gagal mengupload file: ${errorMsg}`);
            })
            .finally(() => {
                setLoading(false);
                // Reset file input
                const fileInput = e.target;
                if (fileInput) {
                    fileInput.value = '';
                }
            });
    }, []);

    const handleExportData = useCallback(() => {
        if (!filteredData.length) return;
        const csvContent =
            'data:text/csv;charset=utf-8,' +
            'NO_ACC,NO_BRANCH,DEB_NAME,STATUS,LN_TYPE,ORG_DATE,TERM,MTR_DATE,ORG_BAL,RATE,CBAL\n' +
            filteredData
                .map(
                    (row) =>
                        `${row.no_acc},${row.no_branch},"${row.deb_name}",${row.status},${row.ln_type},${row.org_date},${row.term},${row.mtr_date},${row.org_bal},${row.rate},${row.cbal}`,
                )
                .join('\n');
        const link = document.createElement('a');
        link.href = encodeURI(csvContent);
        link.download = `loan_data_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }, [filteredData]);

    useEffect(() => {
        if (localError) {
            const timer = setTimeout(() => {
                setLocalError(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [localError]);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return '-';

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;

            return date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch (e) {
            console.error('Date formatting error:', e);
            return dateString;
        }
    };

    const alertVariants = {
        initial: { opacity: 0, y: -20, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
    };

    useEffect(() => {
        const checkSession = () => {
            if (!document.cookie.includes('XSRF-TOKEN')) {
                console.warn('Session belum terinisialisasi');
                setTimeout(checkSession, 100);
            }
        };
        checkSession();
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Data Files - Simple Interest - Upload File" />
            <div className="space-y-6">
                {/* Animated Alerts */}
                <div className="fixed top-4 right-4 z-50 w-full max-w-md space-y-2">
                    <AnimatePresence>
                        {successMessage && (
                            <motion.div
                                key="success"
                                variants={alertVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="cursor-pointer"
                                onClick={() => {
                                    // Hapus notifikasi dengan reload
                                    window.location.reload();
                                }}
                            >
                                <Alert className="border-green-200 bg-green-50 text-green-800 shadow-lg">
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>{successMessage}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                        {errorMessage && (
                            <motion.div
                                key="error"
                                variants={alertVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="cursor-pointer"
                                onClick={() => {
                                    window.location.reload();
                                }}
                            >
                                <Alert className="border-red-200 bg-red-50 text-red-800 shadow-lg">
                                    <XCircle className="h-4 w-4" />
                                    <AlertDescription>{errorMessage}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                        {warningMessage && (
                            <motion.div
                                key="warning"
                                variants={alertVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="cursor-pointer"
                                onClick={() => {
                                    window.location.reload();
                                }}
                            >
                                <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 shadow-lg">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>{warningMessage}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                        {localError && (
                            <motion.div
                                key="localError"
                                variants={alertVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="cursor-pointer"
                                onClick={() => setLocalError(null)}
                            >
                                <Alert className="border-red-200 bg-red-50 text-red-800 shadow-lg">
                                    <XCircle className="h-4 w-4" />
                                    <AlertDescription>{localError}</AlertDescription>
                                </Alert>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Loan Data File</CardTitle>
                        <CardDescription>Upload your loan data file (XLSX, XLS, CSV format) to process the data.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Buttons */}
                        <div className="flex flex-wrap gap-2">
                            <Button onClick={handleUpload} disabled={loading}>
                                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                Upload File
                            </Button>
                            <Button
                                onClick={handleExecute}
                                disabled={loading || loanDataState.length === 0}
                                className={loanDataState.length === 0 ? 'cursor-not-allowed opacity-50' : ''}
                            >
                                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                                Execute
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleClearData}
                                disabled={loading || loanDataState.length === 0}
                                className={loanDataState.length === 0 ? 'cursor-not-allowed text-white opacity-50' : 'text-white'}
                            >
                                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                Clear Data
                            </Button>
                            <Button variant="outline" onClick={handleExportData} disabled={!filteredData.length}>
                                <Download className="mr-2 h-4 w-4" />
                                Export Data
                            </Button>
                        </div>
                        <input id="file-upload" type="file" className="hidden" accept=".xlsx,.xls,.csv" onChange={handleFileChange} />

                        {/* Filters */}
                        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-6">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Year</label>
                                <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {years.map((year) => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Month</label>
                                <Select value={filters.month} onValueChange={(value) => handleFilterChange('month', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {months.map((m) => (
                                            <SelectItem key={m.value} value={m.value}>
                                                {m.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Status</label>
                                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {uniqueStatuses.map((status, idx) => (
                                            <SelectItem key={idx} value={status || ''}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium">Loan Type</label>
                                <Select value={filters.lnType} onValueChange={(value) => handleFilterChange('lnType', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All</SelectItem>
                                        {uniqueLnTypes.map((type, idx) => (
                                            <SelectItem key={idx} value={type || ''}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="mb-1 block text-sm font-medium">Search</label>
                                <div className="relative">
                                    <Input
                                        placeholder="Search by Account No, Branch, or Name"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                    />
                                    <Search className="absolute top-2.5 right-2 h-4 w-4 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>No. Acc</TableHead>
                                        <TableHead>Branch</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Loan Type</TableHead>
                                        <TableHead>Org Date</TableHead>
                                        <TableHead>Term</TableHead>
                                        <TableHead>Mtr Date</TableHead>
                                        <TableHead>Org Bal</TableHead>
                                        <TableHead>Rate</TableHead>
                                        <TableHead>CBAL</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedData.length ? (
                                        paginatedData.map((row, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{row.no_acc}</TableCell>
                                                <TableCell>{row.no_branch}</TableCell>
                                                <TableCell>{row.deb_name}</TableCell>
                                                <TableCell>
                                                    <Badge>{row.status}</Badge>
                                                </TableCell>
                                                <TableCell>{row.ln_type}</TableCell>
                                                <TableCell>{formatDate(row.org_date)}</TableCell>
                                                <TableCell>{row.term}</TableCell>
                                                <TableCell>{formatDate(row.mtr_date)}</TableCell>
                                                <TableCell>{row.org_bal}</TableCell>
                                                <TableCell>{row.rate}</TableCell>
                                                <TableCell>{row.cbal}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={11} className="text-center text-gray-500">
                                                No data found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-4 flex items-center justify-between">
                            <p className="text-sm text-gray-600">
                                Showing {paginatedData.length} of {filteredData.length} records
                            </p>
                            <div className="flex gap-2">
                                <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                                    Previous
                                </Button>
                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of {totalPages || 1}
                                </span>
                                <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage((p) => p + 1)}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
