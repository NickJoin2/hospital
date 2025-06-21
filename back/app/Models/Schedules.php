<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedules extends Model
{
    use HasFactory;

    protected $table = 'schedules';
    protected $fillable = ['start_time_at', 'end_time_at', 'day_id', 'doctor_id', 'room'];

    protected $hidden = ['created_at', 'updated_at'];

    public function day()
    {
        return $this->belongsTo(Day::class);
    }


    public function doctor()
    {
        return $this->belongsTo(User::class);
    }
}
