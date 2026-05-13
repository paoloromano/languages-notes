import GuestLayout from '@/Layouts/GuestLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button, Checkbox, Input } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const page = usePage<PageProps>();
    const pageErrors = page.props.errors ?? {};

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Accedi" />

            <h1 className="mb-1 text-2xl font-semibold">Accedi</h1>
            <p className="mb-6 text-sm text-default-500">Bentornato. Inserisci le tue credenziali.</p>

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
                    isInvalid={!!(errors.email || pageErrors.email)}
                    errorMessage={errors.email || pageErrors.email}
                />

                <Input
                    type="password"
                    name="password"
                    label="Password"
                    autoComplete="current-password"
                    isRequired
                    value={data.password}
                    onValueChange={(v) => setData('password', v)}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password}
                />

                <div className="flex items-center justify-between">
                    <Checkbox
                        size="sm"
                        isSelected={data.remember}
                        onValueChange={(v) => setData('remember', v)}
                    >
                        Ricordami
                    </Checkbox>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-primary hover:underline"
                        >
                            Password dimenticata?
                        </Link>
                    )}
                </div>

                <Button type="submit" color="primary" isLoading={processing}>
                    Accedi
                </Button>

                <p className="text-center text-sm text-default-500">
                    Non hai un account?{' '}
                    <Link href={route('register')} className="text-primary hover:underline">
                        Registrati
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
