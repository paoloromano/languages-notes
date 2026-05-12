import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import VocaboloForm, { LinguaOption } from './Partials/VocaboloForm';

interface Vocabolo {
    id: number;
    lingua_id: number;
    term: string;
    translation: string;
    note: string | null;
}

type EditProps = {
    vocabolo: Vocabolo;
    lingue: LinguaOption[];
};

export default function Edit({ vocabolo, lingue }: PageProps<EditProps>) {
    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">Modifica vocabolo</h1>
                    <Link
                        href={route('vocaboli.index', { lingua_id: vocabolo.lingua_id })}
                        className="text-sm text-default-500 hover:text-primary"
                    >
                        ← Torna alla rubrica
                    </Link>
                </div>
            }
        >
            <Head title={`Modifica · ${vocabolo.term}`} />

            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{vocabolo.term}</h2>
                    </CardHeader>
                    <CardBody>
                        <VocaboloForm
                            mode="edit"
                            action={route('vocaboli.update', vocabolo.id)}
                            cancelHref={route('vocaboli.index', {
                                lingua_id: vocabolo.lingua_id,
                            })}
                            lingue={lingue}
                            initial={{
                                lingua_id: String(vocabolo.lingua_id),
                                term: vocabolo.term,
                                translation: vocabolo.translation,
                                note: vocabolo.note ?? '',
                            }}
                        />
                    </CardBody>
                </Card>
            </div>
        </UserLayout>
    );
}
