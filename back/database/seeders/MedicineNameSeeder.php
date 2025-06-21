<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class MedicineNameSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(database_path('seeds\medicineName.json'));

        $data = json_decode($json, true);

        foreach ($data as $item) {
            DB::table('medicines_names')->insert([
                'medicine_name' => $item['medicine_name'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
