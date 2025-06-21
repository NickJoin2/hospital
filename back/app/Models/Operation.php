<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operation extends Model
{
    use HasFactory;
    protected $table = 'operations';
    protected $fillable = ['operation_date_at', 'patient_id', 'operation_type_id', 'anesthesia_type_id', 'complication', 'post_op_care', 'notes'];

    protected $hidden = ['created_at', 'updated_at'];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    /**
     * Get the operation type for the operation.
     */
    public function operationType()
    {
        return $this->belongsTo(OperationType::class);
    }

    /**
     * Get the anesthesia type for the operation.
     */
    public function anesthesiaType()
    {
        return $this->belongsTo(AnesthesiaType::class);
    }
}
