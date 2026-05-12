import { Link, useForm, usePage } from '@inertiajs/react';
import { Button, Input } from '@heroui/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const user = usePage<PageProps>().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <Input
                name="name"
                label="Nome"
                autoComplete="name"
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

            {mustVerifyEmail && user.email_verified_at == null && (
                <div className="rounded-medium bg-warning-50 px-3 py-2 text-sm text-warning-800">
                    L'indirizzo email non è verificato.{' '}
                    <Link
                        href={route('verification.send')}
                        method="post"
                        as="button"
                        className="underline hover:text-warning-900"
                    >
                        Reinvia link di verifica
                    </Link>
                    {status === 'verification-link-sent' && (
                        <p className="mt-1 text-success-700">
                            Nuovo link di verifica inviato.
                        </p>
                    )}
                </div>
            )}

            <div className="flex items-center gap-3">
                <Button type="submit" color="primary" isLoading={processing}>
                    Salva
                </Button>
                {recentlySuccessful && (
                    <span className="text-sm text-default-500">Salvato.</span>
                )}
            </div>
        </form>
    );
}
