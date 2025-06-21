<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class WorkerController extends Controller
{
    public function workersAll() {

        $worker = User::all();

        $worker->load([
            'department',
            'role'
        ]);

        return response()->json($worker);
    }

    public function workerDelete(User $id) {
        $id->delete();

        return response()->json([
            'message' => 'Запись успешно удаленна'
        ]);
    }


    public function workerProfile(Request $request) {

        $auth = Auth::user();

        $user = User::find($auth->id);

        $user->load([
            'department',
            'role',
            'workerEducation' => function ($query) {
                $query->with('specialization');
                $query->with('educationLevel');
            },
            'workerExperiences'
        ]);

        return response()->json($user);
    }

    public function workerShow(User $id) {
        $id->load([
            'department',
            'role',
            'workerEducation' => function ($query) {
                $query->with('specialization');
                $query->with('educationLevel');
            },
            'workerExperiences'
        ]);

        return response()->json($id);
    }




    public function updateWorkerAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();
        $worker = User::find($user->id);

        if (!$worker) {
            return response()->json([
                'message' => 'Worker not found'
            ], 404);
        }

        $originalExtension = $request->file('avatar')->getClientOriginalExtension();
        $fileName = time() . '_' . Str::random(16) . '.' . $originalExtension;

        $filePath = $request->file('avatar')->storeAs('avatarsWorkers', $fileName, 'public');

        if ($worker->avatar) {
            $oldFilePath = str_replace(asset('storage/'), '', $worker->avatar); // Удаляем префикс URL
            Storage::disk('public')->delete($oldFilePath);
        }

        $avatarUrl = asset('storage/' . $filePath);

        $worker->avatar = $avatarUrl;
        $worker->save();

        return response()->json([
            'message' => 'Avatar updated successfully',
            'worker' => $worker,
        ], 200);
    }

    public function getWorkerAvatar()
    {
        $user = Auth::user();
        $worker = User::find($user->id);

        if (!$worker) {
            return response()->json([
                'message' => 'Worker not found'
            ], 404);
        }

        if (!$worker->avatar) {
            return response()->json([
                'message' => 'No avatar available for this worker'
            ], 404);
        }

        // Проверяем, существует ли файл в хранилище
        $filePath = str_replace(asset('storage/'), '', $worker->avatar);
        if (!Storage::disk('public')->exists($filePath)) {
            return response()->json([
                'message' => 'Avatar file not found'
            ], 404);
        }

        // Возвращаем URL аватара
        return response()->json([
            'message' => 'Avatar retrieved successfully',
            'avatar_url' => $worker->avatar
        ], 200);
    }

}
