import { useForm } from '@inertiajs/react';
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from '@heroui/react';
import { FormEventHandler } from 'react';

export default function DeleteUserForm() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({ password: '' });

    const close = () => {
        onClose();
        clearErrors();
        reset();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => close(),
            onFinish: () => reset(),
        });
    };

    return (
        <div className="flex flex-col gap-4">
            <p className="text-sm text-default-500">
                Una volta eliminato l'account, tutti i dati saranno cancellati permanentemente.
                Scarica le informazioni che desideri conservare prima di procedere.
            </p>

            <div>
                <Button color="danger" onPress={onOpen}>
                    Elimina account
                </Button>
            </div>

            <Modal isOpen={isOpen} onClose={close} placement="center">
                <ModalContent>
                    <form onSubmit={submit}>
                        <ModalHeader>Confermi l'eliminazione?</ModalHeader>
                        <ModalBody>
                            <p className="text-sm text-default-500">
                                Tutti i dati associati all'account saranno cancellati
                                permanentemente. Inserisci la password per confermare.
                            </p>
                            <Input
                                type="password"
                                name="password"
                                label="Password"
                                autoFocus
                                isRequired
                                value={data.password}
                                onValueChange={(v) => setData('password', v)}
                                isInvalid={!!errors.password}
                                errorMessage={errors.password}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={close} type="button">
                                Annulla
                            </Button>
                            <Button color="danger" type="submit" isLoading={processing}>
                                Elimina account
                            </Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </div>
    );
}
