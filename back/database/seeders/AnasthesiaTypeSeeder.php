<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class AnasthesiaTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(database_path('seeds\anasthesiaType.json'));

        $data = json_decode($json, true);

        foreach ($data as $item) {
            DB::table('anesthesia_types')->insert([
                'anesthesia_name' => $item['anasthesiaName'],
                'anesthesia_description' => $item['anasthesiaDescription'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
