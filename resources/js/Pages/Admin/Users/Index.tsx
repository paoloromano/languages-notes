import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Button,
    Chip,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@heroui/react';

interface AdminUserRow {
    id: number;
    name: string;
    email: string;
    roles: string[];
    approved_at: string | null;
    created_at: string;
}

interface PaginatedUsers {
    data: AdminUserRow[];
    links: { url: string | null; label: string; active: boolean }[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

type IndexProps = {
    users: PaginatedUsers;
    filter: 'all' | 'pending' | 'approved';
};

export default function AdminUsersIndex({ users, filter }: PageProps<IndexProps>) {
    const { flash } = usePage<PageProps>().props;

    const setFilter = (stato: IndexProps['filter']) => {
        router.get(route('admin.users.index'), { stato: stato === 'all' ? undefined : stato }, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <AdminLayout header={<h1 className="text-2xl font-semibold">Admin · Utenti</h1>}>
            <Head title="Admin · Utenti" />

            {flash?.success ? (
                <div className="mb-4 rounded-medium bg-success-50 px-3 py-2 text-sm text-success-700">
                    {flash.success}
                </div>
            ) : null}

            <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-default-500">Filtro:</span>
                <Button
                    size="sm"
                    variant={filter === 'all' ? 'solid' : 'flat'}
                    color={filter === 'all' ? 'primary' : 'default'}
                    onPress={() => setFilter('all')}
                >
                    Tutti
                </Button>
                <Button
                    size="sm"
                    variant={filter === 'pending' ? 'solid' : 'flat'}
                    color={filter === 'pending' ? 'primary' : 'default'}
                    onPress={() => setFilter('pending')}
                >
                    In attesa
                </Button>
                <Button
                    size="sm"
                    variant={filter === 'approved' ? 'solid' : 'flat'}
                    color={filter === 'approved' ? 'primary' : 'default'}
                    onPress={() => setFilter('approved')}
                >
                    Approvati
                </Button>
            </div>

            <Table aria-label="Elenco utenti" removeWrapper className="overflow-x-auto">
                <TableHeader>
                    <TableColumn>Nome</TableColumn>
                    <TableColumn>Email</TableColumn>
                    <TableColumn>Ruoli</TableColumn>
                    <TableColumn>Stato</TableColumn>
                    <TableColumn align="end">Azioni</TableColumn>
                </TableHeader>
                <TableBody emptyContent="Nessun utente">
                    {users.data.map((u) => (
                        <TableRow key={u.id}>
                            <TableCell>{u.name}</TableCell>
                            <TableCell>{u.email}</TableCell>
                            <TableCell>
                                <div className="flex flex-wrap gap-1">
                                    {u.roles.map((r) => (
                                        <Chip key={r} size="sm" variant="flat">
                                            {r}
                                        </Chip>
                                    ))}
                                </div>
                            </TableCell>
                            <TableCell>
                                {u.approved_at ? (
                                    <Chip size="sm" color="success" variant="flat">
                                        Approvato
                                    </Chip>
                                ) : (
                                    <Chip size="sm" color="warning" variant="flat">
                                        In attesa
                                    </Chip>
                                )}
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    {!u.approved_at ? (
                                        <Button
                                            size="sm"
                                            color="primary"
                                            onPress={() =>
                                                router.post(route('admin.users.approve', u.id))
                                            }
                                        >
                                            Approva
                                        </Button>
                                    ) : null}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {users.meta.last_page > 1 ? (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        total={users.meta.last_page}
                        page={users.meta.current_page}
                        onChange={(page) =>
                            router.get(route('admin.users.index'), {
                                page,
                                ...(filter !== 'all' ? { stato: filter } : {}),
                            })
                        }
                        showControls
                        color="primary"
                    />
                </div>
            ) : null}

            <p className="mt-4 text-center text-sm text-default-500">
                <Link href="/admin" className="text-primary hover:underline">
                    Torna alla dashboard admin
                </Link>
            </p>
        </AdminLayout>
    );
}
