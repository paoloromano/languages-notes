import { useForm } from '@inertiajs/react';
import { Button, Input } from '@heroui/react';
import { FormEventHandler } from 'react';

export default function UpdatePasswordForm() {
    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errs) => {
                if (errs.password) reset('password', 'password_confirmation');
                if (errs.current_password) reset('current_password');
            },
        });
    };

    return (
        <form onSubmit={updatePassword} className="flex flex-col gap-4">
            <Input
                type="password"
                name="current_password"
                label="Password attuale"
                autoComplete="current-password"
                isRequired
                value={data.current_password}
                onValueChange={(v) => setData('current_password', v)}
                isInvalid={!!errors.current_password}
                errorMessage={errors.current_password}
            />

            <Input
                type="password"
                name="password"
                label="Nuova password"
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
