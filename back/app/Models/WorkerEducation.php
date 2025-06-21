<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkerEducation extends Model
{
    use HasFactory;

    protected $table = 'worker_education';
    protected $fillable = ['year_start', 'year_end', 'specialization_id', 'is_not_finished', 'educational_institution', 'education_level_id', 'worker_id'];

    protected $hidden = ['created_at', 'updated_at'];

    public function specialization()
    {
        return $this->belongsTo(Specialization::class, 'specialization_id');
    }

    /**
     * Get the education level associated with the worker education.
     */
    public function educationLevel()
    {
        return $this->belongsTo(EducationLevel::class, 'education_level_id');
    }


    /**
     * Get the user (worker) associated with the worker education.
     */
    public function worker()
    {
        return $this->belongsTo(User::class);
    }
}
