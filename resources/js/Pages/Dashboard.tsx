import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Card, CardBody } from '@heroui/react';

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;

    return (
        <UserLayout
            header={<h1 className="text-2xl font-semibold">Dashboard</h1>}
        >
            <Head title="Dashboard" />

            <Card>
                <CardBody>
                    <p>Ciao, <strong>{auth.user.name}</strong>! Sei autenticato.</p>
                </CardBody>
            </Card>
        </UserLayout>
    );
}
