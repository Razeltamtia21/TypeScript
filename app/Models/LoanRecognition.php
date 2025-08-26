<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanRecognition extends Model
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
        'term',
        'interest_rate',
        'maturity_date',
        'payment_amount',
        'original_balance',
        'current_balance',
        'carrying_amount',
        'eir_amortised_cost_exposure',
        'eir_amortised_cost_calculated',
        'eir_calculated_convertion',
        'eir_calculated_transaction_cost',
        'eir_calculated_up_front_fee',
        'outstanding_amount',
        'outstanding_amount_initial_transaction_cost',
        'outstanding_amount_initial_up_front_fee',
    ];

    protected $casts = [
        'original_date' => 'date',
        'maturity_date' => 'date',
        'interest_rate' => 'decimal:2',
        'payment_amount' => 'decimal:2',
        'original_balance' => 'decimal:2',
        'current_balance' => 'decimal:2',
        'carrying_amount' => 'decimal:2',
        'eir_amortised_cost_exposure' => 'decimal:2',
        'eir_amortised_cost_calculated' => 'decimal:2',
        'eir_calculated_convertion' => 'decimal:2',
        'eir_calculated_transaction_cost' => 'decimal:2',
        'eir_calculated_up_front_fee' => 'decimal:2',
        'outstanding_amount' => 'decimal:2',
        'outstanding_amount_initial_transaction_cost' => 'decimal:2',
        'outstanding_amount_initial_up_front_fee' => 'decimal:2',
    ];
}