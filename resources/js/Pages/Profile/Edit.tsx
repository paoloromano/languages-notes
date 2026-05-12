import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <UserLayout header={<h1 className="text-2xl font-semibold">Profilo</h1>}>
            <Head title="Profilo" />

            <div className="mx-auto flex max-w-3xl flex-col gap-6">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Informazioni profilo</h2>
                    </CardHeader>
                    <CardBody>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Aggiorna password</h2>
                    </CardHeader>
                    <CardBody>
                        <UpdatePasswordForm />
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold text-danger">Elimina account</h2>
                    </CardHeader>
                    <CardBody>
                        <DeleteUserForm />
                    </CardBody>
                </Card>
            </div>
        </UserLayout>
    );
}
