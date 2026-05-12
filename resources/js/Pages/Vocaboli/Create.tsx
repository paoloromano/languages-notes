import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import VocaboloForm, { LinguaOption } from './Partials/VocaboloForm';

type CreateProps = {
    lingue: LinguaOption[];
    preselectLinguaId: number | null;
};

export default function Create({
    lingue,
    preselectLinguaId,
}: PageProps<CreateProps>) {
    const initialLinguaId = preselectLinguaId
        ? String(preselectLinguaId)
        : lingue[0]?.id
          ? String(lingue[0].id)
          : '';

    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">Nuovo vocabolo</h1>
                    <Link
                        href={route('vocaboli.index')}
                        className="text-sm text-default-500 hover:text-primary"
                    >
                        ← Torna alla rubrica
                    </Link>
                </div>
            }
        >
            <Head title="Nuovo vocabolo" />

            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Aggiungi un vocabolo</h2>
                    </CardHeader>
                    <CardBody>
                        {lingue.length === 0 ? (
                            <p className="text-default-500">
                                Prima crea almeno una lingua in{' '}
                                <Link
                                    href={route('lingue.index')}
                                    className="text-primary underline"
                                >
                                    Lingue
                                </Link>
                                .
                            </p>
                        ) : (
                            <VocaboloForm
                                mode="create"
                                action={route('vocaboli.store')}
                                cancelHref={route('vocaboli.index')}
                                lingue={lingue}
                                initial={{ lingua_id: initialLinguaId }}
                            />
                        )}
                    </CardBody>
                </Card>
            </div>
        </UserLayout>
    );
}
