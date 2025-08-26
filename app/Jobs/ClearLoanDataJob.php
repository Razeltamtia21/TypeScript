<?php
namespace App\Jobs;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class ClearLoanDataJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    
    protected $sessionId;
    
    public function __construct($sessionId)
    {
        $this->sessionId = $sessionId;
    }
    
    public function handle()
    {
        DB::table('loan_temp_table')
            ->where('session_id', $this->sessionId)
            ->delete();
            
        Session::forget(['upload_file_info', 'import_stats', 'import_errors']);
        Session::save();
    }
}