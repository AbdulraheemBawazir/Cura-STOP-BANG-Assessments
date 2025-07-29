import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // Sample test data
    const testData = {
      // Personal Information
      name: "أحمد محمد العلي",
      age: "45",
      phone: "0501234567",
      gender: "ذكر",
      
      // Health Metrics
      weight: "85",
      height: "175",
      bmi: "27.8",
      bmiCategory: "زيادة في الوزن",
      
      // Questionnaire Answers
      snoring: "نعم",
      tiredness: "نعم",
      apnea: "لا",
      bloodPressure: "نعم",
      neckCircumference: "نعم",
      
      // Calculated Risk Factors
      ageRisk: "لا",
      bmiRisk: "لا",
      genderRisk: "نعم",
      
      // Final Assessment
      totalScore: 5,
      maxScore: 8,
      riskLevel: "متوسط",
      riskCategory: "احتمالية متوسطة لانقطاع التنفس أثناء النوم",
      
      // Metadata
      submissionDate: new Date().toISOString(),
      submissionDateArabic: new Date().toLocaleDateString("ar-SA"),
      platform: "منصة كيورا الطبية",
      source: "STOP-BANG Assessment - TEST",
      status: "طلب استشارة جديد - اختبار",
      priority: "متوسط",
      
      // Contact preferences
      preferredContactTime: "خلال ساعات العمل",
      consultationType: "استشارة مجانية أولية",
      followUpNeeded: "نعم",
      
      // Additional tracking
      sessionId: `TEST-${Date.now()}`,
      userAgent: 'Test User Agent',
      referrer: 'test'
    }

    // Test all submission methods
    const testResults = {
      airtable: { status: 'pending', message: '', error: null as string | null },
      googleSheets: { status: 'pending', message: '', error: null as string | null },
      email: { status: 'pending', message: '', error: null as string | null }
    }

    // Test Airtable
    try {
      const airtableResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/submit-to-airtable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      })
      
      if (airtableResponse.ok) {
        const result = await airtableResponse.json()
        testResults.airtable = { 
          status: 'success', 
          message: `Record created: ${result.recordId}`, 
          error: null 
        }
      } else {
        const error = await airtableResponse.text()
        testResults.airtable = { 
          status: 'error', 
          message: '', 
          error: `HTTP ${airtableResponse.status}: ${error}` 
        }
      }
    } catch (error) {
      testResults.airtable = { 
        status: 'error', 
        message: '', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }

    // Test Google Sheets
    try {
      const sheetsResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/submit-to-sheets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      })
      
      if (sheetsResponse.ok) {
        testResults.googleSheets = { 
          status: 'success', 
          message: 'Data added to Google Sheets successfully', 
          error: null 
        }
      } else {
        const error = await sheetsResponse.text()
        testResults.googleSheets = { 
          status: 'error', 
          message: '', 
          error: `HTTP ${sheetsResponse.status}: ${error}` 
        }
      }
    } catch (error) {
      testResults.googleSheets = { 
        status: 'error', 
        message: '', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }

    // Test Email
    try {
      const emailResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
      })
      
      if (emailResponse.ok) {
        const result = await emailResponse.json()
        testResults.email = { 
          status: 'success', 
          message: `Email sent: ${result.emailId}`, 
          error: null 
        }
      } else {
        const error = await emailResponse.text()
        testResults.email = { 
          status: 'error', 
          message: '', 
          error: `HTTP ${emailResponse.status}: ${error}` 
        }
      }
    } catch (error) {
      testResults.email = { 
        status: 'error', 
        message: '', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }

    // Calculate success rate
    const successCount = Object.values(testResults).filter(r => r.status === 'success').length
    const totalTests = Object.keys(testResults).length
    
    return NextResponse.json({
      success: successCount > 0,
      testResults: testResults,
      summary: {
        successful: successCount,
        total: totalTests,
        successRate: `${Math.round((successCount / totalTests) * 100)}%`
      },
      testData: testData,
      timestamp: new Date().toISOString(),
      recommendations: generateRecommendations(testResults)
    })

  } catch (error) {
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

function generateRecommendations(testResults: any) {
  const recommendations = []

  if (testResults.airtable.status === 'error') {
    recommendations.push({
      service: 'Airtable',
      issue: testResults.airtable.error,
      solution: 'Check your AIRTABLE_API_KEY and AIRTABLE_BASE_ID in .env.local file'
    })
  }

  if (testResults.googleSheets.status === 'error') {
    recommendations.push({
      service: 'Google Sheets',
      issue: testResults.googleSheets.error,
      solution: 'Verify your GOOGLE_SHEETS_WEBHOOK_URL is correct and the Apps Script is deployed'
    })
  }

  if (testResults.email.status === 'error') {
    recommendations.push({
      service: 'Email',
      issue: testResults.email.error,
      solution: 'Check your EMAIL_API_KEY and EMAIL_SERVICE_URL configuration'
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      service: 'All Services',
      issue: 'No issues detected',
      solution: 'Your configuration is working perfectly! 🎉'
    })
  }

  return recommendations
} 