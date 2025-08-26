// resources/js/Pages/ReportLoan/ReportOutstanding/Effective.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, Search, Filter } from 'lucide-react';
import React, { useState, useMemo } from 'react';

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
        title: 'Report Outstanding',
        href: '#',
    },
    {
        title: 'Effective',
        href: '/report-loan/report-outstanding/effective',
    },
];

export default function Effective() {
    // Ambil data dari props yang dikirim controller dengan default value
    const { loanOutstandings = [] } = usePage().props;
    // State untuk filter
    const [filters, setFilters] = useState({
        month: 'all',
        year: new Date().getFullYear().toString()
    });
    // Filter data berdasarkan state filter
    const filteredData = useMemo(() => {
        // Pastikan loanOutstandings adalah array
        if (!Array.isArray(loanOutstandings)) {
            console.warn('loanOutstandings is not an array:', loanOutstandings);
            return [];
        }
        return loanOutstandings.filter(item => {
            // Pastikan item dan original_date ada
            if (!item || !item.original_date) {
                return false;
            }
            try {
                // Assuming original_date is in format YYYY-MM-DD or similar
                const itemDate = new Date(item.original_date);
                const itemYear = itemDate.getFullYear().toString();
                const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');
                return (
                    (filters.year === 'all' || itemYear === filters.year) &&
                    (filters.month === 'all' || itemMonth === filters.month)
                );
            } catch (error) {
                console.warn('Error parsing date:', item.original_date, error);
                return false;
            }
        });
    }, [loanOutstandings, filters]);
    // Fungsi untuk update filter
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
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
    // Fungsi export to Excel (.xlsx) dengan pendekatan yang lebih andal
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
                    ['No', 'Entity Number', 'Account Number', 'Debitor Name', 'GL Account',
                     'Loan Type', 'GL Group', 'Original Date', 'Term (Months)', 'Maturity Date',
                     'Interest Rate', 'Payment Amount', 'EIR Amortised Cost Exposure', 
                     'EIR Amortised Cost Calculated', 'Current Balance', 'Carrying Amount',
                     'Oustanding Receivable', 'Outstanding Interest', 'Cummulative Time Gap',
                     'Unamortized Transaction Cost', 'Unamortized UpFront Fee', 'Unearned Interest Income'],
                    // Data rows
                    ...filteredData.map((item, index) => [
                        index + 1,
                        item.entity_number || '',
                        item.account_number || '',
                        item.debitor_name || '',
                        item.gl_account || '',
                        item.loan_type || '',
                        item.gl_group || '',
                        item.original_date || '',
                        item.term_months || '',
                        item.maturity_date || '',
                        `${item.interest_rate || ''}%`,
                        Number(item.payment_amount || 0),
                        Number(item.eir_amortised_cost_exposure || 0),
                        Number(item.eir_amortised_cost_calculated || 0),
                        Number(item.current_balance || 0),
                        Number(item.carrying_amount || 0),
                        Number(item.outstanding_receivable || 0),
                        Number(item.outstanding_interest || 0),
                        Number(item.cumulative_time_gap || 0),
                        Number(item.unamortized_transaction_cost || 0),
                        Number(item.unamortized_upfront_fee || 0),
                        Number(item.unearned_interest_income || 0)
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
                    { width: 15 },  // Account Number
                    { width: 25 },  // Debtor Name
                    { width: 15 },  // GL Account
                    { width: 12 },  // Loan Type
                    { width: 15 },  // GL Group
                    { width: 12 },  // Original Date
                    { width: 8 },   // Term
                    { width: 12 },  // Maturity Date
                    { width: 10 },  // Interest Rate
                    { width: 15 },  // Payment Amount
                    { width: 20 },  // EIR Amortised Cost Exposure
                    { width: 22 },  // EIR Amortised Cost Calculated
                    { width: 15 },  // Current Balance
                    { width: 15 },  // Carrying Amount
                    { width: 18 },  // Outstanding Receivable
                    { width: 16 },  // Outstanding Interest
                    { width: 16 },  // Cumulative Time Gap
                    { width: 22 },  // Unamortized Transaction Cost
                    { width: 20 },  // Unamortized UpFront Fee
                    { width: 20 }   // Unearned Interest Income
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
                XLSX.utils.book_append_sheet(wb, ws, 'Report Outstanding - Effective');
                
                // Generate filename
                const filename = `report_outstanding_effective_${new Date().toISOString().split('T')[0]}.xlsx`;
                
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
    
    // Fungsi export to PDF (simplified version)
    const exportToPDF = () => {
        const printWindow = window.open('', '_blank');
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Report Outstanding - Effective</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 10px; }
                    th { background-color: #f2f2f2; font-weight: bold; }
                    h1 { color: #333; }
                    .header-info { margin-bottom: 20px; }
                    @media print {
                        body { margin: 0; }
                        table { page-break-inside: auto; }
                        tr { page-break-inside: avoid; page-break-after: auto; }
                    }
                </style>
            </head>
            <body>
                <div class="header-info">
                    <h1>Report Loan - Report Outstanding</h1>
                    <p><strong>Effective Interest Rate Calculation</strong></p>
                    <p>Export Date: ${new Date().toLocaleDateString('id-ID')}</p>
                    <p>Total Records: ${filteredData.length}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Entity Number</th>
                            <th>Account Number</th>
                            <th>Debtor Name</th>
                            <th>GL Account</th>
                            <th>Loan Type</th>
                            <th>GL Group</th>
                            <th>Original Date</th>
                            <th>Term (Months)</th>
                            <th>Maturity Date</th>
                            <th>Interest Rate</th>
                            <th>Payment Amount</th>
                            <th>EIR Amortised Cost Exposure</th>
                            <th>EIR Amortised Cost Calculated</th>
                            <th>Current Balance</th>
                            <th>Carrying Amount</th>
                            <th>Oustanding Receivable</th>
                            <th>Outstanding Interest</th>
                            <th>Cummulative Time Gap</th>
                            <th>Unamortized Transaction Cost</th>
                            <th>Unamortized UpFront Fee</th>
                            <th>Unearned Interest Income</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item.entity_number || ''}</td>
                                <td>${item.account_number || ''}</td>
                                <td>${item.debtor_name || ''}</td>
                                <td>${item.gl_account || ''}</td>
                                <td>${item.loan_type || ''}</td>
                                <td>${item.gl_group || ''}</td>
                                <td>${item.original_date || ''}</td>
                                <td>${item.term_months || ''}</td>
                                <td>${item.maturity_date || ''}</td>
                                <td>${item.interest_rate || ''}%</td>
                                <td>Rp ${Number(item.payment_amount || 0).toLocaleString('id-ID')}</td>
                                <td>Rp ${Number(item.eir_amortised_cost_exposure || 0).toLocaleString('id-ID')}</td>
                                <td>Rp ${Number(item.eir_amortised_cost_calculated || 0).toLocaleString('id-ID')}</td>
                                <td>Rp ${Number(item.current_balance || 0).toLocaleString('id-ID')}</td>
                                <td>Rp ${Number(item.carrying_amount || 0).toLocaleString('id-ID')}</td>
                                <td>Rp ${Number(item.outstanding_receivable || 0).toLocaleString('id-ID')}</td>
                                <td>Rp ${Number(item.outstanding_interest || 0).toLocaleString('id-ID')}</td>
                                <td>Rp ${Number(item.cumulative_time_gap || 0).toLocaleString('id-ID')}</td>
                                <td>Rp ${Number(item.unamortized_transaction_cost || 0).toLocaleString('id-ID')}</td>
                                <td>Rp ${Number(item.unamortized_upfront_fee || 0).toLocaleString('id-ID')}</td>
                                <td>Rp ${Number(item.unearned_interest_income || 0).toLocaleString('id-ID')}</td>
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
            <Head title="Report Loan - Report Outstanding - Effective" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header dengan judul dan tombol aksi */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Report Loan - Report Outstanding</h1>
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
                                <Select value={filters.month} onValueChange={(value) => handleFilterChange('month', value)}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Bulan/Tahun" />
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
                                <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
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
                                {filteredData.length} dari {Array.isArray(loanOutstandings) ? loanOutstandings.length : 0} data
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Tabel Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Report Outstanding - Effective</CardTitle>
                        <CardDescription>
                            Data pinjaman outstanding dengan perhitungan Effective
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!Array.isArray(loanOutstandings) ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Error: Data tidak tersedia atau format tidak valid</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Pastikan controller mengirimkan data 'loanOutstandings' sebagai array
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">No.</TableHead>
                                            <TableHead>Entity Number</TableHead>
                                            <TableHead>Account Number</TableHead>
                                            <TableHead>Debtor Name</TableHead>
                                            <TableHead>GL Account</TableHead>
                                            <TableHead>Loan Type</TableHead>
                                            <TableHead>GL Group</TableHead>
                                            <TableHead>Original Date</TableHead>
                                            <TableHead>Term (Months)</TableHead>
                                            <TableHead>Maturity Date</TableHead>
                                            <TableHead>Interest Rate</TableHead>
                                            <TableHead>Payment Amount</TableHead>
                                            <TableHead>EIR Amortised Cost Exposure</TableHead>
                                            <TableHead>EIR Amortised Cost Calculated</TableHead>
                                            <TableHead>Current Balance</TableHead>
                                            <TableHead>Carrying Amount</TableHead>
                                            <TableHead>Oustanding Receivable</TableHead>
                                            <TableHead>Outstanding Interest</TableHead>
                                            <TableHead>Cummulative Time Gap</TableHead>
                                            <TableHead>Unamortized Transaction Cost</TableHead>
                                            <TableHead>Unamortized UpFront Fee</TableHead>
                                            <TableHead>Unearned Interest Income</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.length > 0 ? (
                                            filteredData.map((item, index) => (
                                                <TableRow key={item.id || index}>
                                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                                    <TableCell>{item.entity_number || '-'}</TableCell>
                                                    <TableCell>{item.account_number || '-'}</TableCell>
                                                    <TableCell>{item.debtor_name || '-'}</TableCell>
                                                    <TableCell>{item.gl_account || '-'}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {item.loan_type || '-'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{item.gl_group || '-'}</TableCell>
                                                    <TableCell>{item.original_date || '-'}</TableCell>
                                                    <TableCell>{item.term_months || '-'}</TableCell>
                                                    <TableCell>{item.maturity_date || '-'}</TableCell>
                                                    <TableCell>{item.interest_rate || '-'}%</TableCell>
                                                    <TableCell>Rp {Number(item.payment_amount || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.eir_amortised_cost_exposure || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.eir_amortised_cost_calculated || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.current_balance || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.carrying_amount || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.outstanding_receivable || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.outstanding_interest || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.cumulative_time_gap || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.unamortized_transaction_cost || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.unamortized_upfront_fee || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.unearned_interest_income || 0).toLocaleString('id-ID')}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={22} className="text-center py-8 text-muted-foreground">
                                                    {Array.isArray(loanOutstandings) && loanOutstandings.length === 0 
                                                        ? 'Tidak ada data tersedia'
                                                        : 'Tidak ada data yang sesuai dengan filter yang dipilih'
                                                    }
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
                                Showing <strong>1-{filteredData.length}</strong> of <strong>{filteredData.length}</strong> results
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