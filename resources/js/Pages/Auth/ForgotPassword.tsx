import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Input } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recupera password" />

            <h1 className="mb-1 text-2xl font-semibold">Recupera password</h1>
            <p className="mb-6 text-sm text-default-500">
                Inserisci la tua email per ricevere il link di reset.
            </p>

            {status && (
                <div className="mb-4 rounded-medium bg-success-50 px-3 py-2 text-sm text-success-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="flex flex-col gap-4">
                <Input
                    type="email"
                    name="email"
                    label="Email"
                    autoComplete="username"
                    autoFocus
                    isRequired
                    value={data.email}
                    onValueChange={(v) => setData('email', v)}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                />

                <Button type="submit" color="primary" isLoading={processing}>
                    Invia link reset
                </Button>

                <p className="text-center text-sm text-default-500">
                    <Link href={route('login')} className="text-primary hover:underline">
                        Torna all'accesso
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
