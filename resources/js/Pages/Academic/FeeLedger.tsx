import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { DollarSign, Wallet, AlertCircle, CheckCircle2, PlusCircle, X } from 'lucide-react';

interface Invoice {
    id: string;
    invoice_number: string;
    student_name: string;
    admission_number: string;
    class_name: string;
    total_amount: number;
    paid_amount: number;
    balance: number;
    status: 'PAID' | 'PARTIAL' | 'UNPAID';
    due_date: string;
}

interface Props {
    term: { name: string } | null;
    metrics: {
        total_invoiced: number;
        total_collected: number;
        total_outstanding: number;
        collection_rate: number;
    };
    invoices: Invoice[];
}

export default function FeeLedger({ term, metrics, invoices }: Props) {
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
    const [refCode, setRefCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePaymentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedInvoice || !amount) return;

        setIsSubmitting(true);
        router.post(
            route('fees.payment'),
            {
                invoice_id: selectedInvoice.id,
                amount: Number(amount),
                payment_method: paymentMethod,
                reference_code: refCode,
            },
            {
                onSuccess: () => {
                    setSelectedInvoice(null);
                    setAmount('');
                    setRefCode('');
                },
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', margin: 0 }}>
                            Fee Collection & Revenue Ledger
                        </h2>
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 0 0' }}>
                            {term?.name ?? 'Active Term'} — Realtime Receivables & Reconciliation
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Fee Management" />

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Metrics Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    
                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Total Invoiced</span>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginTop: '4px' }}>
                                TZS {metrics.total_invoiced.toLocaleString()}
                            </div>
                        </div>
                        <div style={{ width: '44px', height: '44px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wallet style={{ width: '20px', height: '20px' }} />
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Collected Funds</span>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
                                TZS {metrics.total_collected.toLocaleString()}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#059669' }}>{metrics.collection_rate}% Collected</span>
                        </div>
                        <div style={{ width: '44px', height: '44px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CheckCircle2 style={{ width: '20px', height: '20px' }} />
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>Outstanding Receivables</span>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>
                                TZS {metrics.total_outstanding.toLocaleString()}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#dc2626' }}>Pending Balance</span>
                        </div>
                        <div style={{ width: '44px', height: '44px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AlertCircle style={{ width: '20px', height: '20px' }} />
                        </div>
                    </div>

                </div>

                {/* Invoices Roster */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: 0 }}>Student Invoices & Receivables</h3>
                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{invoices.length} Registered Accounts</span>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb', fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' }}>
                                <th style={{ padding: '12px 20px' }}>Invoice #</th>
                                <th style={{ padding: '12px 20px' }}>Student</th>
                                <th style={{ padding: '12px 20px' }}>Class</th>
                                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Total Invoiced</th>
                                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Paid</th>
                                <th style={{ padding: '12px 20px', textAlign: 'right' }}>Balance</th>
                                <th style={{ padding: '12px 20px', textAlign: 'center' }}>Status</th>
                                <th style={{ padding: '12px 20px', textAlign: 'center' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv) => (
                                <tr key={inv.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '14px 20px', fontFamily: 'monospace', fontWeight: 600, color: '#4b5563' }}>{inv.invoice_number}</td>
                                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#111827' }}>
                                        {inv.student_name}
                                        <div style={{ fontSize: '11px', color: '#6b7280', fontFamily: 'monospace' }}>{inv.admission_number}</div>
                                    </td>
                                    <td style={{ padding: '14px 20px', color: '#4b5563', fontSize: '12px' }}>{inv.class_name}</td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 600 }}>TZS {inv.total_amount.toLocaleString()}</td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', color: '#059669', fontWeight: 600 }}>TZS {inv.paid_amount.toLocaleString()}</td>
                                    <td style={{ padding: '14px 20px', textAlign: 'right', color: inv.balance > 0 ? '#dc2626' : '#6b7280', fontWeight: 700 }}>
                                        TZS {inv.balance.toLocaleString()}
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            padding: '4px 8px',
                                            borderRadius: '9999px',
                                            backgroundColor: inv.status === 'PAID' ? '#ecfdf5' : inv.status === 'PARTIAL' ? '#fffbeb' : '#fef2f2',
                                            color: inv.status === 'PAID' ? '#047857' : inv.status === 'PARTIAL' ? '#b45309' : '#b91c1c',
                                        }}>
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                                        {inv.balance > 0 ? (
                                            <button
                                                onClick={() => {
                                                    setSelectedInvoice(inv);
                                                    setAmount(String(inv.balance));
                                                }}
                                                style={{
                                                    backgroundColor: '#4f46e5',
                                                    color: '#ffffff',
                                                    border: 'none',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px'
                                                }}
                                            >
                                                <PlusCircle style={{ width: '13px', height: '13px' }} /> Record
                                            </button>
                                        ) : (
                                            <span style={{ color: '#9ca3af', fontSize: '12px', fontWeight: 500 }}>Cleared</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Quick Payment Modal */}
            {selectedInvoice && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50
                }}>
                    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>Record Student Fee Payment</h3>
                            <button onClick={() => setSelectedInvoice(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                                <X style={{ width: '18px', height: '18px', color: '#9ca3af' }} />
                            </button>
                        </div>

                        <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '12px' }}>
                            <div style={{ fontWeight: 700, color: '#111827' }}>{selectedInvoice.student_name} ({selectedInvoice.admission_number})</div>
                            <div style={{ color: '#6b7280', marginTop: '2px' }}>Outstanding Balance: <strong style={{ color: '#dc2626' }}>TZS {selectedInvoice.balance.toLocaleString()}</strong></div>
                        </div>

                        <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Amount to Pay (TZS)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    max={selectedInvoice.balance}
                                    required
                                    style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '14px', fontWeight: 600 }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Payment Channel</label>
                                <select
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}
                                >
                                    <option value="Bank Transfer">Bank Transfer (CRDB / NMB)</option>
                                    <option value="Mobile Money">Mobile Money (M-Pesa / Airtel Money)</option>
                                    <option value="Cash">Cash at Bursar Desk</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#374151', textTransform: 'uppercase', marginBottom: '4px' }}>Transaction Reference / Slip #</label>
                                <input
                                    type="text"
                                    value={refCode}
                                    onChange={(e) => setRefCode(e.target.value)}
                                    placeholder="e.g. CRDB-849202"
                                    style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '8px', padding: '8px 12px', fontSize: '13px' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedInvoice(null)}
                                    style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #d1d5db', background: '#ffffff', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#4f46e5', fontSize: '13px', fontWeight: 600, color: '#ffffff', cursor: 'pointer' }}
                                >
                                    {isSubmitting ? 'Recording...' : 'Confirm Receipt'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}