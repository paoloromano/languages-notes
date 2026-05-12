import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@heroui/react';
import { ReactNode } from 'react';

type Color = 'primary' | 'danger' | 'warning' | 'success';

interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: ReactNode;
    body: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmColor?: Color;
    isLoading?: boolean;
    onConfirm: () => void;
}

export default function ConfirmDialog({
    isOpen,
    onOpenChange,
    title,
    body,
    confirmLabel = 'Conferma',
    cancelLabel = 'Annulla',
    confirmColor = 'danger',
    isLoading = false,
    onConfirm,
}: Props) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader>{title}</ModalHeader>
                        <ModalBody>
                            <div className="text-default-700">{body}</div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="flat"
                                onPress={onClose}
                                isDisabled={isLoading}
                            >
                                {cancelLabel}
                            </Button>
                            <Button
                                color={confirmColor}
                                onPress={onConfirm}
                                isLoading={isLoading}
                            >
                                {confirmLabel}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
