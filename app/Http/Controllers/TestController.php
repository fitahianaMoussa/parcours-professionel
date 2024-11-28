<?php


namespace App\Http\Controllers;

use App\Events\TestNotificationEvent;
use Illuminate\Http\Request;

class TestController extends Controller
{
    public function triggerEvent()
    {
        broadcast(new TestNotificationEvent('Pusher est configuré correctement !'));
        return response()->json(['message' => 'Événement diffusé avec succès']);
    }
}
