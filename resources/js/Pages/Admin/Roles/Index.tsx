import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardBody, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';

interface RoleRow {
    id: number;
    name: string;
    guard_name: string;
    permissions_count: number;
    users_count: number;
}

type IndexProps = {
    roles: RoleRow[];
};

export default function AdminRolesIndex({ roles }: PageProps<IndexProps>) {
    return (
        <AdminLayout header={<h1 className="text-2xl font-semibold">Admin · Ruoli</h1>}>
            <Head title="Admin · Ruoli" />

            <Card className="mb-6">
                <CardBody className="text-sm text-default-600">
                    Elenco dei ruoli Spatie Permission definiti nell&apos;applicazione. La modifica dei ruoli
                    avviene tramite seeder o migrazioni; da qui puoi solo consultare l&apos;uso.
                </CardBody>
            </Card>

            <Table aria-label="Elenco ruoli" removeWrapper className="overflow-x-auto">
                <TableHeader>
                    <TableColumn>Ruolo</TableColumn>
                    <TableColumn>Guard</TableColumn>
                    <TableColumn>Permessi</TableColumn>
                    <TableColumn>Utenti</TableColumn>
                </TableHeader>
                <TableBody emptyContent="Nessun ruolo definito">
                    {roles.map((r) => (
                        <TableRow key={r.id}>
                            <TableCell className="font-medium">{r.name}</TableCell>
                            <TableCell>{r.guard_name}</TableCell>
                            <TableCell>{r.permissions_count}</TableCell>
                            <TableCell>{r.users_count}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <p className="mt-6 text-center text-sm text-default-500">
                <Link href="/admin" className="text-primary hover:underline">
                    Torna alla dashboard admin
                </Link>
            </p>
        </AdminLayout>
    );
}
