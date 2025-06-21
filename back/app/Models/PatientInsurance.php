<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientInsurance extends Model
{
    use HasFactory;

    protected $table = 'patient_insurances';
    protected $fillable = ['company', 'insurance_number', 'date_end_at', 'patient_id'];

    protected $hidden = ['created_at', 'updated_at'];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
