export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    role: 'admin' | 'super_admin' | 'teacher' | 'bursar' | string;
    tenant_id: string | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
    tenant?: {
        id: string;
        name: string;
        subdomain: string;
    } | null;
    flash?: {
        success?: string | null;
        error?: string | null;
    };
};