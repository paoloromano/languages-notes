import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Checkbox,
    Select,
    SelectItem,
} from '@heroui/react';
import { ChangeEvent, FormEventHandler } from 'react';

type LinguaOption = { id: number; name: string };

type ImportProps = {
    lingue: LinguaOption[];
    preselectLinguaId: number | null;
};

export default function Import({ lingue, preselectLinguaId }: PageProps<ImportProps>) {
    const initialLinguaId = preselectLinguaId
        ? String(preselectLinguaId)
        : lingue[0]?.id
          ? String(lingue[0].id)
          : '';

    const { data, setData, post, processing, errors, progress } = useForm<{
        lingua_id: string;
        file: File | null;
        skip_duplicates: boolean;
    }>({
        lingua_id: initialLinguaId,
        file: null,
        skip_duplicates: true,
    });

    const onFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('file', file);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('vocaboli.import'), {
            forceFormData: true,
        });
    };

    return (
        <UserLayout
            header={
                <div className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">Importa vocaboli</h1>
                    <Link
                        href={route('vocaboli.index')}
                        className="text-sm text-default-500 hover:text-primary"
                    >
                        ← Torna alla rubrica
                    </Link>
                </div>
            }
        >
            <Head title="Importa vocaboli" />

            <div className="mx-auto max-w-2xl">
                <Card>
                    <CardHeader>
                        <h2 className="text-lg font-semibold">Importa da CSV</h2>
                    </CardHeader>
                    <CardBody>
                        {lingue.length === 0 ? (
                            <p className="text-default-500">
                                Crea almeno una lingua prima di importare. Vai in{' '}
                                <Link
                                    href={route('lingue.index')}
                                    className="text-primary underline"
                                >
                                    Lingue
                                </Link>
                                .
                            </p>
                        ) : (
                            <form onSubmit={submit} className="flex flex-col gap-4">
                                <div className="rounded-medium bg-default-100 px-3 py-2 text-sm text-default-700">
                                    <p className="font-medium">Formato del file</p>
                                    <p>
                                        CSV con intestazioni{' '}
                                        <code className="font-mono">term,translation,note</code>
                                        . La colonna <code className="font-mono">note</code> è
                                        opzionale. Una eventuale colonna{' '}
                                        <code className="font-mono">lingua</code> nel file
                                        viene ignorata: tutte le righe vengono importate nella
                                        lingua scelta qui sotto.
                                    </p>
                                </div>

                                <Select
                                    label="Lingua di destinazione"
                                    isRequired
                                    selectedKeys={
                                        data.lingua_id ? new Set([data.lingua_id]) : new Set()
                                    }
                                    onSelectionChange={(keys) => {
                                        const value =
                                            Array.from(keys as Set<string>)[0] ?? '';
                                        setData('lingua_id', value);
                                    }}
                                    isInvalid={!!errors.lingua_id}
                                    errorMessage={errors.lingua_id}
                                >
                                    {lingue.map((l) => (
                                        <SelectItem key={String(l.id)}>{l.name}</SelectItem>
                                    ))}
                                </Select>

                                <div className="flex flex-col gap-1">
                                    <label
                                        htmlFor="file"
                                        className="text-sm font-medium text-default-700"
                                    >
                                        File CSV <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        id="file"
                                        type="file"
                                        accept=".csv,text/csv"
                                        onChange={onFile}
                                        className="block w-full text-sm file:mr-3 file:rounded-medium file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-primary-600"
                                    />
                                    {data.file && (
                                        <p className="text-xs text-default-500">
                                            {data.file.name} ·{' '}
                                            {(data.file.size / 1024).toFixed(1)} KB
                                        </p>
                                    )}
                                    {errors.file && (
                                        <p className="text-xs text-danger">{errors.file}</p>
                                    )}
                                </div>

                                <Checkbox
                                    isSelected={data.skip_duplicates}
                                    onValueChange={(v) => setData('skip_duplicates', v)}
                                >
                                    Salta i termini già presenti nella lingua selezionata
                                </Checkbox>

                                {progress && (
                                    <div className="h-2 w-full overflow-hidden rounded-full bg-default-200">
                                        <div
                                            className="h-full bg-primary transition-all"
                                            style={{ width: `${progress.percentage ?? 0}%` }}
                                        />
                                    </div>
                                )}

                                <div className="flex items-center gap-3">
                                    <Button
                                        type="submit"
                                        color="primary"
                                        isLoading={processing}
                                        isDisabled={!data.file || !data.lingua_id}
                                    >
                                        Importa
                                    </Button>
                                    <Button
                                        as={Link}
                                        href={route('vocaboli.index')}
                                        variant="flat"
                                    >
                                        Annulla
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardBody>
                </Card>
            </div>
        </UserLayout>
    );
}
