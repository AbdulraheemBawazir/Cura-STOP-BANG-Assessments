import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()
    
    // Email configuration
    const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL // e.g., SendGrid, Resend, etc.
    const EMAIL_API_KEY = process.env.EMAIL_API_KEY
    const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'healthcare@airliquide.com'
    const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@cura-medical.com'
    
    if (!EMAIL_API_KEY) {
      throw new Error('Email service configuration missing')
    }
    
    // Create comprehensive email content
    const emailSubject = `🏥 طلب استشارة جديد - ${userData.name} (${userData.priority} أولوية)`
    
    const emailHTML = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>طلب استشارة جديد</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #3498db, #2980b9); color: white; padding: 20px; text-align: center; }
            .priority-high { background: linear-gradient(135deg, #e74c3c, #c0392b); }
            .priority-medium { background: linear-gradient(135deg, #f39c12, #e67e22); }
            .content { padding: 30px; }
            .section { margin-bottom: 25px; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db; background: #f8f9fa; }
            .risk-high { border-left-color: #e74c3c; background: #fff5f5; }
            .risk-medium { border-left-color: #f39c12; background: #fffbf0; }
            .risk-low { border-left-color: #27ae60; background: #f0fff4; }
            .data-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
            .data-item { background: white; padding: 12px; border-radius: 6px; border: 1px solid #eee; }
            .label { font-weight: bold; color: #2c3e50; margin-bottom: 5px; }
            .value { color: #34495e; }
            .score-display { text-align: center; background: #ecf0f1; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .score-number { font-size: 48px; font-weight: bold; color: #2980b9; }
            .cta-button { display: inline-block; background: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { background: #34495e; color: white; padding: 15px; text-align: center; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header ${userData.priority === 'عالي' ? 'priority-high' : userData.priority === 'متوسط' ? 'priority-medium' : ''}">
                <h1>🏥 طلب استشارة جديد</h1>
                <p>منصة كيورا الطبية - تقييم اضطرابات النوم</p>
                <p><strong>تاريخ الطلب:</strong> ${userData.submissionDateArabic}</p>
            </div>
            
            <div class="content">
                <!-- Patient Information -->
                <div class="section">
                    <h3>📋 معلومات المريض</h3>
                    <div class="data-grid">
                        <div class="data-item">
                            <div class="label">الاسم</div>
                            <div class="value">${userData.name}</div>
                        </div>
                        <div class="data-item">
                            <div class="label">العمر</div>
                            <div class="value">${userData.age} سنة</div>
                        </div>
                        <div class="data-item">
                            <div class="label">رقم الهاتف</div>
                            <div class="value">${userData.phone}</div>
                        </div>
                        <div class="data-item">
                            <div class="label">الجنس</div>
                            <div class="value">${userData.gender}</div>
                        </div>
                    </div>
                </div>

                <!-- Risk Assessment -->
                <div class="section ${userData.riskLevel === 'عالي' ? 'risk-high' : userData.riskLevel === 'متوسط' ? 'risk-medium' : 'risk-low'}">
                    <h3>⚠️ تقييم المخاطر</h3>
                    <div class="score-display">
                        <div class="score-number">${userData.totalScore}/8</div>
                        <div><strong>مستوى المخاطر:</strong> ${userData.riskLevel}</div>
                        <div>${userData.riskCategory}</div>
                    </div>
                </div>

                <!-- Health Metrics -->
                <div class="section">
                    <h3>📊 المؤشرات الصحية</h3>
                    <div class="data-grid">
                        <div class="data-item">
                            <div class="label">الوزن</div>
                            <div class="value">${userData.weight} كيلوجرام</div>
                        </div>
                        <div class="data-item">
                            <div class="label">الطول</div>
                            <div class="value">${userData.height} سنتيمتر</div>
                        </div>
                        <div class="data-item">
                            <div class="label">مؤشر كتلة الجسم</div>
                            <div class="value">${userData.bmi} - ${userData.bmiCategory}</div>
                        </div>
                    </div>
                </div>

                <!-- Questionnaire Results -->
                <div class="section">
                    <h3>📝 نتائج الاستبيان</h3>
                    <div class="data-grid">
                        <div class="data-item">
                            <div class="label">الشخير</div>
                            <div class="value">${userData.snoring}</div>
                        </div>
                        <div class="data-item">
                            <div class="label">التعب والإرهاق</div>
                            <div class="value">${userData.tiredness}</div>
                        </div>
                        <div class="data-item">
                            <div class="label">انقطاع التنفس المُلاحظ</div>
                            <div class="value">${userData.apnea}</div>
                        </div>
                        <div class="data-item">
                            <div class="label">ضغط الدم</div>
                            <div class="value">${userData.bloodPressure}</div>
                        </div>
                        <div class="data-item">
                            <div class="label">محيط الرقبة</div>
                            <div class="value">${userData.neckCircumference}</div>
                        </div>
                    </div>
                </div>

                <!-- Next Steps -->
                <div class="section">
                    <h3>🎯 الخطوات التالية</h3>
                    <p><strong>أولوية المتابعة:</strong> ${userData.priority}</p>
                    <p><strong>يحتاج متابعة:</strong> ${userData.followUpNeeded}</p>
                    <p><strong>وقت الاتصال المفضل:</strong> ${userData.preferredContactTime}</p>
                    <p><strong>نوع الاستشارة:</strong> ${userData.consultationType}</p>
                    
                    <a href="tel:${userData.phone}" class="cta-button">📞 الاتصال بالمريض</a>
                </div>

                <!-- Session Info -->
                <div class="section">
                    <h3>🔍 معلومات الجلسة</h3>
                    <div class="data-grid">
                        <div class="data-item">
                            <div class="label">رقم الجلسة</div>
                            <div class="value">${userData.sessionId}</div>
                        </div>
                        <div class="data-item">
                            <div class="label">المصدر</div>
                            <div class="value">${userData.source}</div>
                        </div>
                        <div class="data-item">
                            <div class="label">المنصة</div>
                            <div class="value">${userData.platform}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>© 2024 منصة كيورا الطبية | بالشراكة مع Air Liquide Healthcare</p>
                <p>تم إرسال هذا الإشعار تلقائياً من نظام إدارة الاستشارات</p>
            </div>
        </div>
    </body>
    </html>
    `
    
    // Email data for different services
    const emailData = {
      to: NOTIFICATION_EMAIL,
      from: FROM_EMAIL,
      subject: emailSubject,
      html: emailHTML,
      // Additional metadata
      tags: ['consultation-request', 'cura-medical', userData.priority],
      priority: userData.priority === 'عالي' ? 'high' : userData.priority === 'متوسط' ? 'normal' : 'low'
    }
    
    // Send email (example for generic webhook)
    const emailResponse = await fetch(EMAIL_SERVICE_URL || 'https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EMAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })
    
    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      throw new Error(`Email service error: ${emailResponse.status} - ${errorData}`)
    }
    
    const result = await emailResponse.json()
    
    return NextResponse.json({
      success: true,
      message: 'Email notification sent successfully',
      emailId: result.id,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Email notification error:', error)
    
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