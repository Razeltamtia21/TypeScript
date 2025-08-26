<?php
namespace App\Imports;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\Importable;
use Illuminate\Support\Collection;
use App\Models\LoanTempData;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SimpleInterestImport implements ToCollection, WithHeadingRow, WithValidation
{
    use Importable;
    
    protected $sessionId;
    
    public function __construct($sessionId)
    {
        $this->sessionId = $sessionId;
    }
    
    public function collection(Collection $rows)
    {
        $errors = [];
        $successCount = 0;
        
        foreach ($rows as $index => $row) {
            if ($this->isRowEmpty($row)) {
                continue;
            }
            
            try {
                $processedRow = [
                    'session_id' => $this->sessionId,
                    'no_acc'    => $this->cleanString($row['no_acc'] ?? ''),
                    'no_branch' => $this->cleanString($row['no_branch'] ?? ''),
                    'deb_name'  => $this->cleanString($row['deb_name'] ?? ''),
                    'status'    => $this->cleanString($row['status'] ?? ''),
                    'ln_type'   => $this->cleanString($row['ln_type'] ?? ''),
                    'org_date'  => $this->formatDate($row['org_date'] ?? null),
                    'term'      => $this->cleanString($row['term'] ?? ''),
                    'mtr_date'  => $this->formatDate($row['mtr_date'] ?? null),
                    'org_bal'   => $this->formatNumber($row['org_bal'] ?? 0),
                    'rate'      => $this->formatNumber($row['rate'] ?? 0),
                    'cbal'      => $this->formatNumber($row['cbal'] ?? 0),
                ];
                
                if (empty($processedRow['no_acc'])) {
                    $errors[] = "Row " . ($index + 2) . ": Account Number is required";
                    continue;
                }
                
                if (empty($processedRow['deb_name'])) {
                    $errors[] = "Row " . ($index + 2) . ": Debtor Name is required";
                    continue;
                }
                
                LoanTempData::create($processedRow);
                $successCount++;
            } catch (\Exception $e) {
                $errors[] = "Row " . ($index + 2) . ": " . $e->getMessage();
                Log::error("Import error on row " . ($index + 2) . ": " . $e->getMessage());
            }
        }
        
        session([
            'import_stats' => [
                'total_rows' => count($rows),
                'success_count' => $successCount,
                'error_count' => count($errors)
            ]
        ]);
        
        if (!empty($errors)) {
            session(['import_errors' => array_slice($errors, 0, 10)]);
        }
        
        session()->save();
    }
    
    public function rules(): array
    {
        return [];
    }
    
    private function isRowEmpty($row): bool
    {
        return empty($row['no_acc']) && empty($row['deb_name']);
    }
    
    private function cleanString($value): string
    {
        return trim(strval($value ?? ''));
    }
    
    private function formatDate($value): ?string
    {
        if (empty($value)) return null;
        
        try {
            if (is_numeric($value)) {
                $date = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($value);
                $formatted = $date->format('Y-m-d');
                
                $year = $date->format('Y');
                if ($year < 1900 || $year > 2100) {
                    Log::warning("Date out of range: $value -> $formatted");
                    return null;
                }
                
                return $formatted;
            }
            
            $dateString = trim(strval($value));
            $formats = [
                'Y-m-d', 'd/m/Y', 'm/d/Y', 'Y/m/d',
                'd-m-Y', 'm-d-Y', 'Y-m-d',
                'd M Y', 'M d Y', 'Y M d',
                'd F Y', 'F d Y', 'Y F d',
            ];
            
            foreach ($formats as $format) {
                $date = \DateTime::createFromFormat($format, $dateString);
                if ($date !== false) {
                    $formatted = $date->format('Y-m-d');
                    return $formatted;
                }
            }
            
            $carbon = Carbon::parse($dateString);
            
            if ($carbon->year < 1900 || $carbon->year > 2100) {
                Log::warning("Date out of range: $value");
                return null;
            }
            
            return $carbon->format('Y-m-d');
        } catch (\Exception $e) {
            Log::error("Date conversion error for value '$value': " . $e->getMessage());
            return null;
        }
    }
    
    private function formatNumber($value): float
    {
        if ($value === null || $value === '') return 0;
        return floatval(preg_replace('/[^\d\.\-]/', '', strval($value)));
    }
    
    public static function getExpectedHeaders(): array
    {
        return [
            'Standard Headers' => [
                'no_acc'   => 'Account Number',
                'no_branch' => 'Branch Number',
                'deb_name' => 'Debtor Name',
                'status'   => 'Status',
                'ln_type'  => 'Loan Type',
                'org_date' => 'Origination Date',
                'term'     => 'Term',
                'mtr_date' => 'Maturity Date',
                'org_bal'  => 'Original Balance',
                'rate'     => 'Interest Rate',
                'cbal'     => 'Current Balance',
            ],
        ];
    }
}