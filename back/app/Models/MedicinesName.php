<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicinesName extends Model
{
    use HasFactory;

    protected $table = 'medicines_names';
    protected $fillable = ['medicine_name'];

    protected $hidden = ['created_at', 'updated_at'];

    public function medications()
    {
        return $this->hasMany(Medication::class);
    }
}
