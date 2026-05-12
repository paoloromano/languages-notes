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
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from '@heroui/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

interface NavItem {
    label: string;
    href: string;
    routeName?: string;
}

const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', routeName: 'dashboard' },
    { label: 'Vocaboli', href: '/vocaboli', routeName: 'vocaboli.index' },
    { label: 'Lingue', href: '/lingue', routeName: 'lingue.index' },
];

interface Props {
    header?: ReactNode;
}

export default function UserLayout({ children, header }: PropsWithChildren<Props>) {
    const { auth } = usePage<PageProps>().props;
    const [menuOpen, setMenuOpen] = useState(false);
    const isAdmin = auth.user.roles.includes('admin');

    const initials = auth.user.name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="min-h-screen bg-default-50">
            <Navbar
                isBordered
                isMenuOpen={menuOpen}
                onMenuOpenChange={setMenuOpen}
                maxWidth="xl"
            >
                <NavbarContent className="sm:hidden" justify="start">
                    <NavbarMenuToggle aria-label={menuOpen ? 'Chiudi menu' : 'Apri menu'} />
                </NavbarContent>

                <NavbarBrand>
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <ApplicationLogo className="h-8 w-8 fill-current text-primary" />
                        <span className="font-semibold">App Base</span>
                    </Link>
                </NavbarBrand>

                <NavbarContent className="hidden gap-4 sm:flex" justify="center">
                    {navItems.map((item) => (
                        <NavbarItem key={item.href}>
                            <Link
                                href={item.href}
                                className="text-default-700 hover:text-primary"
                            >
                                {item.label}
                            </Link>
                        </NavbarItem>
                    ))}
                </NavbarContent>

                <NavbarContent justify="end">
                    <NavbarItem>
                        <ThemeToggle />
                    </NavbarItem>
                    <NavbarItem>
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
                                <DropdownItem
                                    key="profile"
                                    onPress={() => router.visit('/profile')}
                                >
                                    Profilo
                                </DropdownItem>
                                {isAdmin ? (
                                    <DropdownItem
                                        key="admin"
                                        onPress={() => router.visit('/admin')}
                                    >
                                        Area Admin
                                    </DropdownItem>
                                ) : null}
                                <DropdownItem
                                    key="logout"
                                    color="danger"
                                    onPress={() => router.post('/logout')}
                                >
                                    Esci
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>
                </NavbarContent>

                <NavbarMenu>
                    {navItems.map((item) => (
                        <NavbarMenuItem key={item.href}>
                            <Link href={item.href} className="w-full">
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    ))}
                    {isAdmin ? (
                        <NavbarMenuItem>
                            <Link href="/admin" className="w-full">
                                Area Admin
                            </Link>
                        </NavbarMenuItem>
                    ) : null}
                </NavbarMenu>
            </Navbar>

            {header ? (
                <header className="border-b border-divider bg-content1">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            ) : null}

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
    );
}
