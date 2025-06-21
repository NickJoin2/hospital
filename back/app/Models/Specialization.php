<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialization extends Model
{
    use HasFactory;

    protected $table = 'specializations';
    protected $fillable = ['specialization_code', 'specialization_name'];


    protected $hidden = ['created_at', 'updated_at'];

    public function workerEducations()
    {
        return $this->hasMany(WorkerEducation::class);
    }
}
