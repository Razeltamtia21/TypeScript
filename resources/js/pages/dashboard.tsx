import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
    FileText, 
    TrendingUp, 
    Users, 
    DollarSign, 
    FolderOpen, 
    Calendar,
    BarChart3,
    Download,
    Eye,
    MoreHorizontal
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

// Data dummy untuk dashboard
const statsData = [
    {
        title: 'Total Loans',
        value: '12,482',
        change: '+14%',
        icon: DollarSign,
        description: 'Total active loans this month',
    },
    {
        title: 'Securities',
        value: '8,246',
        change: '+8.2%',
        icon: FileText,
        description: 'Total securities portfolio',
    },
    {
        title: 'New Clients',
        value: '1,248',
        change: '+23.5%',
        icon: Users,
        description: 'New clients this month',
    },
    {
        title: 'Reports Generated',
        value: '3,482',
        change: '+12.4%',
        icon: BarChart3,
        description: 'Reports this quarter',
    },
];

const recentReports = [
    {
        id: 1,
        name: 'Loan Recognition Report',
        type: 'Loan',
        date: '2023-06-15',
        status: 'Completed',
        size: '2.4 MB',
    },
    {
        id: 2,
        name: 'Securities Evaluation',
        type: 'Securities',
        date: '2023-06-14',
        status: 'Processing',
        size: '1.8 MB',
    },
    {
        id: 3,
        name: 'Monthly Outstanding',
        type: 'Loan',
        date: '2023-06-12',
        status: 'Completed',
        size: '3.1 MB',
    },
    {
        id: 4,
        name: 'Treasury Bond Analysis',
        type: 'Securities',
        date: '2023-06-10',
        status: 'Completed',
        size: '4.2 MB',
    },
    {
        id: 5,
        name: 'Journal Entries Report',
        type: 'Journal',
        date: '2023-06-08',
        status: 'Failed',
        size: '1.2 MB',
    },
];

const recentActivities = [
    {
        user: 'Andi Ahmad',
        action: 'uploaded new data files',
        time: '2 hours ago',
    },
    {
        user: 'System',
        action: 'generated Loan Recognition Report',
        time: '5 hours ago',
    },
    {
        user: 'Budi Santoso',
        action: 'updated securities portfolio',
        time: '1 day ago',
    },
    {
        user: 'System',
        action: 'completed Monthly Outstanding report',
        time: '1 day ago',
    },
    {
        user: 'Siti Nurhaliza',
        action: 'downloaded Treasury Bond Analysis',
        time: '2 days ago',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 rounded-xl p-4 overflow-x-auto">
                {/* Header dengan judul dan tombol */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">
                            Overview of your financial reports and data
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        <Button size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Generate Report
                        </Button>
                    </div>
                </div>

                {/* Kartu Statistik */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statsData.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className="text-green-500">{stat.change}</span> {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Konten Utama dengan Tabs */}
                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="reports">Reports</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            {/* Recent Reports */}
                            <Card className="col-span-4">
                                <CardHeader>
                                    <CardTitle>Recent Reports</CardTitle>
                                    <CardDescription>
                                        Your latest generated reports
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentReports.map((report) => (
                                            <div key={report.id} className="flex items-center justify-between border-b pb-3">
                                                <div className="space-y-1">
                                                    <p className="font-medium leading-none">
                                                        {report.name}
                                                    </p>
                                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                        <Badge variant="outline">{report.type}</Badge>
                                                        <span>{report.date}</span>
                                                        <span>{report.size}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Badge 
                                                        variant={report.status === 'Completed' ? 'default' : 
                                                                report.status === 'Processing' ? 'secondary' : 'destructive'}
                                                    >
                                                        {report.status}
                                                    </Badge>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                            
                            {/* Recent Activities */}
                            <Card className="col-span-3">
                                <CardHeader>
                                    <CardTitle>Recent Activities</CardTitle>
                                    <CardDescription>
                                        Latest system activities
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivities.map((activity, index) => (
                                            <div key={index} className="flex items-start space-x-3">
                                                <div className="bg-primary/10 p-1 rounded-full">
                                                    <Calendar className="h-4 w-4 text-primary" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm">
                                                        <span className="font-medium">{activity.user}</span> {activity.action}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {activity.time}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="reports" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>All Reports</CardTitle>
                                <CardDescription>
                                    Manage and view all your generated reports
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Report Name</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Size</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {recentReports.map((report) => (
                                            <TableRow key={report.id}>
                                                <TableCell className="font-medium">
                                                    {report.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{report.type}</Badge>
                                                </TableCell>
                                                <TableCell>{report.date}</TableCell>
                                                <TableCell>
                                                    <Badge 
                                                        variant={report.status === 'Completed' ? 'default' : 
                                                                report.status === 'Processing' ? 'secondary' : 'destructive'}
                                                    >
                                                        {report.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>{report.size}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end space-x-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <Download className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                    <TabsContent value="analytics" className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Loan Portfolio</CardTitle>
                                    <CardDescription>
                                        Overview of your loan portfolio
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-80">
                                    <div className="relative h-full w-full">
                                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    Loan Portfolio Analytics
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card>
                                <CardHeader>
                                    <CardTitle>Securities Performance</CardTitle>
                                    <CardDescription>
                                        Performance of your securities portfolio
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="h-80">
                                    <div className="relative h-full w-full">
                                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    Securities Performance Chart
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}