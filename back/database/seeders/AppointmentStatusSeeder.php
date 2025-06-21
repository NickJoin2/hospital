<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class AppointmentStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $json = File::get(database_path('seeds\appointmentStatus.json'));

        $data = json_decode($json, true);

        foreach ($data as $item) {
            DB::table('appointment_statuses')->insert([
                'appointment_status_name' => $item['statusName'],
                'appointment_status_description' => $item['descriptionName'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
