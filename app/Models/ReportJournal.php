<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportJournal extends Model
{
    use HasFactory;

    protected $fillable = [
        'entity_number',
        'gl_account',
        'description',
        'debit',
        'credit',
        'posting_date'
    ];
}