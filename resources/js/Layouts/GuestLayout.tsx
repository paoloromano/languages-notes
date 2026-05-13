import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Card, CardBody } from '@heroui/react';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function GuestLayout({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-default-50 px-4 py-10">
            <div className="absolute right-4 top-4">
                <ThemeToggle />
            </div>

            <Link href="/" className="mb-8 block transition-opacity hover:opacity-90">
                <ApplicationLogo variant="hero" />
            </Link>

            <Card className="w-full max-w-md">
                <CardBody className="px-6 py-8">{children}</CardBody>
            </Card>
        </div>
    );
}
