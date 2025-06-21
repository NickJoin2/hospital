<?php

namespace App\Models;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements MustVerifyEmail, JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'users';

    protected $fillable = ['first_name', 'middle_name', 'last_name','email', 'password','phone', 'avatar', 'fired_at', 'credited_at', 'department_id', 'role_id'];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }


    public function refreshTokens()
    {
        return $this->hasMany(RefreshToken::class);
    }

    public function validRefreshTokens()
    {
        return $this->hasMany(RefreshToken::class)
            ->where('expires_at', '>', now());
    }

    public function hasRole($role)
    {
        return $this->role && $this->role->role_name === $role;
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function workerEducation() {
        return $this->hasMany(WorkerEducation::class, 'worker_id');
    }

    public function workerExperiences()
    {
        return $this->hasMany(WorkerExperience::class, 'worker_id');
    }

    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }


    protected $hidden = [
        'password',
        'remember_token',
        'updated_at'
    ];


    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
}
