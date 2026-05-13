import { HTMLAttributes } from 'react';

type Variant = 'compact' | 'icon' | 'hero';

type Props = HTMLAttributes<HTMLDivElement> & {
    variant?: Variant;
};

export default function ApplicationLogo({
    className = '',
    variant = 'compact',
    ...props
}: Props) {
    const mark = (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary text-xs font-bold text-white shadow-sm">
            LN
        </div>
    );

    if (variant === 'hero') {
        return (
            <div
                className={`flex flex-col items-center gap-1 text-center ${className}`}
                {...props}
            >
                <div className="rounded-2xl bg-linear-to-br from-primary via-primary to-secondary px-10 py-8 shadow-lg ring-1 ring-black/5 dark:ring-white/10">
                    <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Languages Notes
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/85">By PRWeb</p>
                </div>
            </div>
        );
    }

    if (variant === 'icon') {
        return (
            <div className={`flex items-center ${className}`} {...props}>
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary text-[10px] font-bold text-white shadow-sm">
                    LN
                </div>
            </div>
        );
    }

    return (
        <div className={`flex min-w-0 items-center gap-2.5 ${className}`} {...props}>
            {mark}
            <div className="flex min-w-0 flex-col leading-tight">
                <span className="truncate font-semibold text-foreground">Languages Notes</span>
                <span className="truncate text-xs text-default-500">By PRWeb</span>
            </div>
        </div>
    );
}
