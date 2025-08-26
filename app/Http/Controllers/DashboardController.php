<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            // Data untuk dashboard utama
        ]);
    }

    public function financial()
    {
        return Inertia::render('Dashboard/Financial', [
            // Data untuk dashboard keuangan
        ]);
    }

    public function analytics()
    {
        return Inertia::render('Dashboard/Analytics', [
            // Data untuk dashboard analitik
        ]);
    }

    public function manageDashboards()
    {
        return Inertia::render('Dashboard/Manage', [
            // Data untuk halaman manajemen dashboard
        ]);
    }

    public function createDashboard()
    {
        return Inertia::render('Dashboard/Create', [
            // Data untuk halaman pembuatan dashboard
        ]);
    }
}