import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifica email" />

            <h1 className="mb-1 text-2xl font-semibold">Verifica email</h1>
            <p className="mb-4 text-sm text-default-500">
                Grazie per la registrazione! Prima di iniziare, conferma la tua email cliccando
                sul link che ti abbiamo inviato. Se non lo hai ricevuto, possiamo inviarne un altro.
            </p>

            {status === 'verification-link-sent' && (
                <div className="mb-4 rounded-medium bg-success-50 px-3 py-2 text-sm text-success-700">
                    Un nuovo link di verifica è stato inviato all'indirizzo email indicato.
                </div>
            )}

            <form onSubmit={submit} className="flex items-center justify-between gap-3">
                <Button type="submit" color="primary" isLoading={processing}>
                    Reinvia email di verifica
                </Button>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="text-sm text-default-600 hover:text-primary"
                >
                    Esci
                </Link>
            </form>
        </GuestLayout>
    );
}
