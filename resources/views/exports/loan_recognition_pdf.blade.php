<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Loan Recognition - Effective Interest Rate</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .title {
            font-size: 18px;
            font-weight: bold;
        }
        .subtitle {
            font-size: 14px;
            margin-top: 5px;
        }
        .date {
            text-align: right;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">Report Loan - Report Initial Recognition</div>
        <div class="subtitle">Effective Interest Rate Calculation</div>
    </div>
    
    <div class="date">
        Generated on: {{ date('d M Y H:i') }}
    </div>
    
    <table>
        <thead>
            <tr>
                <th>No.</th>
                <th>Entity Number</th>
                <th>Account Number</th>
                <th>Debitor Name</th>
                <th>GL Account</th>
                <th>Loan Type</th>
                <th>GL Group</th>
                <th>Original Date</th>
                <th>Term (Months)</th>
                <th>Interest Rate</th>
                <th>Maturity Date</th>
                <th>Payment Amount</th>
                <th>Original Balance</th>
                <th>Current Balance</th>
                <th>Carrying Amount</th>
                <th>EIR Amortised Cost Exposure</th>
                <th>EIR Amortised Cost Calculated</th>
                <th>EIR Calculated Convertion</th>
                <th>EIR Calculated Transaction Cost</th>
                <th>EIR Calculated UpFront Fee</th>
                <th>Outstanding Amount</th>
                <th>Outstanding Amount Initial Transaction Cost</th>
                <th>Outstanding Amount Initial UpFront Fee</th>
            </tr>
        </thead>
        <tbody>
            @foreach($loanRecognitions as $item)
                <tr>
                    <td>{{ $loop->iteration }}</td>
                    <td>{{ $item->entity_number }}</td>
                    <td>{{ $item->account_number }}</td>
                    <td>{{ $item->debitor_name }}</td>
                    <td>{{ $item->gl_account }}</td>
                    <td>{{ $item->loan_type }}</td>
                    <td>{{ $item->gl_group }}</td>
                    <td>{{ $item->original_date }}</td>
                    <td>{{ $item->term }}</td>
                    <td>{{ $item->interest_rate }}%</td>
                    <td>{{ $item->maturity_date }}</td>
                    <td>Rp {{ number_format($item->payment_amount, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->original_balance, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->current_balance, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->carrying_amount, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->eir_amortised_cost_exposure, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->eir_amortised_cost_calculated, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->eir_calculated_convertion, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->eir_calculated_transaction_cost, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->eir_calculated_up_front_fee, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->outstanding_amount, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->outstanding_amount_initial_transaction_cost, 0, ',', '.') }}</td>
                    <td>Rp {{ number_format($item->outstanding_amount_initial_up_front_fee, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>