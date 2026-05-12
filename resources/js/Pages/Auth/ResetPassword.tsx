import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button, Input } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Reimposta password" />

            <h1 className="mb-1 text-2xl font-semibold">Reimposta password</h1>
            <p className="mb-6 text-sm text-default-500">Scegli una nuova password sicura.</p>

            <form onSubmit={submit} className="flex flex-col gap-4">
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

                <Input
                    type="password"
                    name="password"
                    label="Nuova password"
                    autoComplete="new-password"
                    autoFocus
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

                <Button type="submit" color="primary" isLoading={processing}>
                    Reimposta password
                </Button>
            </form>
        </GuestLayout>
    );
}
