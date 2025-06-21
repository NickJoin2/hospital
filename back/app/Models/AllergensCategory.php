<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllergensCategory extends Model
{
    use HasFactory;

    protected $table = 'allergens_categories';
    protected $fillable = ['allergen_category_name', 'allergen_category_description'];

    protected $hidden = ['created_at', 'updated_at'];

    public function allergens()
    {
        return $this->hasMany(Allergen::class);
    }
}
