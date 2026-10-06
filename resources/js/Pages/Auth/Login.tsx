import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { PageProps } from '@/types';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword?: boolean;
}) {
    const { tenant } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleFillDemo = (roleEmail: string) => {
        setData({
            ...data,
            email: roleEmail,
            password: 'password123',
        });
    };

    return (
        <GuestLayout>
            <Head title="Log In - EduCore" />

            {/* Institution Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                    style={{
                        width: '48px',
                        height: '48px',
                        backgroundColor: '#4f46e5',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        marginBottom: '12px',
                    }}
                >
                    <GraduationCap style={{ width: '28px', height: '28px' }} />
                </div>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>
                    {tenant?.name ?? 'EduCore Institutional Portal'}
                </h1>
                <p style={{ fontSize: '13px', color: '#6b7280', margin: '4px 0 0 0' }}>
                    Sign in to your administrative or academic workspace
                </p>
            </div>

            {status && (
                <div
                    style={{
                        marginBottom: '16px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#059669',
                        backgroundColor: '#ecfdf5',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #a7f3d0',
                    }}
                >
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Institutional Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="staff@educore.test"
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Keep me signed in</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-indigo-600 hover:text-indigo-900 rounded-md focus:outline-none"
                        >
                            Forgot password?
                        </Link>
                    )}
                </div>

                <div className="mt-6">
                    <PrimaryButton className="w-full justify-center py-3" disabled={processing}>
                        {processing ? 'Authenticating...' : 'Sign In to Workspace'}
                    </PrimaryButton>
                </div>
            </form>

            {/* Fast Quick-Fill Switcher for Testing Roles */}
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <ShieldCheck style={{ width: '14px', height: '14px', color: '#6b7280' }} />
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                        Quick-Fill Test Accounts:
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => handleFillDemo('admin@educore.test')}
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#eef2ff',
                            color: '#4338ca',
                            border: '1px solid #c7d2fe',
                            cursor: 'pointer',
                        }}
                    >
                        Admin
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFillDemo('teacher@educore.test')}
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #e5e7eb',
                            cursor: 'pointer',
                        }}
                    >
                        Teacher
                    </button>
                    <button
                        type="button"
                        onClick={() => handleFillDemo('bursar@educore.test')}
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '4px 8px',
                            borderRadius: '6px',
                            backgroundColor: '#ecfdf5',
                            color: '#047857',
                            border: '1px solid #a7f3d0',
                            cursor: 'pointer',
                        }}
                    >
                        Bursar
                    </button>
                </div>
            </div>
        </GuestLayout>
    );
}