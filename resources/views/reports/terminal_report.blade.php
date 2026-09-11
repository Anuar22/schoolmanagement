<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Terminal Academic Report</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #1f2937;
            margin: 0;
            padding: 24px;
            font-size: 13px;
        }
        .header-table {
            width: 100%;
            border-bottom: 2px solid #374151;
            padding-bottom: 12px;
            margin-bottom: 20px;
        }
        .school-title {
            font-size: 20px;
            font-weight: bold;
            text-transform: uppercase;
            color: #111827;
            margin: 0;
        }
        .school-sub {
            font-size: 11px;
            color: #6b7280;
            margin-top: 4px;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 11px;
        }
        .info-grid {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .info-grid td {
            padding: 6px 4px;
        }
        .label {
            font-size: 10px;
            color: #6b7280;
            text-transform: uppercase;
            font-weight: bold;
        }
        .val {
            font-size: 13px;
            font-weight: bold;
            color: #111827;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .data-table th {
            background-color: #f3f4f6;
            color: #374151;
            text-transform: uppercase;
            font-size: 10px;
            letter-spacing: 0.05em;
            padding: 8px;
            border-top: 1px solid #d1d5db;
            border-bottom: 1px solid #d1d5db;
            text-align: left;
        }
        .data-table td {
            padding: 8px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 12px;
        }
        .summary-box {
            width: 100%;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 24px;
            background-color: #f9fafb;
        }
        .hold-box {
            width: 100%;
            background-color: #fef2f2;
            border: 2px dashed #dc2626;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
            color: #991b1b;
            margin-bottom: 20px;
        }
        .signatures {
            width: 100%;
            margin-top: 30px;
        }
        .sig-line {
            border-top: 1px solid #4b5563;
            margin-top: 36px;
            padding-top: 6px;
            font-size: 11px;
            color: #4b5563;
            text-align: center;
        }
    </style>
</head>
<body>

    <!-- Header -->
    <table class="header-table">
        <tr>
            <td style="vertical-align: middle;">
                <h1 class="school-title">Academic Excellence Academy</h1>
                <div class="school-sub">Continuous Assessment & Terminal Performance Report | {{ $term->name }}</div>
            </td>
            <td style="text-align: right; vertical-align: middle;">
                @if($isCleared)
                    <span class="badge" style="background-color: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;">OFFICIAL TRANSCRIPT</span>
                @else
                    <span class="badge" style="background-color: #fef2f2; color: #991b1b; border: 1px solid #fecaca;">PROVISIONAL / HOLD</span>
                @endif
            </td>
        </tr>
    </table>

    <!-- Student Info -->
    <table class="info-grid">
        <tr>
            <td width="25%"><div class="label">Student Name</div><div class="val">{{ $student->last_name }}, {{ $student->first_name }}</div></td>
            <td width="25%"><div class="label">Admission #</div><div class="val">{{ $student->admission_number }}</div></td>
            <td width="25%"><div class="label">Class / Stream</div><div class="val">{{ $student->class_name }} ({{ $student->stream }})</div></td>
            <td width="25%"><div class="label">Class Standing</div><div class="val">#{{ $rank }} of {{ $totalStudents }}</div></td>
        </tr>
    </table>

    @if(!$isCleared)
        <!-- Financial Hold Notice -->
        <div class="hold-box">
            <div style="font-size: 14px; font-weight: bold; text-transform: uppercase;">Financial Clearance Required</div>
            <div style="font-size: 11px; margin-top: 4px;">
                Outstanding balance of <strong>TZS {{ number_format($outstandingBalance, 2) }}</strong> remaining for {{ $term->name }}. Official transcript endorsement withheld pending clearance at the Bursar's Office.
            </div>
        </div>
    @endif

    <!-- Performance Table -->
    <table class="data-table">
        <thead>
            <tr>
                <th width="15%">Code</th>
                <th width="40%">Subject Title</th>
                <th width="15%" style="text-align: right;">Final %</th>
                <th width="10%" style="text-align: center;">Grade</th>
                <th width="20%">Teacher Remarks</th>
            </tr>
        </thead>
        <tbody>
            @forelse($subjects as $subj)
                <tr>
                    <td style="font-family: monospace; font-weight: bold;">{{ $subj['code'] }}</td>
                    <td>{{ $subj['name'] }}</td>
                    <td style="text-align: right; font-weight: bold;">{{ $subj['score'] }}%</td>
                    <td style="text-align: center; font-weight: bold;">{{ $subj['grade'] }}</td>
                    <td style="color: #4b5563; font-size: 11px;">{{ $subj['remarks'] }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="5" style="text-align: center; color: #9ca3af; padding: 20px;">No assessment records submitted for this term.</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Overall Aggregate -->
    <table class="summary-box">
        <tr>
            <td width="33%" style="text-align: center; border-right: 1px solid #e5e7eb;">
                <div class="label">Term Average</div>
                <div style="font-size: 20px; font-weight: 800; color: #111827; margin-top: 4px;">{{ $average }}%</div>
            </td>
            <td width="33%" style="text-align: center; border-right: 1px solid #e5e7eb;">
                <div class="label">Overall Grade</div>
                <div style="font-size: 20px; font-weight: 800; color: #4f46e5; margin-top: 4px;">{{ $overallGrade }}</div>
            </td>
            <td width="33%" style="text-align: center;">
                <div class="label">Promotional Verdict</div>
                <div style="font-size: 13px; font-weight: 700; color: {{ $average >= 50 ? '#059669' : '#dc2626' }}; margin-top: 6px;">
                    {{ $average >= 50 ? 'PASS / GOOD STANDING' : 'ACADEMIC WARNING' }}
                </div>
            </td>
        </tr>
    </table>

    <!-- Signatures (Omitted if locked) -->
    <table class="signatures">
        <tr>
            <td width="40%">
                <div class="sig-line">Class Teacher's Signature</div>
            </td>
            <td width="20%"></td>
            <td width="40%">
                @if($isCleared)
                    <div class="sig-line">Headteacher / Principal Signature & Stamp</div>
                @else
                    <div class="sig-line" style="border-top: 1px dashed #dc2626; color: #dc2626;">[ Endorsement Withheld - Financial Hold ]</div>
                @endif
            </td>
        </tr>
    </table>

</body>
</html>