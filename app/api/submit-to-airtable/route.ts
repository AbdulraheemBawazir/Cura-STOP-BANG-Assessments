import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    
    // Airtable configuration
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID
    const AIRTABLE_TABLE_NAME = 'Consultations' // or your table name
    
    if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
      throw new Error('Airtable configuration missing')
    }
    
    // Format data for Airtable
    const airtableData = {
      records: [
        {
          fields: {
            // Personal Information
            'Name': userData.name,
            'Age': parseInt(userData.age),
            'Phone': userData.phone,
            'Gender': userData.gender,
            
            // Health Metrics
            'Weight (kg)': parseFloat(userData.weight),
            'Height (cm)': parseFloat(userData.height),
            'BMI': parseFloat(userData.bmi),
            'BMI Category': userData.bmiCategory,
            
            // Assessment Results
            'Snoring': userData.snoring,
            'Tiredness': userData.tiredness,
            'Observed Apnea': userData.apnea,
            'Blood Pressure': userData.bloodPressure,
            'Neck Circumference': userData.neckCircumference,
            'Age Risk': userData.ageRisk,
            'BMI Risk': userData.bmiRisk,
            'Gender Risk': userData.genderRisk,
            
            // Risk Assessment
            'Total Score': userData.totalScore,
            'Risk Level': userData.riskLevel,
            'Risk Category': userData.riskCategory,
            'Priority': userData.priority,
            
            // Metadata
            'Submission Date': userData.submissionDate,
            'Submission Date Arabic': userData.submissionDateArabic,
            'Platform': userData.platform,
            'Source': userData.source,
            'Status': userData.status,
            'Consultation Type': userData.consultationType,
            'Follow Up Needed': userData.followUpNeeded,
            'Session ID': userData.sessionId,
            
            // Contact Info
            'Preferred Contact Time': userData.preferredContactTime,
            
            // Tracking
            'User Agent': userData.userAgent,
            'Referrer': userData.referrer
          }
        }
      ]
    }
    
    // Submit to Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(airtableData),
      }
    )
    
    if (!airtableResponse.ok) {
      const errorData = await airtableResponse.text()
      throw new Error(`Airtable API error: ${airtableResponse.status} - ${errorData}`)
    }
    
    const result = await airtableResponse.json()
    
    return NextResponse.json({
      success: true,
      message: 'Data submitted to Airtable successfully',
      recordId: result.records[0]?.id,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Airtable submission error:', error)
    
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