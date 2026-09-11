import React from 'react';
import { router } from '@inertiajs/react';
import { Filter, ChevronDown } from 'lucide-react';

interface OptionItem {
    id: string;
    name: string;
    stream?: string;
    code?: string;
}

interface Props {
    terms?: OptionItem[];
    classes?: OptionItem[];
    subjects?: OptionItem[];
    selectedTermId?: string;
    selectedClassId?: string;
    selectedSubjectId?: string;
    routeName: string;
}

export default function AcademicFilterBar({
    terms,
    classes,
    subjects,
    selectedTermId,
    selectedClassId,
    selectedSubjectId,
    routeName,
}: Props) {
    const handleFilterChange = (key: string, value: string) => {
        const queryParams: Record<string, string> = {
            ...(selectedTermId && { term_id: selectedTermId }),
            ...(selectedClassId && { class_id: selectedClassId }),
            ...(selectedSubjectId && { subject_id: selectedSubjectId }),
            [key]: value,
        };

        router.get(route(routeName), queryParams, {
            preserveState: false,
            preserveScroll: true,
        });
    };

    // Thorough reset: completely kills OS native select glyphs
    const selectStyle: React.CSSProperties = {
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none',
        backgroundImage: 'none',
        backgroundColor: '#f9fafb',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '7px 32px 7px 12px',
        fontSize: '13px',
        fontWeight: 600,
        color: '#374151',
        cursor: 'pointer',
        outline: 'none',
        lineHeight: '1.4',
    };

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            flexWrap: 'wrap',
            boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#6b7280', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase' }}>
                <Filter style={{ width: '14px', height: '14px' }} />
                <span>Filters:</span>
            </div>

            {/* Term Dropdown */}
            {terms && (
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                    <select
                        value={selectedTermId}
                        onChange={(e) => handleFilterChange('term_id', e.target.value)}
                        style={selectStyle}
                    >
                        {terms.map((t) => (
                            <option key={t.id} value={t.id}>
                                {t.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown style={{ width: '14px', height: '14px', color: '#6b7280', position: 'absolute', right: '10px', pointerEvents: 'none' }} />
                </div>
            )}

            {/* Class Stream Dropdown */}
            {classes && (
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                    <select
                        value={selectedClassId}
                        onChange={(e) => handleFilterChange('class_id', e.target.value)}
                        style={selectStyle}
                    >
                        {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name} {c.stream ? `(${c.stream})` : ''}
                            </option>
                        ))}
                    </select>
                    <ChevronDown style={{ width: '14px', height: '14px', color: '#6b7280', position: 'absolute', right: '10px', pointerEvents: 'none' }} />
                </div>
            )}

            {/* Subject Dropdown */}
            {subjects && (
                <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
                    <select
                        value={selectedSubjectId}
                        onChange={(e) => handleFilterChange('subject_id', e.target.value)}
                        style={selectStyle}
                    >
                        {subjects.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name} {s.code ? `(${s.code})` : ''}
                            </option>
                        ))}
                    </select>
                    <ChevronDown style={{ width: '14px', height: '14px', color: '#6b7280', position: 'absolute', right: '10px', pointerEvents: 'none' }} />
                </div>
            )}
        </div>
    );
}