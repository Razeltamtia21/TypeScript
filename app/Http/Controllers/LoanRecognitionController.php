<?php
namespace App\Http\Controllers;

use App\Models\LoanRecognition;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LoanRecognitionExport;

class LoanRecognitionController extends Controller
{
    // Method untuk menerapkan filter (hindari duplikasi)
    private function applyFilters($query, Request $request)
    {
        if ($request->filled('entity_number')) {
            $query->where('entity_number', 'like', '%' . $request->entity_number . '%');
        }
        
        if ($request->filled('debitor_name')) {
            $query->where('debitor_name', 'like', '%' . $request->debitor_name . '%');
        }
        
        if ($request->filled('loan_type')) {
            $query->where('loan_type', $request->loan_type);
        }
        
        if ($request->filled('gl_group')) {
            $query->where('gl_group', $request->gl_group);
        }
        
        return $query;
    }

    // Halaman utama dengan filter
    public function effective(Request $request)
    {
        $query = LoanRecognition::query();
        $loanRecognitions = $this->applyFilters($query, $request)->get();
        
        // Gunakan path yang sesuai dengan struktur folder
        return Inertia::render('ReportLoan/ReportInitialRecognition/effective', [
            'loanRecognitions' => $loanRecognitions,
            'filters' => $request->only(['entity_number', 'debitor_name', 'loan_type', 'gl_group'])
        ]);
    }
    
    // Export PDF
    public function exportToPDF(Request $request)
    {
        $query = LoanRecognition::query();
        $loanRecognitions = $this->applyFilters($query, $request)->get();
        
        // Pastikan file blade view ada di:
        // resources/views/exports/loan_recognition_pdf.blade.php
        $pdf = PDF::loadView('exports.loan_recognition_pdf', [
            'loanRecognitions' => $loanRecognitions
        ])->setPaper('a4', 'landscape');
        
        return $pdf->download('loan_recognition_effective.pdf');
    }
    
    // Export Excel
    public function exportToExcel(Request $request)
    {
        $query = LoanRecognition::query();
        $query = $this->applyFilters($query, $request);
        
        return Excel::download(
            new LoanRecognitionExport($query), 
            'loan_recognition_effective.xlsx'
        );
    }
}