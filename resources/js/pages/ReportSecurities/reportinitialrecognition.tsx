import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download } from 'lucide-react';
import React, { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Report Securities',
        href: '#',
    },
    {
        title: 'Report Initial Recognition',
        href: '/report-securities/report-initial-recognition',
    },
];

export default function ReportInitialRecognition() {
    // Ambil data dari props yang dikirim controller dengan default value
    const { reportSecurities = [] } = usePage().props;
    
    // State untuk filter
    const [filters, setFilters] = useState({
        month: 'all',
        year: new Date().getFullYear().toString()
    });
    
    // Filter data berdasarkan state filter
    const filteredData = useMemo(() => {
        // Pastikan reportSecurities adalah array
        if (!Array.isArray(reportSecurities)) {
            console.warn('reportSecurities is not an array:', reportSecurities);
            return [];
        }
        
        return reportSecurities.filter(item => {
            // Pastikan item dan settlement_date ada
            if (!item || !item.settlement_date) {
                return false;
            }
            
            try {
                // Assuming settlement_date is in format YYYY-MM-DD or similar
                const itemDate = new Date(item.settlement_date);
                const itemYear = itemDate.getFullYear().toString();
                const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');
                return (
                    (filters.year === 'all' || itemYear === filters.year) &&
                    (filters.month === 'all' || itemMonth === filters.month)
                );
            } catch (error) {
                console.warn('Error parsing date:', item.settlement_date, error);
                return false;
            }
        });
    }, [reportSecurities, filters]);
    
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
                    ['No', 'Account Number', 'Deal Number', 'Issuer Name', 'Settlement Date', 
                     'Tenor (TTM)', 'Maturity Date', 'Coupon Rate', 'Yield (YTM)', 'Price', 
                     'Face Value', 'Carrying Amount', 'At Discount', 'At Premium', 'Brokerage Fee', 
                     'EIR Exposure', 'EIR Calculated', 'EIR Conversion', 'EIR At Discount', 
                     'EIR At Premium', 'EIR Brokerage'],
                    // Data rows
                    ...filteredData.map((item, index) => [
                        index + 1,
                        item.account_number || '',
                        item.deal_number || '',
                        item.issuer_name || '',
                        item.settlement_date || '',
                        item.tenor_ttm || '',
                        item.maturity_date || '',
                        `${item.coupon_rate || ''}%`,
                        `${item.yield_ytm || ''}%`,
                        Number(item.price || 0),
                        Number(item.face_value || 0),
                        Number(item.carrying_amount || 0),
                        Number(item.at_discount || 0),
                        Number(item.at_premium || 0),
                        Number(item.brokerage_fee || 0),
                        Number(item.eir_exposure || 0),
                        Number(item.eir_calculated || 0),
                        Number(item.eir_conversion || 0),
                        Number(item.eir_at_discount || 0),
                        Number(item.eir_at_premium || 0),
                        Number(item.eir_brokerage || 0)
                    ])
                ];
                
                console.log('Data prepared, creating workbook');
                
                // Create workbook and worksheet
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(excelData);
                
                // Set column widths
                ws['!cols'] = [
                    { width: 5 },   // No
                    { width: 15 },  // Account Number
                    { width: 15 },  // Deal Number
                    { width: 25 },  // Issuer Name
                    { width: 12 },  // Settlement Date
                    { width: 10 },  // Tenor (TTM)
                    { width: 12 },  // Maturity Date
                    { width: 10 },  // Coupon Rate
                    { width: 10 },  // Yield (YTM)
                    { width: 10 },  // Price
                    { width: 15 },  // Face Value
                    { width: 15 },  // Carrying Amount
                    { width: 12 },  // At Discount
                    { width: 12 },  // At Premium
                    { width: 12 },  // Brokerage Fee
                    { width: 12 },  // EIR Exposure
                    { width: 12 },  // EIR Calculated
                    { width: 12 },  // EIR Conversion
                    { width: 12 },  // EIR At Discount
                    { width: 12 },  // EIR At Premium
                    { width: 12 },  // EIR Brokerage
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
                XLSX.utils.book_append_sheet(wb, ws, 'Securities Initial Recognition');
                
                // Generate filename
                const filename = `securities_initial_recognition_${new Date().toISOString().split('T')[0]}.xlsx`;
                
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
                <title>Securities Initial Recognition</title>
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
                    <h1>Report Securities - Initial Recognition</h1>
                    <p>Export Date: ${new Date().toLocaleDateString('id-ID')}</p>
                    <p>Total Records: ${filteredData.length}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Account Number</th>
                            <th>Deal Number</th>
                            <th>Issuer Name</th>
                            <th>Settlement Date</th>
                            <th>Tenor (TTM)</th>
                            <th>Maturity Date</th>
                            <th>Coupon Rate</th>
                            <th>Yield (YTM)</th>
                            <th>Price</th>
                            <th>Face Value</th>
                            <th>Carrying Amount</th>
                            <th>At Discount</th>
                            <th>At Premium</th>
                            <th>Brokerage Fee</th>
                            <th>EIR Exposure</th>
                            <th>EIR Calculated</th>
                            <th>EIR Conversion</th>
                            <th>EIR At Discount</th>
                            <th>EIR At Premium</th>
                            <th>EIR Brokerage</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filteredData.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${item.account_number || ''}</td>
                                <td>${item.deal_number || ''}</td>
                                <td>${item.issuer_name || ''}</td>
                                <td>${item.settlement_date || ''}</td>
                                <td>${item.tenor_ttm || ''}</td>
                                <td>${item.maturity_date || ''}</td>
                                <td>${item.coupon_rate || ''}%</td>
                                <td>${item.yield_ytm || ''}%</td>
                                <td class="amount">Rp ${Number(item.price || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.face_value || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.carrying_amount || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.at_discount || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.at_premium || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.brokerage_fee || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.eir_exposure || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.eir_calculated || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.eir_conversion || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.eir_at_discount || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.eir_at_premium || 0).toLocaleString('id-ID')}</td>
                                <td class="amount">Rp ${Number(item.eir_brokerage || 0).toLocaleString('id-ID')}</td>
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
            <Head title="Report Securities - Initial Recognition" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4">
                {/* Header dengan judul dan tombol aksi */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Report Securities - Initial Recognition</h1>
                        <p className="text-muted-foreground">
                            Report Initial Recognition
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
                                {filteredData.length} dari {Array.isArray(reportSecurities) ? reportSecurities.length : 0} data
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Tabel Data */}
                <Card>
                    <CardHeader>
                        <CardTitle>Securities Initial Recognition</CardTitle>
                        <CardDescription>
                            Data pengakuan awal sekuritas dengan perhitungan Effective Interest Rate
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!Array.isArray(reportSecurities) ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">Error: Data tidak tersedia atau format tidak valid</p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Pastikan controller mengirimkan data 'reportSecurities' sebagai array
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">No.</TableHead>
                                            <TableHead>Account Number</TableHead>
                                            <TableHead>Deal Number</TableHead>
                                            <TableHead>Issuer Name</TableHead>
                                            <TableHead>Settlement Date</TableHead>
                                            <TableHead>Tenor (TTM)</TableHead>
                                            <TableHead>Maturity Date</TableHead>
                                            <TableHead>Coupon Rate</TableHead>
                                            <TableHead>Yield (YTM)</TableHead>
                                            <TableHead>Price</TableHead>
                                            <TableHead>Face Value</TableHead>
                                            <TableHead>Carrying Amount</TableHead>
                                            <TableHead>At Discount</TableHead>
                                            <TableHead>At Premium</TableHead>
                                            <TableHead>Brokerage Fee</TableHead>
                                            <TableHead>EIR Exposure</TableHead>
                                            <TableHead>EIR Calculated</TableHead>
                                            <TableHead>EIR Conversion</TableHead>
                                            <TableHead>EIR At Discount</TableHead>
                                            <TableHead>EIR At Premium</TableHead>
                                            <TableHead>EIR Brokerage</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredData.length > 0 ? (
                                            filteredData.map((item, index) => (
                                                <TableRow key={item.id || index}>
                                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                                    <TableCell>{item.account_number || '-'}</TableCell>
                                                    <TableCell>{item.deal_number || '-'}</TableCell>
                                                    <TableCell>{item.issuer_name || '-'}</TableCell>
                                                    <TableCell>{item.settlement_date || '-'}</TableCell>
                                                    <TableCell>{item.tenor_ttm || '-'}</TableCell>
                                                    <TableCell>{item.maturity_date || '-'}</TableCell>
                                                    <TableCell>{item.coupon_rate || '-'}%</TableCell>
                                                    <TableCell>{item.yield_ytm || '-'}%</TableCell>
                                                    <TableCell>Rp {Number(item.price || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.face_value || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.carrying_amount || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.at_discount || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.at_premium || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.brokerage_fee || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.eir_exposure || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.eir_calculated || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.eir_conversion || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.eir_at_discount || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.eir_at_premium || 0).toLocaleString('id-ID')}</TableCell>
                                                    <TableCell>Rp {Number(item.eir_brokerage || 0).toLocaleString('id-ID')}</TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={22} className="text-center py-8 text-muted-foreground">
                                                    {Array.isArray(reportSecurities) && reportSecurities.length === 0 
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