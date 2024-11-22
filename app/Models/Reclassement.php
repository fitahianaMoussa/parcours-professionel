<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reclassement extends Model
{
    use HasFactory;

    protected $fillable = ['agent_id', 'ancienne_categorie_id', 'nouvelle_categorie_id', 'date_reclassement'];

    // Relation avec l'Agent
    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    // Relation avec l'ancienne catégorie
    public function ancienneCategorie()
    {
        return $this->belongsTo(Categorie::class, 'ancienne_categorie_id');
    }

    // Relation avec la nouvelle catégorie
    public function nouvelleCategorie()
    {
        return $this->belongsTo(Categorie::class, 'nouvelle_categorie_id');
    }
}
