import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { PageProps } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
} from '@heroui/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

interface AdminNavItem {
    label: string;
    href: string;
    icon: ReactNode;
}

const adminNav: AdminNavItem[] = [
    {
        label: 'Dashboard',
        href: '/admin',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M11.47 3.84a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.06l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 0 0 1.061 1.06l8.69-8.69Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
        ),
    },
    {
        label: 'Utenti',
        href: '/admin/users',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
            </svg>
        ),
    },
    {
        label: 'Ruoli',
        href: '/admin/roles',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
            </svg>
        ),
    },
];

interface Props {
    header?: ReactNode;
}

export default function AdminLayout({ children, header }: PropsWithChildren<Props>) {
    const { props, url } = usePage<PageProps>();
    const auth = props.auth;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const currentPath = url || (typeof window !== 'undefined' ? window.location.pathname : '');

    const initials = auth.user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    const isActive = (href: string) =>
        href === '/admin' ? currentPath === '/admin' : currentPath.startsWith(href);

    return (
        <div className="flex min-h-screen bg-default-50">
            {sidebarOpen ? (
                <div
                    className="fixed inset-0 z-30 bg-black/40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            ) : null}

            <aside
                className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-divider bg-content1 transition-transform lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center gap-2 border-b border-divider px-4">
                    <ApplicationLogo variant="icon" />
                    <span className="font-semibold">Admin</span>
                </div>
                <nav className="flex flex-col gap-1 p-3">
                    {adminNav.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-medium px-3 py-2 text-sm transition-colors ${
                                isActive(item.href)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-default-700 hover:bg-default-100'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-divider bg-content1 px-4">
                    <Button
                        isIconOnly
                        variant="light"
                        className="lg:hidden"
                        aria-label="Apri sidebar"
                        onPress={() => setSidebarOpen(true)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                            <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                        </svg>
                    </Button>

                    <div className="flex flex-1 items-center justify-end gap-2">
                        <Link href="/dashboard" className="text-sm text-default-600 hover:text-primary">
                            Vai al sito
                        </Link>
                        <ThemeToggle />
                        <Dropdown placement="bottom-end">
                            <DropdownTrigger>
                                <Avatar
                                    as="button"
                                    isBordered
                                    size="sm"
                                    name={initials}
                                    aria-label="Menu utente"
                                />
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Azioni utente" variant="flat">
                                <DropdownItem key="profile-info" isReadOnly className="opacity-100">
                                    <p className="font-semibold">{auth.user.name}</p>
                                    <p className="text-xs text-default-500">{auth.user.email}</p>
                                </DropdownItem>
                                <DropdownItem key="profile" onPress={() => router.visit('/profile')}>
                                    Profilo
                                </DropdownItem>
                                <DropdownItem
                                    key="logout"
                                    color="danger"
                                    onPress={() => router.post('/logout')}
                                >
                                    Esci
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                </header>

                {header ? (
                    <div className="border-b border-divider bg-content1 px-4 py-6 sm:px-6">{header}</div>
                ) : null}

                <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
            </div>
        </div>
    );
}
