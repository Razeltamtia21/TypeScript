<?php

namespace App\Exports;

use App\Models\LoanRecognition;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Database\Eloquent\Builder;

class LoanRecognitionExport implements FromView, WithHeadings
{
    protected $query;

    public function __construct(Builder $query)
    {
        $this->query = $query;
    }

    public function view(): View
    {
        return view('exports.loan_recognition_excel', [
            'loanRecognitions' => $this->query->get()
        ]);
    }

    public function headings(): array
    {
        return [
            'No.',
            'Entity Number',
            'Account Number',
            'Debitor Name',
            'GL Account',
            'Loan Type',
            'GL Group',
            'Original Date',
            'Term (Months)',
            'Interest Rate',
            'Maturity Date',
            'Payment Amount',
            'Original Balance',
            'Current Balance',
            'Carrying Amount',
            'EIR Amortised Cost Exposure',
            'EIR Amortised Cost Calculated',
            'EIR Calculated Convertion',
            'EIR Calculated Transaction Cost',
            'EIR Calculated UpFront Fee',
            'Outstanding Amount',
            'Outstanding Amount Initial Transaction Cost',
            'Outstanding Amount Initial UpFront Fee'
        ];
    }
}