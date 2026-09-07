import { NextResponse } from 'next/server'
import { expenseService } from '@/services/expense.service'
import { expenseCreateSchema } from '@/validation/expense.schema'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const categoryId = searchParams.get('categoryId') || undefined
  const vehicleId = searchParams.get('vehicleId') || undefined
  const status = searchParams.get('status') || undefined
  const search = searchParams.get('search') || undefined

  try {
    const expenses = await expenseService.listExpenses({ categoryId, vehicleId, status, search })
    return NextResponse.json(expenses)
  } catch (error: unknown) {
    console.error('API Expenses GET error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validated = expenseCreateSchema.parse(body)
    const expense = await expenseService.createExpense(validated)
    return NextResponse.json(expense, { status: 201 })
  } catch (error: unknown) {
    console.error('API Expenses POST error:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Validation échouée' }, { status: 400 })
  }
}
