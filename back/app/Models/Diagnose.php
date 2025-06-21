<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Diagnose extends Model
{
    use HasFactory;

    protected $table = 'diagnoses';
    protected $fillable = ['appointment_id', 'diagnose_name', 'diagnose_description', 'date_diagnosed'];

    protected $hidden = ['created_at', 'updated_at'];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }

    public function medications()
    {
        return $this->belongsToMany(Medication::class, 'diagnose_medications');
    }
}
