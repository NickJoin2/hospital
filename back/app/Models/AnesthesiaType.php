<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnesthesiaType extends Model
{
    use HasFactory;

    protected $table = 'anesthesia_types';
    protected $fillable = ['anesthesia_name', 'anesthesia_description'];

    protected $hidden = ['created_at', 'updated_at'];

    public function operations()
    {
        return $this->hasMany(Operation::class);
    }
}
