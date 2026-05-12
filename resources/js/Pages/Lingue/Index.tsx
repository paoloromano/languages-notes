import ConfirmDialog from '@/Components/ConfirmDialog';
import UserLayout from '@/Layouts/UserLayout';
import { PageProps } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Button,
    Chip,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from '@heroui/react';
import { FormEventHandler, useEffect, useState } from 'react';

interface Lingua {
    id: number;
    name: string;
    vocaboli_count: number;
}

type IndexProps = {
    lingue: Lingua[];
};

export default function Index({ lingue }: PageProps<IndexProps>) {
    const { flash } = usePage<PageProps>().props;
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [editing, setEditing] = useState<Lingua | null>(null);
    const [toDelete, setToDelete] = useState<Lingua | null>(null);
    const [deleting, setDeleting] = useState(false);
    const deleteDialog = useDisclosure();

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm<{ name: string }>({ name: '' });

    useEffect(() => {
        if (!isOpen) {
            reset();
            clearErrors();
            setEditing(null);
        }
    }, [isOpen, reset, clearErrors]);

    const openCreate = () => {
        setEditing(null);
        reset();
        clearErrors();
        onOpen();
    };

    const openEdit = (lingua: Lingua) => {
        setEditing(lingua);
        setData('name', lingua.name);
        clearErrors();
        onOpen();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (editing) {
            put(route('lingue.update', editing.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('lingue.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    const askDelete = (l: Lingua) => {
        setToDelete(l);
        deleteDialog.onOpen();
    };

    const confirmDelete = () => {
        if (!toDelete) return;
        setDeleting(true);
        router.delete(route('lingue.destroy', toDelete.id), {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setToDelete(null);
                deleteDialog.onClose();
            },
        });
    };

    return (
        <UserLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold">Lingue</h1>
                    <Button color="primary" onPress={openCreate}>
                        Nuova lingua
                    </Button>
                </div>
            }
        >
            <Head title="Lingue" />

            {flash.success && (
                <div className="mb-4 rounded-medium bg-success-50 px-3 py-2 text-sm text-success-800">
                    {flash.success}
                </div>
            )}

            <Table aria-label="Elenco lingue">
                <TableHeader>
                    <TableColumn>Nome</TableColumn>
                    <TableColumn>Vocaboli</TableColumn>
                    <TableColumn align="end">Azioni</TableColumn>
                </TableHeader>
                <TableBody
                    items={lingue}
                    emptyContent="Nessuna lingua. Creane una per iniziare ad aggiungere vocaboli."
                >
                    {(l) => (
                        <TableRow key={l.id}>
                            <TableCell className="font-medium">{l.name}</TableCell>
                            <TableCell>
                                <Chip size="sm" variant="flat">
                                    {l.vocaboli_count}
                                </Chip>
                            </TableCell>
                            <TableCell>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        size="sm"
                                        variant="flat"
                                        onPress={() => openEdit(l)}
                                    >
                                        Rinomina
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="danger"
                                        variant="light"
                                        onPress={() => askDelete(l)}
                                    >
                                        Elimina
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onOpenChange={deleteDialog.onOpenChange}
                title="Elimina lingua"
                body={
                    toDelete ? (
                        <div className="space-y-2">
                            <p>
                                Vuoi davvero eliminare la lingua{' '}
                                <strong>“{toDelete.name}”</strong>?
                            </p>
                            {toDelete.vocaboli_count > 0 && (
                                <p className="rounded-medium bg-danger-50 px-3 py-2 text-sm text-danger-800">
                                    Verranno cancellati anche{' '}
                                    <strong>{toDelete.vocaboli_count}</strong>{' '}
                                    {toDelete.vocaboli_count === 1
                                        ? 'vocabolo associato'
                                        : 'vocaboli associati'}
                                    . L'operazione non è reversibile.
                                </p>
                            )}
                        </div>
                    ) : null
                }
                confirmLabel="Elimina"
                isLoading={deleting}
                onConfirm={confirmDelete}
            />

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <ModalContent>
                    <form onSubmit={submit}>
                        <ModalHeader>
                            {editing ? 'Rinomina lingua' : 'Nuova lingua'}
                        </ModalHeader>
                        <ModalBody>
                            <Input
                                autoFocus
                                label="Nome"
                                placeholder="es. Inglese, Spagnolo, Tedesco…"
                                value={data.name}
                                onValueChange={(v) => setData('name', v)}
                                isInvalid={!!errors.name}
                                errorMessage={errors.name}
                                isRequired
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="flat" onPress={onClose} type="button">
                                Annulla
                            </Button>
                            <Button color="primary" type="submit" isLoading={processing}>
                                {editing ? 'Salva' : 'Aggiungi'}
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </UserLayout>
    );
}
