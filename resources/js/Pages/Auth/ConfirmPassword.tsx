import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button, Input } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Conferma password" />

            <h1 className="mb-1 text-2xl font-semibold">Conferma password</h1>
            <p className="mb-6 text-sm text-default-500">
                Area protetta. Conferma la password per continuare.
            </p>

            <form onSubmit={submit} className="flex flex-col gap-4">
                <Input
                    type="password"
                    name="password"
                    label="Password"
                    autoComplete="current-password"
                    autoFocus
                    isRequired
                    value={data.password}
                    onValueChange={(v) => setData('password', v)}
                    isInvalid={!!errors.password}
                    errorMessage={errors.password}
                />

                <Button type="submit" color="primary" isLoading={processing}>
                    Conferma
                </Button>
            </form>
        </GuestLayout>
    );
}
