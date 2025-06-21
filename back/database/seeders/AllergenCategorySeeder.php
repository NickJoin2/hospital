<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class AllergenCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(database_path('seeds\allergenCategory.json'));

        $data = json_decode($json, true);

        foreach ($data as $item) {
            DB::table('allergens_categories')->insert([
                'allergen_category_name' => $item['allergen_category_name'],
                'allergen_category_description' => $item['allergen_category_description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
