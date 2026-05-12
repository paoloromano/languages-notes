import ConfirmDialog from '@/Components/ConfirmDialog';
import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Button,
    Card,
    CardBody,
    Chip,
    Input,
    Pagination,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from '@heroui/react';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

interface Vocabolo {
    id: number;
    lingua_id: number;
    term: string;
    translation: string;
    note: string | null;
}

interface Lingua {
    id: number;
    name: string;
    vocaboli_count: number;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

type IndexProps = {
    vocaboli: Paginated<Vocabolo>;
    lingue: Lingua[];
    availableLetters: string[];
    filters: { q: string; lingua_id: number | null; letter: string };
};

export default function Index({
    vocaboli,
    lingue,
    availableLetters,
    filters,
}: PageProps<IndexProps>) {
    const { flash } = usePage<PageProps>().props;
    const [q, setQ] = useState(filters.q ?? '');
    const [toDelete, setToDelete] = useState<Vocabolo | null>(null);
    const [deleting, setDeleting] = useState(false);
    const deleteDialog = useDisclosure();

    const availableSet = useMemo(
        () => new Set(availableLetters),
        [availableLetters],
    );

    useEffect(() => {
        setQ(filters.q ?? '');
    }, [filters.q]);

    const visitWith = (params: Record<string, string | number | undefined>) => {
        router.get(route('vocaboli.index'), params, {
            preserveState: true,
            replace: true,
        });
    };

    const baseParams = (extra: Record<string, string | number | undefined> = {}) => ({
        q: filters.q || undefined,
        lingua_id: filters.lingua_id ?? undefined,
        letter: filters.letter || undefined,
        ...extra,
    });

    const submitSearch: FormEventHandler = (e) => {
        e.preventDefault();
        visitWith(baseParams({ q: q || undefined, page: undefined }));
    };

    const clearSearch = () => {
        setQ('');
        visitWith(baseParams({ q: undefined, page: undefined }));
    };

    const changeLingua = (id: number) => {
        if (id === filters.lingua_id) return;
        // Cambiare lingua resetta la lettera (le lettere disponibili
        // dipendono dalla lingua attiva).
        visitWith({
            q: filters.q || undefined,
            lingua_id: id,
        });
    };

    const changeLetter = (letter: string) => {
        if (letter === filters.letter) return;
        visitWith(baseParams({ letter: letter || undefined, page: undefined }));
    };

    const goToPage = (page: number) => {
        visitWith(baseParams({ page }));
    };

    const askDelete = (v: Vocabolo) => {
        setToDelete(v);
        deleteDialog.onOpen();
    };

    const confirmDelete = () => {
        if (!toDelete) return;
        setDeleting(true);
        router.delete(route('vocaboli.destroy', toDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setToDelete(null);
                deleteDialog.onClose();
            },
        });
    };

    const noLingue = lingue.length === 0;

    return (
        <UserLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">Vocaboli</h1>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            as={Link}
                            href={route('lingue.index')}
                            variant="flat"
                        >
                            Gestisci lingue
                        </Button>
                        <Button
                            as="a"
                            href={route('vocaboli.export', {
                                lingua_id: filters.lingua_id ?? undefined,
                                letter: filters.letter || undefined,
                                q: filters.q || undefined,
                            })}
                            variant="flat"
                            isDisabled={noLingue || vocaboli.total === 0}
                        >
                            Esporta CSV
                        </Button>
                        <Button
                            as={Link}
                            href={
                                filters.lingua_id
                                    ? route('vocaboli.import.form', {
                                          lingua_id: filters.lingua_id,
                                      })
                                    : route('vocaboli.import.form')
                            }
                            variant="flat"
                            isDisabled={noLingue}
                        >
                            Importa CSV
                        </Button>
                        <Button
                            as={Link}
                            href={
                                filters.lingua_id
                                    ? route('vocaboli.create', { lingua_id: filters.lingua_id })
                                    : route('vocaboli.create')
                            }
                            color="primary"
                            isDisabled={noLingue}
                        >
                            Nuovo vocabolo
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title="Vocaboli" />

            {flash.success && (
                <div className="mb-4 rounded-medium bg-success-50 px-3 py-2 text-sm text-success-800">
                    {flash.success}
                </div>
            )}

            {noLingue ? (
                <Card>
                    <CardBody className="flex flex-col items-start gap-3 py-8">
                        <h2 className="text-lg font-semibold">
                            Nessuna lingua configurata
                        </h2>
                        <p className="text-default-500">
                            Per aggiungere vocaboli devi prima creare almeno una lingua
                            (es. Inglese, Spagnolo…).
                        </p>
                        <Button
                            as={Link}
                            href={route('lingue.index')}
                            color="primary"
                        >
                            Crea la tua prima lingua
                        </Button>
                    </CardBody>
                </Card>
            ) : (
                <>
                    <div
                        role="toolbar"
                        aria-label="Filtra per lingua"
                        className="mb-3 flex flex-wrap gap-2"
                    >
                        {lingue.map((l) => {
                            const active = l.id === filters.lingua_id;
                            return (
                                <Button
                                    key={l.id}
                                    size="sm"
                                    color={active ? 'primary' : 'default'}
                                    variant={active ? 'solid' : 'flat'}
                                    onPress={() => changeLingua(l.id)}
                                    endContent={
                                        <Chip
                                            size="sm"
                                            variant={active ? 'solid' : 'flat'}
                                            color={active ? 'primary' : 'default'}
                                            classNames={{
                                                base: active
                                                    ? 'bg-primary-700 text-white'
                                                    : '',
                                            }}
                                        >
                                            {l.vocaboli_count}
                                        </Chip>
                                    }
                                >
                                    {l.name}
                                </Button>
                            );
                        })}
                    </div>

                    <div
                        role="toolbar"
                        aria-label="Filtra per lettera iniziale"
                        className="mb-4 flex flex-wrap gap-1"
                    >
                        <Button
                            size="sm"
                            variant={filters.letter === '' ? 'solid' : 'flat'}
                            color={filters.letter === '' ? 'primary' : 'default'}
                            onPress={() => changeLetter('')}
                        >
                            Tutte
                        </Button>
                        {ALPHABET.map((letter) => {
                            const enabled = availableSet.has(letter);
                            const active = filters.letter === letter;
                            return (
                                <Button
                                    key={letter}
                                    size="sm"
                                    isIconOnly
                                    isDisabled={!enabled && !active}
                                    variant={active ? 'solid' : 'flat'}
                                    color={active ? 'primary' : 'default'}
                                    onPress={() => changeLetter(letter)}
                                    aria-label={`Filtra per lettera ${letter}`}
                                    className={
                                        !enabled && !active
                                            ? 'opacity-40'
                                            : undefined
                                    }
                                >
                                    {letter}
                                </Button>
                            );
                        })}
                    </div>

                    <form
                        onSubmit={submitSearch}
                        className="mb-4 flex flex-wrap items-center gap-2"
                    >
                        <Input
                            aria-label="Cerca"
                            placeholder="Cerca in termine, traduzione o note…"
                            value={q}
                            onValueChange={setQ}
                            className="max-w-md"
                        />
                        <Button type="submit" color="primary" variant="flat">
                            Cerca
                        </Button>
                        {filters.q ? (
                            <Button type="button" variant="light" onPress={clearSearch}>
                                Reset
                            </Button>
                        ) : null}
                        <span className="ml-auto text-sm text-default-500">
                            {vocaboli.total}{' '}
                            {vocaboli.total === 1 ? 'vocabolo' : 'vocaboli'}
                        </span>
                    </form>

                    <Table aria-label="Elenco vocaboli">
                        <TableHeader>
                            <TableColumn>Termine</TableColumn>
                            <TableColumn>Traduzione</TableColumn>
                            <TableColumn>Note</TableColumn>
                            <TableColumn align="end">Azioni</TableColumn>
                        </TableHeader>
                        <TableBody
                            items={vocaboli.data}
                            emptyContent={
                                filters.q || filters.letter
                                    ? 'Nessun risultato per i filtri attivi.'
                                    : 'Nessun vocabolo in questa lingua. Aggiungi il primo!'
                            }
                        >
                            {(v) => (
                                <TableRow key={v.id}>
                                    <TableCell className="font-medium">{v.term}</TableCell>
                                    <TableCell>{v.translation}</TableCell>
                                    <TableCell className="max-w-sm truncate text-default-500">
                                        {v.note ?? '—'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                as={Link}
                                                href={route('vocaboli.edit', v.id)}
                                                size="sm"
                                                variant="flat"
                                            >
                                                Modifica
                                            </Button>
                                            <Button
                                                size="sm"
                                                color="danger"
                                                variant="light"
                                                onPress={() => askDelete(v)}
                                            >
                                                Elimina
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {vocaboli.last_page > 1 && (
                        <div className="mt-4 flex justify-center">
                            <Pagination
                                total={vocaboli.last_page}
                                page={vocaboli.current_page}
                                onChange={goToPage}
                                showControls
                            />
                        </div>
                    )}
                </>
            )}

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onOpenChange={deleteDialog.onOpenChange}
                title="Elimina vocabolo"
                body={
                    toDelete ? (
                        <p>
                            Vuoi davvero eliminare{' '}
                            <strong>“{toDelete.term}”</strong>? L'operazione non è
                            reversibile.
                        </p>
                    ) : null
                }
                confirmLabel="Elimina"
                isLoading={deleting}
                onConfirm={confirmDelete}
            />
        </UserLayout>
    );
}
