import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    
    // Google Sheets configuration
    const GOOGLE_SHEETS_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL
    
    if (!GOOGLE_SHEETS_URL) {
      throw new Error('Google Sheets configuration missing')
    }
    
    // Format data for Google Sheets - STOP-BANG structure
    const sheetsData = {
      // Personal Information
      name: userData.name,
      age: userData.age,
      phone: userData.phone,
      gender: userData.gender,
      
      // Health Metrics  
      weight: userData.weight,
      height: userData.height,
      bmi: userData.bmi,
      
      // STOP-BANG Assessment Results (User answered questions)
      snoring: userData.snoring,                    // S - Snoring
      tiredness: userData.tiredness,                // T - Tiredness
      apnea: userData.apnea,                        // O - Observed Apnea
      bloodPressure: userData.bloodPressure,        // P - Blood Pressure
      neckCircumference: userData.neckCircumference, // N - Neck Circumference
      
      // STOP-BANG Automatic calculations (will be calculated in Apps Script)
      // B - BMI Risk (>35) - calculated from BMI
      // A - Age Risk (>50) - calculated from age  
      // G - Gender Risk (Male) - calculated from gender
      
      // Final Assessment
      totalScore: userData.totalScore,              // Total STOP-BANG Score (0-8)
      riskLevel: userData.riskLevel,
      
      // Metadata
      status: userData.status,
      submissionDateArabic: userData.submissionDateArabic,
      sessionId: userData.sessionId
    }
    
    // Submit to Google Sheets via Apps Script webhook
    const sheetsResponse = await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sheetsData),
    })
    
    if (!sheetsResponse.ok) {
      const errorData = await sheetsResponse.text()
      throw new Error(`Google Sheets API error: ${sheetsResponse.status} - ${errorData}`)
    }
    
    const result = await sheetsResponse.json()
    
    return NextResponse.json({
      success: true,
      message: 'STOP-BANG data submitted to Google Sheets successfully',
      result: result,
      score: `${userData.totalScore}/8`,
      riskLevel: userData.riskLevel,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Google Sheets submission error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
} 