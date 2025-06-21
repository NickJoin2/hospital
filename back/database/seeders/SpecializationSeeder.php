<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class SpecializationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(database_path('seeds\specialization.json'));

        $data = json_decode($json, true);

        foreach ($data as $item) {
            DB::table('specializations')->insert([
                'specialization_code' => $item['code'],
                'specialization_name' => $item['specialization'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
