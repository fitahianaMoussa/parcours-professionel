<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServiceRendu extends Model
{
    use HasFactory;

    protected $fillable = [
        'agent_id', 
        'poste_occupe', 
        'lieu', 
        'date_debut', 
        'date_fin', 
        'status',
        'reference_id'
    ];

        /**
     * Relation avec le modèle Agent (Un service rendu appartient à un agent).
     */
    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

      /**
     * Relation avec le modèle Reference.
     */
    public function reference()
    {
        return $this->belongsTo(ReferencesReglementaire::class, 'reference_id');
    }
}
