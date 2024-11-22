<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    use HasFactory;

    public function agents()
    {
        return $this->hasMany(Agent::class);
    }


    public function reclassementsAncien()
    {
        return $this->hasMany(Reclassement::class, 'ancienne_categorie_id');
    }

    public function reclassementsNouveau()
    {
        return $this->hasMany(Reclassement::class, 'nouvelle_categorie_id');
    }
}
