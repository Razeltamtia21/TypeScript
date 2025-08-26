import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Report Loan',
        href: '#',
    },
    {
        title: 'Report Journal',
        href: '#',
    },
    {
        title: 'Effective',
        href: '/report-loan/report-journal/simple-interest',
    },
];

export default function SimpleInterest() {
    // Ambil data dari props yang dikirim controller dengan default value
    const { reportJournals = [] } = usePage().props;
    const { filters = {} } = usePage().props;

    // State untuk filter
    const [localFilters, setLocalFilters] = useState({
        month: filters.month || 'all',
        year: filters.year || new Date().getFullYear().toString()
    });

    // Fungsi untuk update filter dan submit ke server
    const handleFilterChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        
        // Kirim filter ke server dengan Inertia
        const params = {};
        if (newFilters.month !== 'all') params.month = newFilters.month;
        if (newFilters.year !== 'all') params.year = newFilters.year;

        router.get(route('report.loan.report-journal.simple-interest'), params, {
            preserveState: true,
            replace: true
        });
    };

    // Generate years for dropdown (current year ± 5 years)
    const currentYear = new Date().getFullYear();
    const years = Array.from({length: 11}, (_, i) => currentYear - 5 + i);

    // Months array
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
        { value: '12', label: 'December' }
    ];

    // Fungsi export to Excel
    const exportToExcel = () => {
        console.log('Export to Excel clicked');
        
        // Coba load library XLSX dari beberapa sumber
        const loadXLSX = () => {
            return new Promise((resolve, reject) => {
                // Coba load dari CDN pertama
                const script1 = document.createElement('script');
                script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
                script1.onload = () => {
                    console.log('XLSX loaded from CDN 1');
                    resolve(window.XLSX);
                };
                script1.onerror = () => {
                    console.log('Failed to load XLSX from CDN 1, trying CDN 2');
                    // Coba CDN kedua
                    const script2 = document.createElement('script');
                    script2.src = 'https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js';
                    script2.onload = () => {
                        console.log('XLSX loaded from CDN 2');
                        resolve(window.XLSX);
                    };
                    script2.onerror = () => {
                        console.log('Failed to load XLSX from CDN 2, trying CDN 3');
                        // Coba CDN ketiga
                        const script3 = document.createElement('script');
                        script3.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
                        script3.onload = () => {
                            console.log('XLSX loaded from CDN 3');
                            resolve(window.XLSX);
                        };
                        script3.onerror = () => {
                            console.error('All CDNs failed to load XLSX');
                            reject(new Error('Failed to load XLSX library'));
                        };
                        document.head.appendChild(script3);
                    };
                    document.head.appendChild(script2);
                };
                document.head.appendChild(script1);
            });
        };
        
        loadXLSX()
            .then((XLSX) => {
                console.log('XLSX library loaded, preparing data');
                
                // Prepare data for Excel
                const excelData = [
                    // Headers
                    ['No', 'Entity Number', 'GL Account', 'Description', 'Debit', 'Credit', 'Posting Date'],
                    // Data rows
                    ...reportJournals.map((item, index) => [
                        index + 1,
                        item.entity_number || '',
                        item.gl_account || '',
                        item.description || '',
                        Number(item.debit || 0),
                        Number(item.credit || 0),
                        item.posting_date || ''
                    ])
                ];
                
                console.log('Data prepared, creating workbook');
                
                // Create workbook and worksheet
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(excelData);
                
                // Set column widths
                ws['!cols'] = [
                    { width: 5 },   // No
                    { width: 15 },  // Entity Number
                    { width: 15 },  // GL Account
                    { width: 40 },  // Description
                    { width: 15 },  // Debit
                    { width: 15 },  // Credit
                    { width: 12 },  // Posting Date
                ];
                
                // Style the header row
                const headerRange = XLSX.utils.decode_range(ws['!ref']);
                for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
                    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
                    if (!ws[cellRef]) continue;
                    ws[cellRef].s = {
                        font: { bold: true },
                        fill: { fgColor: { rgb: "F2F2F2" } },
                        alignment: { horizontal: "center" }
                    };
                }
                
                // Add worksheet to workbook
                XLSX.utils.book_append_sheet(wb, ws, 'Report Journal - Effective');
                
                // Generate filename
                const filename = `report_journal_simple_interest_${new Date().toISOString().split('T')[0]}.xlsx`;
                
                console.log('Saving file:', filename);
                
                // Save file
                XLSX.writeFile(wb, filename);
                
                console.log('File saved successfully');
            })
            .catch((error) => {
                console.error('Error in exportToExcel:', error);
                // Tampilkan pesan error kepada pengguna
                alert('Gagal mengekspor data ke Excel. Silakan coba lagi atau hubungi administrator.');
            });
    };
    
    // Fungsi export to PDF
    const exportToPDF = () => {
        const printWindow = window.open('', '_blank');
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Report Journal - Effective</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    h1 { color: #333; }
                    .header-info { margin-bottom: 20px; }
                    .amount { text-align: right; }
                    @media print {
                        body { margin: 0; }
                        table { page-break-inside: auto; }
                        tr { page-break-inside: avoid; page-break-after: auto; }
                    }
                </style>
            </head>
            <body>
                <div class="header-info">
                    <h1>Report Loan - Report Journal</h1>
                    <p><strong>Effective</strong></p>
                    <p>Export Date: ${new Date().toLocaleDateString('id-ID')}</p>
                    <p>Total Records: ${reportJournals.length}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Entity Number</th>
                            <th>GL Account</th>
                            <th>Description</th>
                            <th class="amount">Debit</th>
                            <th class="amount">Credit</th>
                            <th>Posting Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reportJournals.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item.entity_number || ''}</td>
                                <td>${item.gl_account || ''}</td>
                                <td>${item.description || ''}</td>
                                <td class="amount">Rp ${Number(item.debit || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.credit || 0).toLocaleString('id-ID')}</td>
                                <td>${item.posting_date || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // Wait for content to load then print
        printWindow.onload = function() {
            printWindow.print();
            printWindow.close();
        };
    };
    
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Report Loan - Report Journal - Effective" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header dengan judul dan tombol aksi */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Report Loan - Report Journal</h1>
                        <p className="text-muted-foreground">
                            Effective
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={exportToPDF}>
                            <Download className="mr-2 h-4 w-4" />
                            Export to PDF
                        </Button>
                        <Button variant="outline" size="sm" onClick={exportToExcel}>
                            <Download className="mr-2 h-4 w-4" />
                            Export to Excel
                        </Button>
                    </div>
                </div>
                
                {/* Filter Periode */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-blue-600" />
                                <Select value={localFilters.month} onValueChange={(value) => handleFilterChange('month', value)}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Semua Bulan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Bulan</SelectItem>
                                        {months.map(month => (
                                            <SelectItem key={month.value} value={month.value}>
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Select value={localFilters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                                    <SelectTrigger className="w-28">
                                        <SelectValue placeholder="Tahun" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        {years.map(year => (
                                            <SelectItem key={year} value={year.toString()}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1"></div>
                            <div className="text-sm text-muted-foreground">
                                {reportJournals.length} dari {Array.isArray(reportJournals) ? reportJournals.length : 0} data
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Tabel Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Report Journal - Effective</CardTitle>
                        <CardDescription>
                            Journal entries for loan transactions with effective
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!Array.isArray(reportJournals) ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Error: Data tidak tersedia atau format tidak valid</p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">No.</TableHead>
                                            <TableHead>Entity Number</TableHead>
                                            <TableHead>GL Account</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Debit</TableHead>
                                            <TableHead className="text-right">Credit</TableHead>
                                            <TableHead>Posting Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportJournals.length > 0 ? (
                                            reportJournals.map((item, index) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                                    <TableCell>{item.entity_number || '-'}</TableCell>
                                                    <TableCell>{item.gl_account || '-'}</TableCell>
                                                    <TableCell>{item.description || '-'}</TableCell>
                                                    <TableCell className="text-right">
                                                        {item.debit ? `Rp ${Number(item.debit).toLocaleString('id-ID')}` : '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {item.credit ? `Rp ${Number(item.credit).toLocaleString('id-ID')}` : '-'}
                                                    </TableCell>
                                                    <TableCell>{item.posting_date || '-'}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                    Tidak ada data tersedia
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                        
                        {/* Pagination */}
                        <div className="flex items-center justify-between space-x-2 py-4">
                            <div className="text-sm text-muted-foreground">
                                Showing <strong>1-{reportJournals.length}</strong> of <strong>{reportJournals.length}</strong> results
                            </div>
                            <div className="flex space-x-2">
                                <Button variant="outline" size="sm" disabled>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm" disabled>
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