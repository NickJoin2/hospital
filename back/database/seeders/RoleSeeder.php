<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(database_path('seeds\roles.json'));

        $data = json_decode($json, true);

        foreach ($data as $item) {
            DB::table('roles')->insert([
                'role_name' => $item['roleName'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
