import { Link, useForm } from '@inertiajs/react';
import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react';
import { FormEventHandler } from 'react';

export interface LinguaOption {
    id: number;
    name: string;
}

export interface VocaboloFormData {
    lingua_id: string;
    term: string;
    translation: string;
    note: string;
}

interface Props {
    lingue: LinguaOption[];
    initial?: Partial<VocaboloFormData>;
    mode: 'create' | 'edit';
    action: string;
    cancelHref: string;
}

export default function VocaboloForm({
    lingue,
    initial,
    mode,
    action,
    cancelHref,
}: Props) {
    const { data, setData, post, put, processing, errors } = useForm<VocaboloFormData>({
        lingua_id: initial?.lingua_id ?? (lingue[0]?.id ? String(lingue[0].id) : ''),
        term: initial?.term ?? '',
        translation: initial?.translation ?? '',
        note: initial?.note ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (mode === 'create') {
            post(action);
        } else {
            put(action);
        }
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-4">
            <Select
                label="Lingua"
                isRequired
                selectedKeys={data.lingua_id ? new Set([data.lingua_id]) : new Set()}
                onSelectionChange={(keys) => {
                    const value = Array.from(keys as Set<string>)[0] ?? '';
                    setData('lingua_id', value);
                }}
                isInvalid={!!errors.lingua_id}
                errorMessage={errors.lingua_id}
                isDisabled={lingue.length === 0}
            >
                {lingue.map((l) => (
                    <SelectItem key={String(l.id)}>{l.name}</SelectItem>
                ))}
            </Select>

            <Input
                name="term"
                label="Termine"
                placeholder="parola nella lingua scelta"
                isRequired
                value={data.term}
                onValueChange={(v) => setData('term', v)}
                isInvalid={!!errors.term}
                errorMessage={errors.term}
            />

            <Input
                name="translation"
                label="Traduzione (italiano)"
                placeholder="traduzione in italiano"
                isRequired
                value={data.translation}
                onValueChange={(v) => setData('translation', v)}
                isInvalid={!!errors.translation}
                errorMessage={errors.translation}
            />

            <Textarea
                name="note"
                label="Note"
                placeholder="Esempi d'uso, sinonimi, contesto…"
                minRows={3}
                value={data.note}
                onValueChange={(v) => setData('note', v)}
                isInvalid={!!errors.note}
                errorMessage={errors.note}
            />

            <div className="flex items-center gap-3">
                <Button
                    type="submit"
                    color="primary"
                    isLoading={processing}
                    isDisabled={lingue.length === 0}
                >
                    {mode === 'create' ? 'Aggiungi' : 'Salva'}
                </Button>
                <Button as={Link} href={cancelHref} variant="flat">
                    Annulla
                </Button>
            </div>
        </form>
    );
}
