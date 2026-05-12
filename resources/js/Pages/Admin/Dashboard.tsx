import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardBody, CardHeader } from '@heroui/react';

interface Stats {
    users_total: number;
    users_admin: number;
    users_user: number;
}

export default function AdminDashboard({ stats }: PageProps<{ stats: Stats }>) {
    return (
        <AdminLayout
            header={<h1 className="text-2xl font-semibold">Admin · Dashboard</h1>}
        >
            <Head title="Admin · Dashboard" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="text-default-500">Utenti totali</CardHeader>
                    <CardBody>
                        <p className="text-3xl font-bold">{stats.users_total}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className="text-default-500">Amministratori</CardHeader>
                    <CardBody>
                        <p className="text-3xl font-bold">{stats.users_admin}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className="text-default-500">Utenti standard</CardHeader>
                    <CardBody>
                        <p className="text-3xl font-bold">{stats.users_user}</p>
                    </CardBody>
                </Card>
            </div>
        </AdminLayout>
    );
}
