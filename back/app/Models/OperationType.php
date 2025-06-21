<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OperationType extends Model
{
    use HasFactory;

    protected $table = 'operation_types';
    protected $fillable = ['operation_type_name', 'operation_type_description'];

    protected $hidden = ['created_at', 'updated_at'];

    public function operations()
    {
        return $this->hasMany(Operation::class);
    }
}
