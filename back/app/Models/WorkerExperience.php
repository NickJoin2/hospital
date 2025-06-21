<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkerExperience extends Model
{
    use HasFactory;

    protected $table = 'worker_experiences';
    protected $fillable = ['date_start', 'date_end', 'post', 'duties', 'company', 'worker_id'];

    protected $hidden = ['created_at', 'updated_at'];

    public function worker()
    {
        return $this->belongsTo(User::class);
    }
}
