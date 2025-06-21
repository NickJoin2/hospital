<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Severity extends Model
{
    use HasFactory;


    protected $table = 'severities';
    protected $fillable = ['severity_name', 'severity_description'];

    protected $hidden = ['created_at', 'updated_at'];

    public function allergies()
    {
        return $this->hasMany(Allergy::class);
    }
}
