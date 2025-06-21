<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Allergen extends Model
{
    use HasFactory;

    protected $table = 'allergens';
    protected $fillable = ['allergen_name', 'allergen_category_name_id'];
    protected $hidden = ['created_at', 'updated_at'];

    public function category()
    {
        return $this->belongsTo(AllergensCategory::class, 'allergen_category_name_id');
    }


    /**
     * Get the allergies for the allergen.
     */
    public function allergies()
    {
        return $this->hasMany(Allergy::class);
    }
}
