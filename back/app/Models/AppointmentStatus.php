<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentStatus extends Model
{
    use HasFactory;

    protected $table = 'appointment_statuses';
    protected $fillable = ['appointment_status_name', 'appointment_status_description'];

    protected $hidden = ['created_at', 'updated_at'];

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }
}
