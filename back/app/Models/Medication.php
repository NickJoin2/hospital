<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medication extends Model
{
    use HasFactory;


    protected $table = 'medications';
    protected $fillable = ['medicine_name_id', 'dosage', 'start_date_at', 'end_date_at', 'frequency_id'];

    protected $hidden = ['created_at', 'updated_at'];

    public function medicineName()
    {
        return $this->belongsTo(MedicinesName::class);
    }

    /**
     * Get the frequency associated with the medication.
     */
    public function frequency()
    {
        return $this->belongsTo(Frequency::class);
    }

    /**
     * Get the instruction associated with the medication.
     */

    public function diagnoses()
    {
        return $this->belongsToMany(Diagnose::class, 'diagnose_medications');
    }
}
