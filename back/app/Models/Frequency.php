<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Frequency extends Model
{
    use HasFactory;

    protected $table = 'frequencies';
    protected $fillable = ['frequencies_name', 'frequency_description'];

    protected $hidden = ['created_at', 'updated_at'];
    public function medications()
    {
        return $this->hasMany(Medication::class);
    }
}
