import AdminLayout from '@/Layouts/AdminLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Input, Select, SelectItem } from '@heroui/react';
import { FormEventHandler } from 'react';

type CreateProps = {
    roles: string[];
};

export default function AdminUsersCreate({ roles }: PageProps<CreateProps>) {
    const defaultRole = roles.includes('user') ? 'user' : (roles[0] ?? 'user');

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: defaultRole,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AdminLayout header={<h1 className="text-2xl font-semibold">Admin · Nuovo utente</h1>}>
            <Head title="Admin · Nuovo utente" />

            <p className="mb-6 max-w-lg text-sm text-default-600">
                L&apos;utente viene creato già approvato e con email verificata, così può accedere subito con la
                password impostata qui.
            </p>

            <form onSubmit={submit} className="mx-auto flex max-w-lg flex-col gap-4">
                <Input
                    name="name"
                    label="Nome"
                    autoComplete="name"
                    autoFocus
                    isRequired
                    value={data.name}
                    onValueChange={(v) => setData('name', v)}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                />

                <Input
                    type="email"
                    name="email"
                    label="Email"
                    autoComplete="username"
                    isRequired
                    value={data.email}
                    onValueChange={(v) => setData('email', v)}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                />

                <Select
                    label="Ruolo"
                    selectedKeys={new Set([data.role])}
                    onSelectionChange={(keys) => {
                        const v = Array.from(keys)[0];
                        if (typeof v === 'string') {
                            setData('role', v);
                        }
                    }}
                    isInvalid={!!errors.role}
                    errorMessage={errors.role}
                    disallowEmptySelection
                >
                    {roles.map((r) => (
                        <SelectItem key={r}>{r}</SelectItem>
                    ))}
                </Select>

                <Input
                    type="password"
                    name="password"
                    label="Password"
                    autoComplete="new-password"
                    isRequired
                    value={data.password}
                    onValueChange={(v) => setData('password', v)}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password}
                />

                <Input
                    type="password"
                    name="password_confirmation"
                    label="Conferma password"
                    autoComplete="new-password"
                    isRequired
                    value={data.password_confirmation}
                    onValueChange={(v) => setData('password_confirmation', v)}
                    isInvalid={!!errors.password_confirmation}
                    errorMessage={errors.password_confirmation}
                />

                <div className="flex flex-wrap gap-2 pt-2">
                    <Button type="submit" color="primary" isLoading={processing}>
                        Crea utente
                    </Button>
                    <Button as={Link} href={route('admin.users.index')} variant="flat">
                        Annulla
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
