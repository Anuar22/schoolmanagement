import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ShieldCheck, ArrowRight, User } from 'lucide-react';

interface AuditItem {
    id: string;
    action: string;
    entity_type: string;
    entity_id: string;
    old_values: string | null;
    new_values: string | null;
    ip_address: string;
    created_at: string;
    user_name: string | null;
    user_email: string | null;
}

interface Props {
    logs: {
        data: AuditItem[];
        current_page: number;
        last_page: number;
    };
}

export default function AuditLogs({ logs }: Props) {
    const parseJson = (val: string | null) => {
        if (!val) return null;
        try {
            return JSON.parse(val);
        } catch {
            return val;
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>
                        Institutional Audit Trail
                    </h2>
                    <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                        Tamper-evident logs of continuous grade inputs, score adjustments, and financial collections
                    </p>
                </div>
            }
        >
            <Head title="Audit Logs" />

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    {logs.data.length === 0 ? (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                            No logged administrative actions recorded yet.
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                                    <th style={{ padding: '12px 20px' }}>Action & Target</th>
                                    <th style={{ padding: '12px 20px' }}>Actor</th>
                                    <th style={{ padding: '12px 20px' }}>Value Delta</th>
                                    <th style={{ padding: '12px 20px' }}>Origin IP</th>
                                    <th style={{ padding: '12px 20px', textAlign: 'right' }}>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.data.map((log) => {
                                    const oldVals = parseJson(log.old_values);
                                    const newVals = parseJson(log.new_values);

                                    return (
                                        <tr key={log.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                            <td style={{ padding: '12px 20px' }}>
                                                <span style={{
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    padding: '2px 8px',
                                                    borderRadius: '4px',
                                                    backgroundColor: log.action.includes('GRADE') ? '#eef2ff' : '#ecfdf5',
                                                    color: log.action.includes('GRADE') ? '#4338ca' : '#047857'
                                                }}>
                                                    {log.action}
                                                </span>
                                                <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px', fontFamily: 'monospace' }}>
                                                    {log.entity_type} #{log.entity_id.slice(0, 8)}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 20px' }}>
                                                <div style={{ fontWeight: 600, color: '#111827' }}>{log.user_name ?? 'System'}</div>
                                                <div style={{ fontSize: '11px', color: '#6b7280' }}>{log.user_email}</div>
                                            </td>
                                            <td style={{ padding: '12px 20px' }}>
                                                {oldVals ? (
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                                                        <span style={{ color: '#ef4444', textDecoration: 'line-through' }}>{JSON.stringify(oldVals)}</span>
                                                        <ArrowRight style={{ width: '12px', height: '12px', color: '#9ca3af' }} />
                                                        <span style={{ color: '#10b981', fontWeight: 600 }}>{JSON.stringify(newVals)}</span>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#10b981', fontWeight: 600, fontSize: '12px' }}>{JSON.stringify(newVals)}</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '12px 20px', fontFamily: 'monospace', fontSize: '12px', color: '#6b7280' }}>
                                                {log.ip_address}
                                            </td>
                                            <td style={{ padding: '12px 20px', textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}