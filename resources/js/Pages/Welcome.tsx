import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeToggle from '@/Components/ThemeToggle';
import { Head, Link } from '@inertiajs/react';
import { Button, Card, CardBody } from '@heroui/react';
import { PageProps } from '@/types';

export default function Welcome({
    auth,
    canLogin,
    canRegister,
    laravelVersion,
    phpVersion,
}: PageProps<{
    canLogin: boolean;
    canRegister: boolean;
    laravelVersion: string;
    phpVersion: string;
}>) {
    return (
        <>
            <Head title="Benvenuto" />
            <div className="min-h-screen bg-default-50">
                <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <ApplicationLogo className="h-8 w-8 fill-current text-primary" />
                        <span className="font-semibold">App Base</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {auth?.user ? (
                            <Button as={Link} href="/dashboard" color="primary" size="sm">
                                Dashboard
                            </Button>
                        ) : (
                            <>
                                {canLogin && (
                                    <Button
                                        as={Link}
                                        href={route('login')}
                                        variant="light"
                                        size="sm"
                                    >
                                        Accedi
                                    </Button>
                                )}
                                {canRegister && (
                                    <Button
                                        as={Link}
                                        href={route('register')}
                                        color="primary"
                                        size="sm"
                                    >
                                        Registrati
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </header>

                <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
                    <section className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                            App Base Laravel
                        </h1>
                        <p className="mt-4 text-lg text-default-600">
                            Core riutilizzabile: Laravel 12 + Inertia + React + HeroUI + Tailwind v4.
                            Auth, ruoli e area admin pronti.
                        </p>
                    </section>

                    <section className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardBody className="gap-2">
                                <h3 className="text-lg font-semibold">Autenticazione</h3>
                                <p className="text-sm text-default-500">
                                    Login, registrazione, recupero password, verifica email.
                                </p>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="gap-2">
                                <h3 className="text-lg font-semibold">Ruoli & permessi</h3>
                                <p className="text-sm text-default-500">
                                    Spatie Permission integrato, ruoli admin/user predefiniti.
                                </p>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody className="gap-2">
                                <h3 className="text-lg font-semibold">UI moderna</h3>
                                <p className="text-sm text-default-500">
                                    HeroUI + Tailwind v4 con dark mode persistente.
                                </p>
                            </CardBody>
                        </Card>
                    </section>
                </main>

                <footer className="mx-auto max-w-7xl px-4 py-8 text-center text-sm text-default-500 sm:px-6">
                    Laravel v{laravelVersion} · PHP v{phpVersion}
                </footer>
            </div>
        </>
    );
}
