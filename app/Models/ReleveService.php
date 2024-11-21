<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReleveService extends Model
{
    use HasFactory;


      /**
     * Relation avec le modèle ServiceRendu (Une référence appartient à un service rendu).
     */
    public function serviceRendu()
    {
        return $this->belongsTo(ServiceRendu::class);
    }
}
