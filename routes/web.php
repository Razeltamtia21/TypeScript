<?php

use App\Http\Controllers\LoanRecognitionController;
use App\Http\Controllers\UploadDataController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route publik
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Group rute yang butuh autentikasi
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    /**
     * ================================
     * Report Loan
     * ================================
     */
    // Report Loan - Report Initial Recognition
    Route::prefix('report-loan/report-initial-recognition')->group(function () {
        // Effective pakai controller
        Route::get('effective', [LoanRecognitionController::class, 'effective'])
            ->name('report.loan.report-initial-recognition.effective');

        // Simple Interest langsung render Inertia
        Route::get('simple-interest', function () {
            return Inertia::render('ReportLoan/ReportInitialRecognition/simpleinterest');
        })->name('report.loan.report-initial-recognition.simple-interest');
    });

    // Report Loan - Report Outstanding
    Route::prefix('report-loan/report-outstanding')->group(function () {
        Route::get('effective', function () {
            return Inertia::render('ReportLoan/ReportOutstanding/effective');
        })->name('report.loan.report-outstanding.effective');

        Route::get('simple-interest', function () {
            return Inertia::render('ReportLoan/ReportOutstanding/simpleinterest');
        })->name('report.loan.report-outstanding.simple-interest');
    });

    // Report Loan - Report Journal
    Route::prefix('report-loan/report-journal')->group(function () {
        Route::get('effective', function () {
            return Inertia::render('ReportLoan/ReportJournal/effective');
        })->name('report.loan.report-journal.effective');

        Route::get('simple-interest', function () {
            return Inertia::render('ReportLoan/ReportJournal/simpleinterest');
        })->name('report.loan.report-journal.simple-interest');
    });

    /**
     * ================================
     * Report Securities
     * ================================
     */
    // Report Initial Recognition
    Route::prefix('report-securities')->group(function () {
        Route::get('report-initial-recognition', function () {
            return Inertia::render('ReportSecurities/reportinitialrecognition');
        })->name('report.securities.report-initial-recognition');
    });

    // Report Outstanding
    Route::prefix('report-securities/report-outstanding')->group(function () {
        Route::get('outstanding-fvtoci', function () {
            return Inertia::render('ReportSecurities/ReportOstanding/outstandingfvtoci');
        })->name('report.securities.report-outstanding.outstanding-fvtoci');

        Route::get('outstanding-amortized-cost', function () {
            return Inertia::render('ReportSecurities/ReportOstanding/outstandingamortizedcost');
        })->name('report.securities.report-outstanding.outstanding-amortized-cost');
    });

    // Report Evaluation Treasury Bond
    Route::prefix('report-securities')->group(function () {
        Route::get('report-evaluation-treasury-bond', function () {
            return Inertia::render('ReportSecurities/reportevaluationtreasurybond');
        })->name('report.securities.report-evaluation-treasury-bond');
    });

    // Report Journal Securities
    Route::prefix('report-securities')->group(function () {
        Route::get('report-journal-securities', function () {
            return Inertia::render('ReportSecurities/reportjournalsecurities');
        })->name('report.securities.report-journal-securities');
    });

    /**
     * ================================
     * Upload Data Files - Simple Interest
     * ================================
     */
    // Upload Data Files - Simple Interest (FIXED: GET & POST ke controller yang tepat)
     Route::prefix('upload-data-files/simple-interest')->group(function () {
        // Halaman upload
        Route::get('upload-file', [UploadDataController::class, 'uploadFileSimpleInterest'])
            ->name('upload.data.files.simple-interest.upload-file');
        // Proses upload file
        Route::post('upload-file', [UploadDataController::class, 'uploadFileSimpleInterestStore'])
            ->name('upload.data.files.simple-interest.upload-file.store');
        // Execute data (simpan ke database)
        Route::post('execute', [UploadDataController::class, 'executeSimpleInterest'])
            ->name('upload.data.files.simple-interest.execute');
        // Clear data
        Route::delete('clear-data', [UploadDataController::class, 'clearDataSimpleInterest'])
            ->name('upload.data.files.simple-interest.clear-data');
        // Download template
        Route::get('template', [UploadDataController::class, 'downloadTemplate'])
            ->name('upload.data.files.simple-interest.template');
    });
    /**
     * ================================
     * Export
     * ================================
     */
    Route::get('report-loan/report-initial-recognition/effective/export-pdf', [LoanRecognitionController::class, 'exportToPDF'])
        ->name('report.loan.report-initial-recognition.export-pdf');

    Route::get('report-loan/report-initial-recognition/effective/export-excel', [LoanRecognitionController::class, 'exportToExcel'])
        ->name('report.loan.report-initial-recognition.export-excel');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
