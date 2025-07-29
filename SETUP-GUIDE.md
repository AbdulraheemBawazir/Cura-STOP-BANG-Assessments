# 🏥 Cura Medical Platform - Data Submission Setup Guide

## 📋 Overview

This guide will help you configure data submission for consultation requests to multiple services:
- **🥇 Airtable** (Primary - Recommended)
- **🥈 Google Sheets** (Backup)
- **📧 Email Notifications** (Team alerts)

## 🚀 Quick Setup Options

### Option 1: 🥇 Airtable Setup (RECOMMENDED)

#### Step 1: Create Airtable Account & Base
1. Sign up at [airtable.com](https://airtable.com)
2. Create a new base called "Cura Medical Consultations"
3. Create a table called "Consultations" with these fields:

**Required Fields:**
- Name (Single line text)
- Age (Number)
- Phone (Phone number)
- Gender (Single select: ذكر, أنثى)
- Weight (kg) (Number)
- Height (cm) (Number)
- BMI (Number)
- BMI Category (Single select)
- Total Score (Number)
- Risk Level (Single select: منخفض, متوسط, عالي)
- Risk Category (Long text)
- Priority (Single select: منخفض, متوسط, عالي)
- Submission Date (Date)
- Status (Single select: طلب استشارة جديد, تم الاتصال, مكتمل)
- Session ID (Single line text)

#### Step 2: Get API Credentials
1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Create a personal access token with these scopes:
   - `data.records:read`
   - `data.records:write`
3. Copy your API key and Base ID

#### Step 3: Configure Environment Variables
Create a `.env.local` file in your project root:

```env
# Airtable Configuration
AIRTABLE_API_KEY=pat_your_api_key_here
AIRTABLE_BASE_ID=app_your_base_id_here
AIRTABLE_TABLE_NAME=Consultations
```

### Option 2: 🥈 Google Sheets Setup (RECOMMENDED FOR SIMPLICITY)

#### Method A: Google Apps Script - UPDATED FOR STOP-BANG

**Step 1: Create Google Sheet with EXACT Headers**

Copy and paste this into **Row 1** of your Google Sheet:

```
Name	Age	Phone	Gender	Weight	Height	BMI	Snoring	Tiredness	Observed_Apnea	Blood_Pressure	BMI_Risk	Age_Risk	Neck_Circumference	Gender_Risk	Total_Score	Risk_Level	Status	Submission_Date	Session_ID
```

**Step 2: Google Apps Script Code**

1. Create a new Google Sheet
2. Go to Extensions > Apps Script
3. Paste this **UPDATED** code:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const data = JSON.parse(e.postData.contents);
    
    // Add headers if sheet is empty (All 8 STOP-BANG components)
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 20).setValues([[
        'Name', 'Age', 'Phone', 'Gender', 'Weight', 'Height', 'BMI',
        'Snoring', 'Tiredness', 'Observed_Apnea', 'Blood_Pressure', 
        'BMI_Risk', 'Age_Risk', 'Neck_Circumference', 'Gender_Risk',
        'Total_Score', 'Risk_Level', 'Status', 'Submission_Date', 'Session_ID'
      ]]);
    }
    
    // Calculate automatic STOP-BANG components
    const bmi = parseFloat(data.bmi);
    const age = parseInt(data.age);
    
    // B - BMI Risk (>35)
    const bmiRisk = bmi > 35 ? "Yes" : "No";
    
    // A - Age Risk (>50)  
    const ageRisk = age > 50 ? "Yes" : "No";
    
    // G - Gender Risk (Male)
    const genderRisk = data.gender === "ذكر" ? "Yes" : "No";
    
    // Convert Arabic answers to English for consistency
    const convertAnswer = (answer) => {
      return answer === "نعم" ? "Yes" : answer === "لا" ? "No" : answer;
    };
    
    // Add data row with all 8 STOP-BANG components
    sheet.appendRow([
      data.name,                               // Name
      data.age,                                // Age  
      data.phone,                              // Phone
      data.gender,                             // Gender
      data.weight,                             // Weight
      data.height,                             // Height
      data.bmi,                                // BMI
      convertAnswer(data.snoring),             // S - Snoring
      convertAnswer(data.tiredness),           // T - Tiredness
      convertAnswer(data.apnea),               // O - Observed Apnea
      convertAnswer(data.bloodPressure),       // P - Blood Pressure
      bmiRisk,                                 // B - BMI Risk (>35) - CALCULATED
      ageRisk,                                 // A - Age Risk (>50) - CALCULATED
      convertAnswer(data.neckCircumference),   // N - Neck Circumference
      genderRisk,                              // G - Gender Risk (Male) - CALCULATED
      data.totalScore,                         // Total Score (0-8)
      data.riskLevel,                          // Risk Level
      data.status,                             // Status
      data.submissionDateArabic,               // Submission Date
      data.sessionId                           // Session ID
    ]);
    
    // Log successful submission
    console.log(`New STOP-BANG submission: ${data.name}, Score: ${data.totalScore}/8, Risk: ${data.riskLevel}`);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: `STOP-BANG data recorded for ${data.name}`,
      score: `${data.totalScore}/8`,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({
      success: false, 
      error: error.toString(),
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Function to analyze STOP-BANG scores
function analyzeScores() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) return; // No data except headers
  
  let lowRisk = 0, mediumRisk = 0, highRisk = 0;
  
  for (let i = 1; i < data.length; i++) {
    const score = data[i][15]; // Total_Score column
    if (score <= 3) lowRisk++;
    else if (score <= 5) mediumRisk++;
    else highRisk++;
  }
  
  console.log(`Risk Analysis - Low: ${lowRisk}, Medium: ${mediumRisk}, High: ${highRisk}`);
}
```

4. **Deploy as Web App**
5. **Copy the Web App URL**

Add to `.env.local`:
```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/your_script_id/exec
```

### Option 3: 📧 Email Notifications

#### Resend (Recommended)
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to `.env.local`:

```env
EMAIL_SERVICE_URL=https://api.resend.com/emails
EMAIL_API_KEY=re_your_api_key_here
NOTIFICATION_EMAIL=healthcare@airliquide.com
FROM_EMAIL=noreply@cura-medical.com
```

#### SendGrid Alternative
```env
EMAIL_SERVICE_URL=https://api.sendgrid.com/v3/mail/send
EMAIL_API_KEY=SG.your_sendgrid_api_key_here
NOTIFICATION_EMAIL=healthcare@airliquide.com
FROM_EMAIL=noreply@cura-medical.com
```

## 🔧 Complete Environment Configuration

Create `.env.local` file with your chosen services:

```env
# =================================
# AIRTABLE CONFIGURATION (PRIMARY)
# =================================
AIRTABLE_API_KEY=pat_your_airtable_api_key_here
AIRTABLE_BASE_ID=app_your_airtable_base_id_here
AIRTABLE_TABLE_NAME=Consultations

# =================================
# GOOGLE SHEETS CONFIGURATION (BACKUP)
# =================================
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/your_script_id/exec

# =================================
# EMAIL NOTIFICATION CONFIGURATION
# =================================
EMAIL_SERVICE_URL=https://api.resend.com/emails
EMAIL_API_KEY=re_your_resend_api_key_here
NOTIFICATION_EMAIL=healthcare@airliquide.com
FROM_EMAIL=noreply@cura-medical.com

# =================================
# OPTIONAL CONFIGURATIONS
# =================================
NODE_ENV=production
DEBUG_SUBMISSIONS=false
```

## 🎯 **STOP-BANG Questionnaire Structure**

### **Questions User Answers (5 Questions):**
1. **S** - Snoring (هل تعاني من الشخير بصوت عالٍ؟)
2. **T** - Tiredness (هل تشعر بالتعب/الإرهاق/النعاس خلال اليوم؟)
3. **O** - Observed Apnea (هل تم ملاحظة توقفك عن التنفس خلال النوم؟)
4. **P** - Blood Pressure (هل لديك ارتفاع في ضغط الدم؟)
5. **N** - Neck Circumference (هل محيط رقبتك أكبر من 40 سم؟)

### **Automatically Calculated (3 Questions):**
6. **B** - BMI Risk (حُسبت من الوزن والطول: > 35)
7. **A** - Age Risk (حُسبت من العمر: > 50 سنة)  
8. **G** - Gender Risk (حُسبت من الجنس: ذكر)

## 🎯 Data Flow

When a user clicks "احجز استشارتك المجانية الآن":

1. **Data Collection**: All form data + calculated scores
2. **Multiple Submissions**: 
   - ✅ Primary: Airtable
   - ✅ Backup: Google Sheets  
   - ✅ Notification: Email to team
3. **Error Handling**: If all fail, data saved locally
4. **Success Page**: User sees confirmation

## 📊 Data Structure

Each submission includes:

### Personal Information
- Name, Age, Phone, Gender

### Health Metrics
- Weight, Height, BMI, BMI Category

### STOP-BANG Assessment (All 8 Components)
- **S**: Snoring (user answered)
- **T**: Tiredness (user answered)
- **O**: Observed Apnea (user answered)
- **P**: Blood Pressure (user answered)
- **B**: BMI Risk (calculated: BMI > 35)
- **A**: Age Risk (calculated: Age > 50)
- **N**: Neck Circumference (user answered)
- **G**: Gender Risk (calculated: Male)

### Risk Assessment
- Total score (0-8)
- Risk level (منخفض/متوسط/عالي)
- Priority for follow-up

### Metadata
- Submission timestamp
- Session ID
- Platform source
- Status tracking

## 🔍 Testing

1. Fill out the questionnaire (only 5 questions shown to user)
2. Check your configured services:
   - Google Sheets: New row with all 8 STOP-BANG components
   - Email: Notification received
3. Check browser console for any errors

## 📋 **Your Google Sheet Will Look Like:**

| Name | Age | Phone | Gender | BMI | Snoring | Tiredness | Observed_Apnea | Blood_Pressure | BMI_Risk | Age_Risk | Neck_Circumference | Gender_Risk | Total_Score | Risk_Level |
|------|-----|-------|--------|-----|---------|-----------|----------------|----------------|----------|----------|-------------------|-------------|-------------|------------|
| أحمد محمد | 45 | 050123... | ذكر | 27.8 | Yes | Yes | No | Yes | No | No | Yes | Yes | 5 | متوسط |

## 🛠️ Troubleshooting

### Common Issues:

**Google Sheets Error**
- Verify Web App is deployed correctly
- Check script permissions
- Ensure "Anyone" has access to execute

**Environment Variables Not Loading**
- Restart development server after adding `.env.local`
- Ensure file is in project root

## 🎉 Success!

Once configured, your Cura Medical Platform will automatically:
- 📋 Store all STOP-BANG consultation requests
- 🚨 Alert your team immediately
- 📊 Provide comprehensive 8-component assessment
- 🔄 Handle failures gracefully

## 💡 Pro Tips

1. **Start with Google Sheets**: Easiest to set up and test
2. **Test thoroughly**: Use different risk levels to see scoring
3. **Monitor submissions**: Check your sheet regularly
4. **Add conditional formatting**: Highlight high-risk patients in red

## 🆘 Need Help?

- Check the browser console for detailed error messages
- Verify all environment variables are set correctly
- Test using: `http://localhost:3000/api/test-submission`
- Contact your development team for advanced configuration

---

**🏥 Cura Medical Platform - Complete STOP-BANG Assessment System** 