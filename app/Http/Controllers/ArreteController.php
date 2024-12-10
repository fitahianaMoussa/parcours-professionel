<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreArreteRequest;
use App\Http\Requests\UpdateArreteRequest;
use App\Models\Arrete;
use Illuminate\Http\Request;

class ArreteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreArreteRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Arrete $arrete)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Arrete $arrete)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Arrete $arrete)
{
    $validated = $request->validate([
        'numero_arrete' => 'required|string',
        'date_arrete' => 'required|date',
    ]);

    $arrete->update($validated);

    return redirect()->back();
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Arrete $arrete)
    {
        //
    }
}
