<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use App\Imports\SimpleInterestImport;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\HeadingRowImport;
use App\Models\LoanTempData;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class UploadDataController extends Controller
{
    // Hapus middleware dari constructor
    public function __construct()
    {
        // Kosongkan constructor
    }

    // Terapkan middleware langsung di metode yang membutuhkan
    public function uploadFileSimpleInterest()
    {
        // Pastikan session dimulai
        if (!Session::isStarted()) {
            Session::start();
        }

        $sessionId = Session::getId();
        $loanData = LoanTempData::where('session_id', $sessionId)->get()->toArray();

        return Inertia::render('UploadDataFiles/SimpleInterest/uploadfile', [
            'loanData' => $loanData,
            'fileInfo' => Session::pull('upload_file_info', null),
            'expectedHeaders' => SimpleInterestImport::getExpectedHeaders(),
            'importStats' => Session::pull('import_stats', null),
            'importErrors' => Session::pull('import_errors', []),
            'successMessage' => Session::pull('success'),
            'errorMessage' => Session::pull('error'),
            'warningMessage' => Session::pull('warning'),
        ]);
    }

    public function uploadFileSimpleInterestStore(Request $request)
    {
        // Pastikan session dimulai
        if (!Session::isStarted()) {
            Session::start();
        }

        Log::info('Upload request received', [
            'file' => $request->file('file'),
            'session_id' => Session::getId(),
        ]);

        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls,csv|max:2048'
        ], [
            'file.required' => 'File wajib diupload.',
        ]);

        if ($validator->fails()) {
            Log::warning('Validation failed', ['errors' => $validator->errors()]);
            return back()->withErrors($validator)->withInput();
        }

        try {
            $file = $request->file('file');
            if (!$file || !$file->isValid()) {
                Log::error('Invalid file', ['file' => $file]);
                return back()->with('error', 'File tidak valid.');
            }

            $sessionId = Session::getId();
            LoanTempData::where('session_id', $sessionId)->delete();

            $fileInfo = [
                'name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'extension' => $file->getClientOriginalExtension(),
                'uploaded_at' => now()->format('Y-m-d H:i:s')
            ];

            $headings = (new HeadingRowImport)->toArray($file)[0][0] ?? [];
            if (empty($headings)) {
                Log::warning('Empty headers in file');
                return back()->with('error', 'File tidak memiliki header atau format tidak sesuai.');
            }

            $headerValidation = $this->validateHeaders($headings);
            if (!$headerValidation['valid']) {
                Log::warning('Header validation failed', ['message' => $headerValidation['message']]);
                return back()->with('warning', $headerValidation['message']);
            }

            // Simpan file info ke session sebelum import
            Session::put('upload_file_info', $fileInfo);
            Session::save();

            $import = new SimpleInterestImport($sessionId);
            Excel::import($import, $file);

            // Ambil statistik import dari session
            $importStats = Session::get('import_stats', []);
            $importErrors = Session::get('import_errors', []);
            $loanDataCount = LoanTempData::where('session_id', $sessionId)->count();

            if ($loanDataCount === 0) {
                Log::warning('No valid data imported');
                return back()->with('warning', 'File berhasil diupload, tapi tidak ada data valid.');
            }

            $msg = "File berhasil diupload! " . $loanDataCount . " record diproses.";
            if (!empty($importStats)) {
                $msg .= " Berhasil: {$importStats['success_count']}, Gagal: {$importStats['error_count']}.";
            }

            // Simpan session sebelum redirect
            Session::save();

            // Di UploadDataController.php, metode uploadFileSimpleInterestStore
            return redirect()->route('upload.data.files.simple-interest.upload-file')
                ->with('success', $msg)
                ->with('error', null) // Reset error message
                ->with('warning', null); // Reset warning message;

            // Tambahkan ini sebelum return:
            Session::save();
        } catch (\Exception $e) {
            Log::error('Upload Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return back()->with('error', 'Gagal upload: ' . $e->getMessage());
        }
    }

    public function executeSimpleInterest()
    {
        // Pastikan session dimulai
        if (!Session::isStarted()) {
            Session::start();
        }

        try {
            $sessionId = Session::getId();
            $loanData = LoanTempData::where('session_id', $sessionId)->get();

            if ($loanData->isEmpty()) {
                return back()->with('error', 'Tidak ada data untuk dieksekusi.');
            }

            // Proses data dan simpan ke database permanen
            foreach ($loanData as $data) {
                // Contoh: Simpan ke model permanen
                // \App\Models\Loan::create([
                //     'no_acc' => $data->no_acc,
                //     'no_branch' => $data->no_branch,
                //     // ... field lainnya
                // ]);
            }

            LoanTempData::where('session_id', $sessionId)->delete();
            Session::forget(['upload_file_info', 'import_stats', 'import_errors']);
            Session::save();

            return back()->with('success', 'Data berhasil dieksekusi dan disimpan.');
        } catch (\Exception $e) {
            Log::error('Execute Error: ' . $e->getMessage());
            return back()->with('error', 'Gagal mengeksekusi data: ' . $e->getMessage());
        }
    }

    public function clearDataSimpleInterest()
    {
        // Pastikan session dimulai
        if (!Session::isStarted()) {
            Session::start();
        }

        try {
            $sessionId = Session::getId();
            
            // Periksa apakah ada data yang akan dihapus
            $dataCount = LoanTempData::where('session_id', $sessionId)->count();
            
            if ($dataCount === 0) {
                return back()->with('warning', 'Tidak ada data untuk dihapus.');
            }

            // Hapus data jika ada
            LoanTempData::where('session_id', $sessionId)->delete();
            Session::forget(['upload_file_info', 'import_stats', 'import_errors']);
            Session::save();

            return redirect()->route('upload.data.files.simple-interest.upload-file')
                ->with('success', "Berhasil menghapus {$dataCount} data.");
                
        } catch (\Exception $e) {
            Log::error('Clear Data Error: ' . $e->getMessage());
            return back()->with('error', 'Gagal menghapus data: ' . $e->getMessage());
        }
    }

    private function validateHeaders(array $headings): array
    {
        $expected = array_keys(SimpleInterestImport::getExpectedHeaders()['Standard Headers']);
        $normalized = array_map(fn($h) => strtolower(trim($h)), $headings);
        $required = ['no_acc', 'deb_name'];

        foreach ($required as $req) {
            if (!in_array($req, $normalized)) {
                return [
                    'valid' => false,
                    'message' => "Header wajib: $req tidak ditemukan dalam file."
                ];
            }
        }

        return [
            'valid' => true,
            'message' => 'Header valid.'
        ];
    }
}