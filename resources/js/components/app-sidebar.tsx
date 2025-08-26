import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, FileText, Folder, FolderOpen, Album } from 'lucide-react';
import { useState } from 'react';

// Data navigasi utama dengan pengelompokan bersarang
const mainNavItems = [
    {
        title: 'Report Loan',
        icon: Folder,
        items: [
            {
                title: 'Report Initial Recognition',
                icon: Folder,
                items: [
                    {
                        title: 'Effective',
                        href: '/report-loan/report-initial-recognition/effective',
                        icon: FileText,
                    },
                    {
                        title: 'Simple Interest', // Perbaiki penulisan
                        href: '/report-loan/report-initial-recognition/simple-interest',
                        icon: FileText,
                    },
                ],
            },
            {
                title: 'Report Outstanding',
                icon: Folder,
                items: [
                    {
                        title: 'Effective',
                        href: '/report-loan/report-outstanding/effective',
                        icon: FileText,
                    },
                    {
                        title: 'Simple Interest',
                        href: '/report-loan/report-outstanding/simple-interest',
                        icon: FileText,
                    },
                ],
            },
            {
                title: 'Report Journal',
                icon: Folder,
                items: [
                    {
                        title: 'Effective',
                        href: '/report-loan/report-journal/effective',
                        icon: FileText,
                    },
                    {
                        title: 'Simple Interest',
                        href: '/report-loan/report-journal/simple-interest',
                        icon: FileText,
                    },
                ],
            },
        ],
    },
    {
        title: 'Report Securities',
        icon: Folder,
        items: [
            {
                title: 'Report Initial Recognition',
                href: '/report-securities/report-initial-recognition', // Perbaiki URL
                icon: FileText,
            },
            {
                title: 'Report Outstanding',
                icon: Folder,
                items: [
                    {
                        title: 'Outstanding FVTOCI',
                        href: '/report-securities/report-outstanding/outstanding-fvtoci',
                        icon: FileText,
                    },
                    {
                        title: 'Outstanding Amortized Cost',
                        href: '/report-securities/report-outstanding/outstanding-amortized-cost',
                        icon: FileText,
                    },
                ],
            },
            {
                title: 'Report Evaluation Treasury Bond',
                href: '/report-securities/report-evaluation-treasury-bond',
                icon: FileText,
            },
            {
                title: 'Report Journal Securities',
                href: '/report-securities/report-journal-securities',
                icon: FileText,
            },
        ],
    },
    {
        title: 'Upload Data Files',
        icon: Folder,
        items: [
            {
                title: 'Simple interest',
                icon: Folder,
                items: [
                    {
                        title: 'Upload File',
                        href: '/upload-data-files/simple-interest/upload-file',
                        icon: FileText,
                    },
                    {
                        title: 'Upload Data',
                        href: '/upload-data-files/simple-interest/upload-data',
                        icon: FileText,
                    },
                    {
                        title: 'Daftar Menu Coa',
                        href: '/upload-data-files/simple-interest/daftar-menu-coa',
                        icon: FileText,
                    },
                ],
            },
            {
                title: 'Effective',
                icon: Folder,
                items: [
                    {
                        title: 'Upload File',
                        href: '/upload-data-files/effective/upload-file',
                        icon: FileText,
                    },
                    {
                        title: 'Upload Data',
                        href: '/upload-data-files/effective/upload-data',
                        icon: FileText,
                    },
                    {
                        title: 'Daftar Menu Coa',
                        href: '/upload-data-files/effective/daftar-menu-coa',
                        icon: FileText,
                    },
                ],
            },
            {
                title: 'Securities',
                icon: Folder,
                items: [
                    {
                        title: 'Upload Data Securities',
                        href: '/upload-data-files/securities/upload-data-securities',
                        icon: FileText,
                    },
                ],
            },
        ],
    },
];

// Komponen AppLogo yang menampilkan logo perusahaan
function AppLogo() {
    const { props }: any = usePage();
    const user = props.auth?.user;
    const companyName = user?.company_name || 'My Company';
    const initial = companyName.charAt(0).toUpperCase();
    const logo = user?.company_logo;
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center overflow-hidden rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                {logo ? (
                    <img src={`/storage/${logo}`} alt={companyName} className="size-full object-cover" />
                ) : (
                    <span className="text-lg font-bold text-white dark:text-black">{initial}</span>
                )}
            </div>
            {!isCollapsed && (
                <div className="ml-1 grid flex-1 text-left text-sm">
                    <span className="mb-0.5 truncate leading-tight font-semibold">{companyName}</span>
                </div>
            )}
        </>
    );
}

// Komponen untuk menangani item yang dapat memiliki sub-item (folder atau file)
function CollapsibleItem({ item, depth = 0 }: { item: any; depth?: number }) {
    const [isOpen, setIsOpen] = useState(false);
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';
    
    // Hitung padding berdasarkan kedalaman
    const padding = depth * 16;
    
    // Tentukan ukuran ikon berdasarkan kedalaman
    const iconSize = depth === 0 ? 16 : 14;
    
    // Jika item memiliki sub-item, maka ini adalah folder
    const isFolder = item.items && item.items.length > 0;
    
    // Jika sidebar diciutkan, kita tidak perlu menampilkan submenu
    if (isCollapsed) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                    {isFolder ? <Folder size={iconSize} /> : <item.icon size={iconSize} />}
                    <span>{item.title}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }
    
    // Jika ini adalah folder
    if (isFolder) {
        return (
            <>
                <SidebarMenuItem>
                    <SidebarMenuButton 
                        onClick={() => setIsOpen(!isOpen)} 
                        className="w-full justify-between"
                        style={{ paddingLeft: `${padding}px` }}
                    >
                        <div className="flex items-center">
                            {isOpen ? 
                                <FolderOpen className="mr-2" size={iconSize} /> : 
                                <item.icon className="mr-2" size={iconSize} />
                            }
                            <span>{item.title}</span>
                        </div>
                        {isOpen ? 
                            <ChevronDown size={iconSize - 2} /> : 
                            <ChevronRight size={iconSize - 2} />
                        }
                    </SidebarMenuButton>
                </SidebarMenuItem>
                
                {/* Sub-item dengan animasi slide dari samping */}
                <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    <div 
                        className={`transform transition-transform duration-300 ease-in-out ${
                            isOpen ? 'translate-x-0' : '-translate-x-4'
                        }`}
                    >
                        <SidebarMenu>
                            {item.items.map((subItem: NavItem) => (
                                <CollapsibleItem 
                                    key={subItem.title} 
                                    item={subItem} 
                                    depth={depth + 1} 
                                />
                            ))}
                        </SidebarMenu>
                    </div>
                </div>
            </>
        );
    }
    
    // Jika ini adalah file (item tanpa sub-item)
    return (
        <SidebarMenuItem>
            <SidebarMenuButton 
                asChild 
                tooltip={item.title}
                style={{ paddingLeft: `${padding}px` }}
            >
                <Link href={item.href} prefetch>
                    <item.icon size={iconSize} />
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

// Komponen CollapsibleGroup untuk menangani grup utama
function CollapsibleGroup({ group }: { group: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';
    
    // Ukuran ikon untuk grup utama (tetap besar)
    const iconSize = 21;
    
    // Jika sidebar diciutkan, kita tidak perlu menampilkan submenu
    if (isCollapsed) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={group.title}>
                    <group.icon size={iconSize} />
                    <span>{group.title}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }
    
    return (
        <>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="w-full justify-between"
                >
                    <div className="flex items-center">
                        {isOpen ? 
                            <FolderOpen className="mr-2" size={iconSize} /> : 
                            <group.icon className="mr-2" size={iconSize} />
                        }
                        <span>{group.title}</span>
                    </div>
                    {isOpen ? 
                        <ChevronDown size={iconSize - 2} /> : 
                        <ChevronRight size={iconSize - 2} />
                    }
                </SidebarMenuButton>
            </SidebarMenuItem>
            
            {/* Sub-item dengan animasi slide dari samping */}
            <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div 
                    className={`transform transition-transform duration-300 ease-in-out ${
                        isOpen ? 'translate-x-0' : '-translate-x-4'
                    }`}
                >
                    <SidebarMenu>
                        {group.items.map((item: NavItem) => (
                            <CollapsibleItem key={item.title} item={item} depth={1} />
                        ))}
                    </SidebarMenu>
                </div>
            </div>
        </>
    );
}

// Komponen utama AppSidebar
export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            
            <SidebarContent>
                <SidebarMenu>
                    {mainNavItems.map((group) => (
                        <CollapsibleGroup key={group.title} group={group} />
                    ))}
                </SidebarMenu>
            </SidebarContent>
            
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}