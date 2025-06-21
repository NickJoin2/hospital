<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $this->call(AllergenCategorySeeder::class);
        $this->call(AnasthesiaTypeSeeder::class);
        $this->call(AppointmentStatusSeeder::class);
        $this->call(DaySeeder::class);
        $this->call(DepartmentSeeder::class);
        $this->call(EducationLevelSeeder::class);
        $this->call(FrequencySeeder::class);
        $this->call(MedicineNameSeeder::class);
        $this->call(OperationTypeSeeder::class);
        $this->call(RoleSeeder::class);
        $this->call(SeveritySeeder::class);
        $this->call(SpecializationSeeder::class);
    }
}
