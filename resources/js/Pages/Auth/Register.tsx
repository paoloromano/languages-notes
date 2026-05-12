import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Input } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Registrati" />

            <h1 className="mb-1 text-2xl font-semibold">Crea account</h1>
            <p className="mb-6 text-sm text-default-500">Inizia a usare l'app in pochi secondi.</p>

            <form onSubmit={submit} className="flex flex-col gap-4">
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

                <Button type="submit" color="primary" isLoading={processing}>
                    Registrati
                </Button>

                <p className="text-center text-sm text-default-500">
                    Hai già un account?{' '}
                    <Link href={route('login')} className="text-primary hover:underline">
                        Accedi
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
