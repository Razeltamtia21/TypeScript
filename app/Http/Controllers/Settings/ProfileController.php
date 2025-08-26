<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        // Debug: Log semua informasi request
        \Log::info('=== PROFILE UPDATE DEBUG START ===');
        \Log::info('Request method: ' . $request->method());
        \Log::info('Request headers:', $request->headers->all());
        \Log::info('Request data:', $request->all());
        \Log::info('Request files:', $request->allFiles());
        \Log::info('Validated data:', $data);
        \Log::info('User before update:', $user->toArray());

        // Cek apakah request memiliki file profile_photo
        $hasProfilePhoto = $request->hasFile('profile_photo');
        \Log::info('Has profile_photo file: ' . ($hasProfilePhoto ? 'YES' : 'NO'));

        if ($hasProfilePhoto) {
            $file = $request->file('profile_photo');
            \Log::info('Profile photo file details:', [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'is_valid' => $file->isValid(),
                'error' => $file->getError(),
                'path' => $file->getRealPath(),
                'extension' => $file->getClientOriginalExtension()
            ]);

            // Cek apakah file valid dan dapat dibaca
            if ($file->isValid()) {
                \Log::info('✅ Profile photo file is valid');

                // Hapus foto lama jika ada
                if ($user->profile_photo) {
                    $deleted = \Storage::disk('public')->delete($user->profile_photo);
                    \Log::info('Deleted old profile photo: ' . $user->profile_photo . ' - Success: ' . ($deleted ? 'YES' : 'NO'));
                }

                try {
                    // Simpan file baru
                    $path = $file->store('profile_photos', 'public');
                    $data['profile_photo'] = $path;

                    \Log::info('✅ New profile photo saved:', [
                        'path' => $path,
                        'full_path' => storage_path('app/public/' . $path),
                        'exists_in_storage' => \Storage::disk('public')->exists($path),
                        'file_size_in_storage' => \Storage::disk('public')->size($path),
                        'url' => \Storage::disk('public')->url($path)
                    ]);
                } catch (\Exception $e) {
                    \Log::error('❌ Error saving profile photo: ' . $e->getMessage());
                }
            } else {
                \Log::error('❌ Profile photo file is not valid. Error code: ' . $file->getError());
            }
        } else {
            \Log::info('ℹ️ No profile photo file in request');
            // Jangan hapus profile_photo dari data jika tidak ada file baru
            if (isset($data['profile_photo'])) {
                unset($data['profile_photo']);
            }
        }

        // Handle company logo (untuk perbandingan)
        $hasCompanyLogo = $request->hasFile('company_logo');
        \Log::info('Has company_logo file: ' . ($hasCompanyLogo ? 'YES' : 'NO'));

        if ($hasCompanyLogo) {
            $file = $request->file('company_logo');
            \Log::info('Company logo file details:', [
                'original_name' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
                'is_valid' => $file->isValid(),
                'error' => $file->getError()
            ]);

            if ($file->isValid()) {
                // Hapus logo lama jika ada
                if ($user->company_logo) {
                    $deleted = \Storage::disk('public')->delete($user->company_logo);
                    \Log::info('Deleted old company logo: ' . $user->company_logo . ' - Success: ' . ($deleted ? 'YES' : 'NO'));
                }

                try {
                    $path = $file->store('company_logos', 'public');
                    $data['company_logo'] = $path;

                    \Log::info('✅ New company logo saved:', [
                        'path' => $path,
                        'exists_in_storage' => \Storage::disk('public')->exists($path),
                        'url' => \Storage::disk('public')->url($path)
                    ]);
                } catch (\Exception $e) {
                    \Log::error('❌ Error saving company logo: ' . $e->getMessage());
                }
            }
        } else {
            if (isset($data['company_logo'])) {
                unset($data['company_logo']);
            }
        }

        // Debug: Data yang akan disimpan
        \Log::info('Final data for update:', $data);

        // Update user
        try {
            $user->fill($data);

            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            // Log perubahan yang akan disimpan
            \Log::info('User changes to be saved:', $user->getDirty());

            $saved = $user->save();
            \Log::info('User save result: ' . ($saved ? 'SUCCESS' : 'FAILED'));

            if ($saved) {
                // Verify data setelah disimpan
                $freshUser = $user->fresh();
                \Log::info('User data after save:', [
                    'id' => $freshUser->id,
                    'name' => $freshUser->name,
                    'email' => $freshUser->email,
                    'profile_photo' => $freshUser->profile_photo,
                    'company_logo' => $freshUser->company_logo,
                    'updated_at' => $freshUser->updated_at
                ]);

                // Cek apakah file benar-benar ada di storage
                if ($freshUser->profile_photo) {
                    $fileExists = \Storage::disk('public')->exists($freshUser->profile_photo);
                    $fileUrl = asset('storage/' . $freshUser->profile_photo);
                    \Log::info('Profile photo verification:', [
                        'path' => $freshUser->profile_photo,
                        'exists' => $fileExists,
                        'url' => $fileUrl
                    ]);
                }

                if ($freshUser->company_logo) {
                    $fileExists = \Storage::disk('public')->exists($freshUser->company_logo);
                    $fileUrl = asset('storage/' . $freshUser->company_logo);
                    \Log::info('Company logo verification:', [
                        'path' => $freshUser->company_logo,
                        'exists' => $fileExists,
                        'url' => $fileUrl
                    ]);
                }
            }
        } catch (\Exception $e) {
            \Log::error('❌ Error updating user: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
        }

        \Log::info('=== PROFILE UPDATE DEBUG END ===');

        return to_route('profile.edit')->with('status', 'profile-updated');
    }

    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        // Hapus file foto profil dan logo perusahaan sebelum menghapus user
        if ($user->profile_photo) {
            Storage::disk('public')->delete($user->profile_photo);
        }

        if ($user->company_logo) {
            Storage::disk('public')->delete($user->company_logo);
        }

        Auth::logout();
        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
