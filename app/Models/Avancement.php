<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Avancement extends Model
{
    use HasFactory;


     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'agent_id',
        'grade_id',
        'arrete_id',
        'duree_mois',
        'date_debut',
        'date_effet',
        'date_fin',
        'is_integration',
        'echelon',
        'contract_phase',
        'status',
        'index_value',
        'contract_renewal_date',
    ];

    public function arrete()
    {
        return $this->belongsTo(Arrete::class);
    }

    public function grade()
    {
        return $this->belongsTo(Grade::class);
    }

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }
}
