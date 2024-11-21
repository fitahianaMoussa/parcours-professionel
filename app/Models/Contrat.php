<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contrat extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id',
        'type',
        'date_debut',
        'date_fin',
        'numero_contrat',
        'status',
        'date_renouvellement',
    ];

    public function arrete()
{
    return $this->hasOne(Arrete::class);
}

public function Agent()
{
    return $this->belongsTo(Agent::class);
}
}
