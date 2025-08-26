<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Or implement your authorization logic
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required', 
                'string', 
                'email', 
                'max:255', 
                Rule::unique('users')->ignore($this->user()->id)
            ],
            'profile_photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'company_logo' => ['nullable', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'password' => ['nullable', 'confirmed', 'min:8'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Your full name is required',
            'email.required' => 'We need your email address',
            'email.unique' => 'This email is already in use',
            'profile_photo.image' => 'Please upload a valid image file',
            'company_logo.max' => 'Logo may not be larger than 2MB',
            'password.confirmed' => 'Password confirmation does not match'
        ];
    }
}