import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/session'
import { vehicleImportService } from '@/services/vehicle-import.service'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const sessionUser = await getServerSession()
    if (!sessionUser) {
      return NextResponse.json({ error: 'Non authentifié. Connexion requise.' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const dryRun = formData.get('dryRun') === 'true'
    const defaultParkId = (formData.get('parkId') as string) || undefined

    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: 'Veuillez sélectionner un fichier Excel (.xlsx, .xls) ou CSV valide.' },
        { status: 400 }
      )
    }

    const filename = file.name.toLowerCase()
    const isValidSpreadsheet =
      filename.endsWith('.xlsx') ||
      filename.endsWith('.xls') ||
      filename.endsWith('.xsl') ||
      filename.endsWith('.csv') ||
      file.type.includes('sheet') ||
      file.type.includes('excel') ||
      file.type.includes('csv')

    if (!isValidSpreadsheet) {
      return NextResponse.json(
        {
          error:
            'Format de fichier non pris en charge. Veuillez fournir un fichier Excel (.xlsx, .xls) ou .csv.',
        },
        { status: 400 }
      )
    }

    // Convert to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 1. Parse spreadsheet
    const { rows, sheetNames } = vehicleImportService.parseSpreadsheet(buffer)

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Le fichier sélectionné ne contient aucune ligne de données de véhicules.' },
        { status: 400 }
      )
    }

    // 2. Validate rows
    const validation = await vehicleImportService.validateRows(rows, { defaultParkId })

    // 3. If preview/dry-run requested, return validation results without committing
    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        sheetNames,
        validation,
      })
    }

    // 4. Commit import of valid rows
    if (validation.validRows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Aucun véhicule valide n’a pu être extrait. Veuillez corriger les erreurs signalées dans le fichier.',
          validation,
        },
        { status: 422 }
      )
    }

    const importResult = await vehicleImportService.importVehicles(validation.validRows, {
      userId: sessionUser.id,
      defaultParkId,
    })

    return NextResponse.json({
      success: importResult.success,
      validation,
      importResult,
    })
  } catch (error: unknown) {
    console.error('Vehicle bulk import error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Une erreur inattendue est survenue lors de l’importation du fichier.',
      },
      { status: 500 }
    )
  }
}
