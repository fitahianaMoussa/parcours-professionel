<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    use HasFactory;

    protected $fillable = [
        'matricule',
        'nom',
        'prenom',
        'date_de_naissance',
        'date_entree',
        'categorie_id',
        'type_recrutement',
        'diplome',
        'corps',
        'chapitre_budgetaire',
        'is_active',
        'status',
        'retirement_date',
        'contrat_renouvelable', // Ajouté pour éviter l'erreur
    ];

    protected $dates = [
        'date_entree',
        'date_de_naissance',
        'retirement_date',
    ];

    // Relations
    public function avancements()
    {
        return $this->hasMany(Avancement::class);
    }

    public function contrats()
    {
        return $this->hasMany(Contrat::class);
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function reclassements()
    {
        return $this->hasMany(Reclassement::class);
    }

   // Scope : Agents approchant la retraite (par défaut 5 ans avant l'âge de la retraite)
   public function scopeApproachingRetirement($query, $yearsUntilRetirement = 5)
   {
       $retirementAge = 60; // Âge de retraite standard
       $thresholdDate = now()->subYears($retirementAge - $yearsUntilRetirement);

       return $query->where('date_de_naissance', '<=', $thresholdDate);
   }

   // Vérifie si l'agent approche la retraite (méthode d'instance)
   public function isApproachingRetirement($yearsUntilRetirement = 0)
   {
       $retirementAge = 60; // Âge de retraite standard
       $age = Carbon::now()->diffInYears($this->date_de_naissance);

       return $age >= ($retirementAge - $yearsUntilRetirement);
   }
    // Vérifie si un agent est en phase d'intégration
    public function estDansPhaseIntegration()
    {
        return $this->date_entree->diffInYears(now()) < 6;
    }

    // Vérifie si un agent peut être reclassé
    public function peutEtreReclasse()
    {
        return $this->estDansPhaseIntegration() && $this->contrat_renouvelable;
    }

    // Met à jour l'agent comme étant en retraite
    public function initiateRetirement()
    {
        $this->update([
            'retirement_date' => now(),
            'status' => 'retraite',
        ]);
    }
}
