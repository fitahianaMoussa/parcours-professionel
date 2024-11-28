<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;

class Agent extends Model
{
    use HasFactory,Notifiable;

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
    public function avenants()
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

    public function serviceRendus()
    {
        return $this->hasMany(ServiceRendu::class);
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

     // An agent belongs to a user
     public function user()
     {
         return $this->belongsTo(User::class);
     }

       // Méthodes utilitaires
       public function getContratActif()
       {
           return $this->contrats()
               ->orderBy('date_debut', 'desc') // Order by date_debut in descending order
               ->first();
       }
       

    public function getAvancementActuel()
    {
        return $this->avancements()
            ->orderBy('date_effet', 'desc')
            ->first();
    }

    public function getServiceActuel()
    {
        return $this->serviceRendus()
            ->where('status', 'active')
            ->orderBy('date_debut', 'desc')
            ->first();
    }



    public function getDetailsComplets()
    {
        $contratActif = $this->getContratActif();
        $avancementActuel = $this->getAvancementActuel();
        $serviceActuel = $this->getServiceActuel();
    
        return [
            'informations_personnelles' => [
                'nom' => $this->nom,
                'prenom' => $this->prenom,
                'date_entree' => $this->date_entree instanceof Carbon ? $this->date_entree->format('d/m/Y') : Carbon::parse($this->date_entree)->format('d/m/Y'),
                'categorie' => $this->categorie?->nom,
                'type_recrutement' => $this->type_recrutement,
                'diplome' => $this->diplome,
                'corps' => $this->corps,
                'chapitre_budgetaire' => $this->chapitre_budgetaire,
                'indice' => $this->indice,
                'statut' => $this->is_active ? 'Actif' : 'Inactif'
            ],
            'contrat_actuel' => $contratActif ? [
                'type' => $contratActif->type,
                'numero_contrat' => $contratActif->numero_contrat,
                'date_debut' => $contratActif->date_debut instanceof Carbon ? $contratActif->date_debut->format('d/m/Y') : Carbon::parse($contratActif->date_debut)->format('d/m/Y'),
                'date_fin' => $contratActif->date_fin ? ($contratActif->date_fin instanceof Carbon ? $contratActif->date_fin->format('d/m/Y') : Carbon::parse($contratActif->date_fin)->format('d/m/Y')) : null,
                'status' => $contratActif->status,
                'renouvele' => $contratActif->is_renouvele,
                'date_renouvellement' => $contratActif->date_renouvellement ? ($contratActif->date_renouvellement instanceof Carbon ? $contratActif->date_renouvellement->format('d/m/Y') : Carbon::parse($contratActif->date_renouvellement)->format('d/m/Y')) : null
            ] : null,
            'avancement_actuel' => $avancementActuel ? [
                'grade' => $avancementActuel->grade->grade,
                'echelon' => $avancementActuel->echelon,
                'date_effet' => $avancementActuel->date_effet instanceof Carbon ? $avancementActuel->date_effet->format('d/m/Y') : Carbon::parse($avancementActuel->date_effet)->format('d/m/Y'),
                'date_fin' => $avancementActuel->date_fin instanceof Carbon ? $avancementActuel->date_fin->format('d/m/Y') : Carbon::parse($avancementActuel->date_fin)->format('d/m/Y'),
                'index_value' => $avancementActuel->index_value
            ] : null,
            'service_actuel' => $serviceActuel ? [
                'poste_occupe' => $serviceActuel->poste_occupe,
                'lieu' => $serviceActuel->lieu,
                'date_debut' => $serviceActuel->date_debut instanceof Carbon ? $serviceActuel->date_debut->format('d/m/Y') : Carbon::parse($serviceActuel->date_debut)->format('d/m/Y'),
                'reference' => [
                    'numero' => $serviceActuel->reference->numero,
                    'type' => $serviceActuel->reference->type,
                    'date' => $serviceActuel->reference->date_reference instanceof Carbon ? $serviceActuel->reference->date_reference->format('d/m/Y') : Carbon::parse($serviceActuel->reference->date_reference)->format('d/m/Y')
                ]
            ] : null,
            'historique' => [
                'contrats' => $this->contrats()
                    ->with('arrete')
                    ->orderBy('date_debut', 'desc')
                    ->get(),
                'avancements' => $this->avancements()
                    ->with(['grade', 'arrete'])
                    ->orderBy('date_effet', 'desc')
                    ->get(),
                'services' => $this->serviceRendus()
                    ->with('reference')
                    ->orderBy('date_debut', 'desc')
                    ->get()
            ]
        ];
    }
    

    // Scopes utiles
    public function scopeActifs($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeParCategorie($query, $categorieId)
    {
        return $query->where('categorie_id', $categorieId);
    }

    public function scopeParTypeRecrutement($query, $type)
    {
        return $query->where('type_recrutement', $type);
    }
}
