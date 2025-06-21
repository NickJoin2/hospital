<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PatientsPassword extends Model
{
    use HasFactory;

    protected $table = 'patients_passwords';
    protected $fillable = ['series', 'number', 'issued', 'patient_id'];

    protected $hidden = ['created_at', 'updated_at'];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
