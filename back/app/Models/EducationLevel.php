<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EducationLevel extends Model
{
    use HasFactory;


    protected $table = 'education_levels';
    protected $fillable = ['level_name'];

    protected $hidden = ['created_at', 'updated_at'];

    public function workerEducations()
    {
        return $this->hasMany(WorkerEducation::class);
    }
}
