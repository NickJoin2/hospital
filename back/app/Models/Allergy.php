<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Allergy extends Model
{
    use HasFactory;
    protected $table = 'allergies';
    protected $fillable = ['reaction', 'date_diagnose_at', 'patient_id', 'allergen_id', 'severity_id'];

    protected $hidden = ['created_at', 'updated_at'];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the allergen associated with the allergy.
     */
    public function allergen()
    {
        return $this->belongsTo(Allergen::class);
    }

    /**
     * Get the severity associated with the allergy.
     */
    public function severity()
    {
        return $this->belongsTo(Severity::class);
    }
}
