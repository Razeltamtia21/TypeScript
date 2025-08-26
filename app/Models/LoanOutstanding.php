<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanOutstanding extends Model
{
    use HasFactory;

    protected $fillable = [
        'entity_number',
        'account_number',
        'debitor_name',
        'gl_account',
        'loan_type',
        'gl_group',
        'original_date',
        'term_months',
        'maturity_date',
        'interest_rate',
        'payment_amount',
        'eir_amortised_cost_exposure',
        'eir_amortised_cost_calculated',
        'current_balance',
        'carrying_amount',
        'outstanding_receivable',
        'outstanding_interest',
        'cumulative_time_gap',
        'unamortized_transaction_cost',
        'unamortized_upfront_fee',
        'unearned_interest_income',
    ];

    protected $casts = [
        'original_date' => 'date',
        'maturity_date' => 'date',
        'interest_rate' => 'decimal:2',
        'payment_amount' => 'decimal:2',
        'eir_amortised_cost_exposure' => 'decimal:2',
        'eir_amortised_cost_calculated' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'carrying_amount' => 'decimal:2',
        'outstanding_receivable' => 'decimal:2',
        'outstanding_interest' => 'decimal:2',
        'cumulative_time_gap' => 'decimal:2',
        'unamortized_transaction_cost' => 'decimal:2',
        'unamortized_upfront_fee' => 'decimal:2',
        'unearned_interest_income' => 'decimal:2',
    ];
}