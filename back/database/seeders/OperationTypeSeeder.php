<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class OperationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(database_path('seeds\operationType.json'));

        $data = json_decode($json, true);

        foreach ($data as $item) {
            DB::table('operation_types')->insert([
                'operation_type_name' => $item['operation_type_name'],
                'operation_type_description' => $item['operation_type_description'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
