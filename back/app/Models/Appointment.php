<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;
    protected $table = 'appointments';
    protected $fillable = ['patient_id', 'doctor_id', 'appointment_date_at', 'appointment_time_at', 'status_id'];

    protected $hidden = ['created_at', 'updated_at'];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the doctor (user) that owns the appointment.
     */
    public function doctor()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the status associated with the appointment.
     */
    public function status()
    {
        return $this->belongsTo(AppointmentStatus::class);
    }

    public function diagnoses()
    {
        return $this->hasMany(Diagnose::class);
    }
}
