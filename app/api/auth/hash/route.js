import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request) {
  try {
    const { password } = await request.json()
    
    // Générer un sel aléatoire
    const salt = crypto.randomBytes(16).toString('hex')
    
    // Hasher le mot de passe avec PBKDF2
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    
    return NextResponse.json({ hash, salt })
  } catch (error) {
    console.error('Erreur lors du hachage:', error)
    return NextResponse.json(
      { error: 'Erreur lors du hachage du mot de passe' },
      { status: 500 }
    )
  }
} 