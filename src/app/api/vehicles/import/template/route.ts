import { NextResponse } from 'next/server'
import { vehicleImportService } from '@/services/vehicle-import.service'

export async function GET() {
  try {
    const buffer = vehicleImportService.generateTemplateWorkbook()

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="modele_import_vehicules_maalal.xlsx"',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error: unknown) {
    console.error('Error generating vehicle import template:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur lors de la génération du modèle' },
      { status: 500 }
    )
  }
}
