<?php

namespace App\Http\Controllers;

use App\Models\DiagnoseMedication;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DiagnoseMedicationController extends Controller
{
    public function createDiagnoseMedication(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'diagnose_id' => ['required', 'integer', 'exists:diagnoses,id'],
            'medication_id' => ['required', 'integer', 'exists:medications,id'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment = DiagnoseMedication::create([
            'diagnose_id' => $request->input('diagnose_id'),
            'medications' => $request->input('medications'),
        ]);

        return response()->json($appointment, 201);
    }





    public function diagnoseMedicationsAll()
    {
        return response()->json(DiagnoseMedication::all());
    }

    public function diagnoseMedicationUpdate(Request $request, DiagnoseMedication $operation)
    {
        $validator = Validator::make($request->all(), [
            'diagnose_id' => ['nullable', 'integer', 'exists:diagnoses,id'],
            'medication_id' => ['nullable', 'integer', 'exists:medications,id'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only([
            'diagnose_id',
            'medication_id',
        ]);

        $operation->update($data);

        return response()->json($operation);
    }

    public function diagnoseMedicationDelete(DiagnoseMedication $id)
    {
        $id->delete();

        return response()->json([
            'message' => 'Запись успешно удаленна'
        ]);
    }
}
