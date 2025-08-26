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
                <td>{{ $item->payment_amount }}</td>
                <td>{{ $item->original_balance }}</td>
                <td>{{ $item->current_balance }}</td>
                <td>{{ $item->carrying_amount }}</td>
                <td>{{ $item->eir_amortised_cost_exposure }}</td>
                <td>{{ $item->eir_amortised_cost_calculated }}</td>
                <td>{{ $item->eir_calculated_convertion }}</td>
                <td>{{ $item->eir_calculated_transaction_cost }}</td>
                <td>{{ $item->eir_calculated_up_front_fee }}</td>
                <td>{{ $item->outstanding_amount }}</td>
                <td>{{ $item->outstanding_amount_initial_transaction_cost }}</td>
                <td>{{ $item->outstanding_amount_initial_up_front_fee }}</td>
            </tr>
        @endforeach
    </tbody>
</table>