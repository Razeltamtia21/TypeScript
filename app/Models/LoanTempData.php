<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class LoanTempData extends Model
{
    protected $table = 'loan_temp_data';
    protected $fillable = [
        'session_id',
        'no_acc',
        'no_branch',
        'deb_name',
        'status',
        'ln_type',
        'org_date',
        'term',
        'mtr_date',
        'org_bal',
        'rate',
        'cbal',
    ];
    
    public $timestamps = true;
}