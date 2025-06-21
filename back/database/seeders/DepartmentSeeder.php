<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(database_path('seeds\departments.json'));

        $data = json_decode($json, true);

        foreach ($data as $item) {
            DB::table('departments')->insert([
                'department_name' => $item['departmentName'],
                'department_description' => $item['departmentDescription'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
