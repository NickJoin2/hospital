<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DiagnoseMedication extends Model
{
    use HasFactory;

    protected $table = 'diagnose_medications';
    protected $fillable = ['diagnose_id', 'medication_id'];

    protected $hidden = ['created_at', 'updated_at'];

    public function diagnosis()
    {
        return $this->belongsTo(Diagnose::class);
    }

    /**
     * Get the medication associated with the diagnose medication.
     */
    public function medication()
    {
        return $this->belongsTo(Medication::class);
    }
}
