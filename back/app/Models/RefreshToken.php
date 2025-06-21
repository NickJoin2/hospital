<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RefreshToken extends Model
{
    use HasFactory;

    protected $table = 'refresh_tokens';
    protected $casts = [
        'expires_at' => 'datetime'
    ];

    protected $fillable = [
        'user_id',
        'token',
        'jti',
        'expires_at',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
