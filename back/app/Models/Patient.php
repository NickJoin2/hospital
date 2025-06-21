<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    protected $table = 'patients';
    protected $fillable = ['first_name', 'middle_name', 'last_name', 'is_gender','created_id', 'updated_id', 'birth_date', 'phone', 'avatar'];

    protected $hidden = ['created_at', 'updated_at'];

    public function allergies()
    {
        return $this->hasMany(Allergy::class);
    }

    /**
     * Get the insurances for the patient.
     */
    public function insurances()
    {
        return $this->hasMany(PatientInsurance::class, 'patient_id');
    }

    public function passport()
    {
        return $this->hasOne(PatientsPassword::class, 'patient_id');
    }

    public function operations()
    {
        return $this->hasMany(Operation::class, 'patient_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }
}
