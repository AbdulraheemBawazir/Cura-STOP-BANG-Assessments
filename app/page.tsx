"use client"

import { useState, memo, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ProgressRTL } from "@/components/ui/progress-rtl"
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  User,
  FileText,
  BarChart3,
  Heart,
  Download,
  Shield,
  Clock,
  Phone,
  Star,
  Award,
  Users,
  Save,
  Sparkles,
} from "lucide-react"
import Image from "next/image"

// Types
interface PatientInfo {
  name: string
  age: string
  phone: string
  gender: string
  bodyWeight: string
  height: string
}

interface StepProps {
  patientInfo: PatientInfo
  setPatientInfo: (info: PatientInfo) => void
  answers?: Record<string, string>
  setAnswers?: (answers: Record<string, string>) => void
}

// Auto-save hook
const useAutoSave = (data: any, key: string) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data))
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [data, key])
}

// Step 1 Component - Enhanced
const Step1Component = memo(({ patientInfo, setPatientInfo }: StepProps) => {
  useAutoSave(patientInfo, 'cura-patient-info')
  
  // Load saved data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cura-patient-info')
      if (saved && Object.values(patientInfo).every(v => !v)) {
        setPatientInfo(JSON.parse(saved))
      }
    }
  }, [])

  return (
    <div className="space-y-6 md:space-y-8 cura-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 cura-secondary rounded-full flex items-center justify-center cura-shadow-lg cura-bounce-gentle">
          <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3">أهلاً وسهلاً بك</h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          نحن سعداء لوجودك معنا في منصة كيورا الطبية. دعنا نتعرف عليك أكثر لنقدم لك أفضل تقييم طبي مخصص لحالتك
        </p>
      </div>

      <Card className="max-w-2xl mx-auto cura-card cura-slide-up">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm md:text-base font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                الاسم الكامل *
              </Label>
              <Input
                id="name"
                type="text"
                value={patientInfo.name}
                onChange={(e) => {
                  setPatientInfo({ ...patientInfo, name: e.target.value })
                }}
                className="h-10 md:h-12 text-right cura-input cura-focus"
                placeholder="مثال: أحمد محمد العلي"
                autoComplete="name"
                aria-label="الاسم الكامل"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm md:text-base font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                العمر *
              </Label>
              <Input
                id="age"
                type="number"
                value={patientInfo.age}
                onChange={(e) => {
                  setPatientInfo({ ...patientInfo, age: e.target.value })
                }}
                className="h-10 md:h-12 text-right cura-input cura-focus"
                placeholder="مثال: 35"
                autoComplete="age"
                aria-label="العمر"
                min="1"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm md:text-base font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                رقم الهاتف *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={patientInfo.phone}
                onChange={(e) => {
                  setPatientInfo({ ...patientInfo, phone: e.target.value })
                }}
                className="h-10 md:h-12 text-right cura-input cura-focus"
                placeholder="مثال: 0501234567"
                autoComplete="tel"
                aria-label="رقم الهاتف"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm md:text-base font-medium text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                الجنس *
              </Label>
              <RadioGroup
                value={patientInfo.gender}
                onValueChange={(value) => setPatientInfo({ ...patientInfo, gender: value })}
                className="flex gap-6 md:gap-8 justify-center pt-2"
                aria-label="الجنس"
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <RadioGroupItem value="male" id="male" className="border-gray-300 cura-focus" />
                  <Label htmlFor="male" className="text-base font-medium cursor-pointer hover:text-blue-600 transition-colors">
                    ذكر
                  </Label>
                </div>
                <div className="flex items-center space-x-3 space-x-reverse">
                  <RadioGroupItem value="female" id="female" className="border-gray-300 cura-focus" />
                  <Label htmlFor="female" className="text-base font-medium cursor-pointer hover:text-blue-600 transition-colors">
                    أنثى
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="mt-6 md:mt-8 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  حماية خصوصيتك أولويتنا
                </h4>
                <p className="text-sm text-blue-700">
                  جميع المعلومات التي تقدمها محمية بأعلى معايير الأمان وتُستخدم فقط لأغراض التقييم الطبي
                </p>
              </div>
            </div>
          </div>

          {/* Auto-save indicator */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Save className="w-3 h-3" />
            <span>يتم حفظ البيانات تلقائياً</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

Step1Component.displayName = "Step1Component"

// Step 2 Component - Enhanced
const Step2Component = memo(({ patientInfo, setPatientInfo }: StepProps) => {
  useAutoSave(patientInfo, 'cura-patient-info')

  const calculateBMI = () => {
    if (patientInfo.bodyWeight && patientInfo.height) {
      return Number.parseFloat(patientInfo.bodyWeight) / Math.pow(Number.parseFloat(patientInfo.height) / 100, 2)
    }
    return 0
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: "نقص في الوزن", color: "text-blue-600", bg: "bg-blue-50" }
    if (bmi < 25) return { text: "وزن طبيعي", color: "text-green-600", bg: "bg-green-50" }
    if (bmi < 30) return { text: "زيادة في الوزن", color: "text-yellow-600", bg: "bg-yellow-50" }
    return { text: "سمنة", color: "text-red-600", bg: "bg-red-50" }
  }

  const bmi = calculateBMI()
  const bmiCategory = getBMICategory(bmi)

  return (
    <div className="space-y-6 md:space-y-8 cura-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 cura-warning rounded-full flex items-center justify-center cura-shadow-lg cura-bounce-gentle">
          <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3">القياسات الصحية</h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          هذه المعلومات ضرورية لحساب مؤشر كتلة الجسم وتقييم عوامل الخطر بدقة
        </p>
      </div>

      <Card className="max-w-2xl mx-auto cura-card cura-slide-up">
        <CardContent className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-2">
              <Label htmlFor="bodyWeight" className="text-sm md:text-base font-medium text-gray-700 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                الوزن (كيلوجرام) *
              </Label>
              <Input
                id="bodyWeight"
                type="number"
                value={patientInfo.bodyWeight}
                onChange={(e) => {
                  setPatientInfo({ ...patientInfo, bodyWeight: e.target.value })
                }}
                className="h-10 md:h-12 text-right cura-input cura-focus"
                placeholder="مثال: 75"
                autoComplete="off"
                aria-label="الوزن بالكيلوجرام"
                min="1"
                max="500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="text-sm md:text-base font-medium text-gray-700 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                الطول (سنتيمتر) *
              </Label>
              <Input
                id="height"
                type="number"
                value={patientInfo.height}
                onChange={(e) => {
                  setPatientInfo({ ...patientInfo, height: e.target.value })
                }}
                className="h-10 md:h-12 text-right cura-input cura-focus"
                placeholder="مثال: 175"
                autoComplete="off"
                aria-label="الطول بالسنتيمتر"
                min="50"
                max="250"
              />
            </div>
          </div>

          {patientInfo.bodyWeight && patientInfo.height && (
            <div className={`mt-6 p-6 ${bmiCategory.bg} rounded-lg border border-green-200 cura-fade-in`}>
              <div className="text-center">
                <h4 className={`font-bold ${bmiCategory.color} mb-2 flex items-center justify-center gap-2`}>
                  <Sparkles className="w-5 h-5" />
                  مؤشر كتلة الجسم (BMI)
                </h4>
                <div className={`text-2xl md:text-3xl font-bold ${bmiCategory.color} mb-2`}>
                  {bmi.toFixed(1)}
                </div>
                <p className={`text-sm ${bmiCategory.color} font-medium mb-1`}>
                  {bmiCategory.text}
                </p>
                <p className="text-xs text-gray-600">تم حساب مؤشر كتلة الجسم تلقائياً</p>
              </div>
            </div>
          )}

          <div className="mt-6 md:mt-8 p-3 md:p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-orange-800 mb-1 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  لماذا نحتاج هذه المعلومات؟
                </h4>
                <p className="text-sm text-orange-700">
                  مؤشر كتلة الجسم عامل مهم في تقييم خطر الإصابة بانقطاع التنفس أثناء النوم
                </p>
              </div>
            </div>
          </div>

          {/* Auto-save indicator */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
            <Save className="w-3 h-3" />
            <span>يتم حفظ البيانات تلقائياً</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

Step2Component.displayName = "Step2Component"

// Step 3 Component - Enhanced
const Step3Component = memo(({ patientInfo, setPatientInfo, answers, setAnswers }: StepProps) => {
  useAutoSave(answers, 'cura-answers')
  
  // Load saved data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cura-answers')
      if (saved && (!answers || Object.keys(answers).length === 0)) {
        setAnswers?.(JSON.parse(saved))
      }
    }
  }, [])

  // Updated questions - Only show what user needs to answer (5 questions)
  const questions = [
    {
      id: "snoring",
      text: "هل تعاني من الشخير بصوت عالٍ؟",
      category: "أعراض النوم",
      icon: "🌙",
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      id: "tiredness",
      text: "هل تشعر بالتعب أو الإرهاق أو النعاس خلال اليوم؟",
      category: "أعراض النهار",
      icon: "😴",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      id: "apnea",
      text: "هل تم ملاحظة توقفك عن التنفس أو اختناقك أو شهيقك خلال النوم؟",
      category: "أعراض النوم",
      icon: "⚠️",
      color: "bg-red-50 text-red-700 border-red-200",
    },
    {
      id: "bloodPressure",
      text: "هل لديك ارتفاع في ضغط الدم أو تتناول علاجاً لارتفاع ضغط الدم؟",
      category: "التاريخ الطبي",
      icon: "💊",
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      id: "neck",
      text: "هل محيط رقبتك أكبر من ٤٠ سنتيمتر؟",
      category: "القياسات الجسدية",
      icon: "📏",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
  ]

  const answeredCount = Object.keys(answers || {}).length
  const progressPercentage = (answeredCount / questions.length) * 100

  return (
    <div className="space-y-6 md:space-y-8 cura-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 cura-primary rounded-full flex items-center justify-center cura-shadow-lg cura-bounce-gentle">
          <FileText className="w-8 h-8 md:w-10 md:h-10 text-white" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 md:mb-3">الاستبيان الطبي</h2>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          يرجى الإجابة على الأسئلة التالية بصدق وصراحة. هذه الأسئلة مبنية على معايير طبية عالمية لتقييم اضطرابات النوم
        </p>
        
        {/* Progress indicator for questions */}
        <div className="mt-4 max-w-md mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>تقدمك في الاستبيان</span>
            <span>{answeredCount} من {questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
        {questions.map((question, index) => {
          const isAnswered = answers?.[question.id]
          return (
            <Card 
              key={question.id} 
              className={`cura-card-interactive cura-slide-up ${isAnswered ? 'ring-2 ring-green-200 bg-green-50' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4 md:p-6">
                <div className="flex items-start gap-3 md:gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${isAnswered ? 'cura-success' : 'cura-secondary'} text-white rounded-full flex items-center justify-center text-base md:text-lg font-bold flex-shrink-0 cura-shadow-md transition-all duration-300`}>
                    {isAnswered ? <CheckCircle className="w-5 h-5" /> : index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                      <span className="text-xl md:text-2xl">{question.icon}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${question.color}`}>
                        {question.category}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-medium text-gray-800 mb-3 md:mb-4 leading-relaxed">
                      {question.text}
                    </h3>
                    <RadioGroup
                      value={answers?.[question.id] || ""}
                      onValueChange={(value) => setAnswers?.({ ...answers, [question.id]: value })}
                      className="flex gap-6 md:gap-8 justify-center"
                      aria-label={question.text}
                    >
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <RadioGroupItem value="no" id={`${question.id}-no`} className="border-gray-300 cura-focus" />
                        <Label htmlFor={`${question.id}-no`} className="text-base md:text-lg font-medium cursor-pointer hover:text-red-600 transition-colors">
                          لا
                        </Label>
                      </div>
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <RadioGroupItem value="yes" id={`${question.id}-yes`} className="border-gray-300 cura-focus" />
                        <Label htmlFor={`${question.id}-yes`} className="text-base md:text-lg font-medium cursor-pointer hover:text-green-600 transition-colors">
                          نعم
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="p-4 md:p-6 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                استبيان STOP-BANG المعتمد طبياً
              </h4>
              <p className="text-sm text-blue-700">
                هذا الاستبيان معتمد من الجمعيات الطبية العالمية ويُستخدم في المستشفيات والعيادات المتخصصة
              </p>
            </div>
          </div>
        </div>

        {/* Auto-save indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Save className="w-3 h-3" />
          <span>يتم حفظ الإجابات تلقائياً</span>
        </div>
      </div>
    </div>
  )
})

Step3Component.displayName = "Step3Component"

// Data submission utilities

const submitToGoogleSheets = async (userData: any) => {
  try {
    const response = await fetch('/api/submit-to-sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    if (!response.ok) {
      throw new Error('Failed to submit to Google Sheets')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Google Sheets submission error:', error)
    throw error
  }
}

const sendEmailNotification = async (userData: any) => {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    
    if (!response.ok) {
      throw new Error('Failed to send email')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Email submission error:', error)
    throw error
  }
}

// Main Component
export default function CuraHealthPlatform() {
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [hasConsented, setHasConsented] = useState(false)
  const [showSuccessPage, setShowSuccessPage] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    name: "",
    age: "",
    phone: "",
    gender: "",
    bodyWeight: "",
    height: "",
  })

  // Load saved data on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPatient = localStorage.getItem('cura-patient-info')
      const savedAnswers = localStorage.getItem('cura-answers')
      const savedStep = localStorage.getItem('cura-current-step')
      
      if (savedPatient) {
        setPatientInfo(JSON.parse(savedPatient))
      }
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers))
      }
      if (savedStep) {
        setCurrentStep(parseInt(savedStep))
      }
    }
  }, [])

  // Auto-save current step
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cura-current-step', currentStep.toString())
    }
  }, [currentStep])

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100

  const stepTitles = [
    { title: "المعلومات الشخصية", subtitle: "نتعرف عليك أكثر", icon: User },
    { title: "القياسات الصحية", subtitle: "بيانات مهمة للتقييم", icon: BarChart3 },
    { title: "الاستبيان الطبي", subtitle: "أسئلة متخصصة", icon: FileText },
    { title: "النتائج والتوصيات", subtitle: "تقييمك الشخصي", icon: Heart },
  ]

  const calculateBMI = () => {
    if (patientInfo.bodyWeight && patientInfo.height) {
      return Number.parseFloat(patientInfo.bodyWeight) / Math.pow(Number.parseFloat(patientInfo.height) / 100, 2)
    }
    return 0
  }

  const calculateScore = () => {
    let score = 0

    // Manual questions (5 questions that user answered)
    if (answers.snoring === "yes") score += 1 // S - Snoring
    if (answers.tiredness === "yes") score += 1 // T - Tiredness  
    if (answers.apnea === "yes") score += 1 // O - Observed apnea
    if (answers.bloodPressure === "yes") score += 1 // P - Blood pressure
    if (answers.neck === "yes") score += 1 // N - Neck circumference

    // Automatic calculations (3 questions calculated from user data)
    const bmi = calculateBMI()
    if (bmi > 35) score += 1 // B - BMI

    const age = Number.parseInt(patientInfo.age)
    if (age > 50) score += 1 // A - Age

    if (patientInfo.gender === "male") score += 1 // G - Gender

    return score
  }

  const downloadResults = () => {
    const score = calculateScore()
    const bmi = calculateBMI()
    const data = {
      الاسم: patientInfo.name,
      العمر: patientInfo.age,
      الهاتف: patientInfo.phone,
      الجنس: patientInfo.gender === "male" ? "ذكر" : "أنثى",
      الوزن: patientInfo.bodyWeight,
      الطول: patientInfo.height,
      "مؤشر كتلة الجسم": bmi.toFixed(1),
      الشخير: answers.snoring === "yes" ? "نعم" : "لا",
      التعب: answers.tiredness === "yes" ? "نعم" : "لا",
      "انقطاع التنفس": answers.apnea === "yes" ? "نعم" : "لا",
      "ضغط الدم": answers.bloodPressure === "yes" ? "نعم" : "لا",
      "مؤشر كتلة الجسم أكبر من 35": bmi > 35 ? "نعم" : "لا",
      "العمر أكبر من 50": Number.parseInt(patientInfo.age) > 50 ? "نعم" : "لا",
      "الجنس ذكر": patientInfo.gender === "male" ? "نعم" : "لا",
      "محيط الرقبة": answers.neck === "yes" ? "نعم" : "لا",
      "النتيجة النهائية": `${score}/8`,
      "تاريخ التقييم": new Date().toLocaleDateString("en-GB"),
    }

    const headers = Object.keys(data).join(",")
    const values = Object.values(data).join(",")
    const csvContent = `${headers}\n${values}`
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `تقييم_كيورا_${patientInfo.name}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleConsent = async () => {
    setIsProcessing(true)
    setHasConsented(true)
    
    // Prepare comprehensive user data
    const score = calculateScore()
    const bmi = calculateBMI()
    const submissionData = {
      // Personal Information
      name: patientInfo.name,
      age: patientInfo.age,
      phone: patientInfo.phone,
      gender: patientInfo.gender === "male" ? "ذكر" : "أنثى",
      
      // Health Metrics
      weight: patientInfo.bodyWeight,
      height: patientInfo.height,
      bmi: bmi.toFixed(1),
      bmiCategory: bmi < 18.5 ? "نقص في الوزن" : bmi < 25 ? "وزن طبيعي" : bmi < 30 ? "زيادة في الوزن" : "سمنة",
      
      // Questionnaire Answers
      snoring: answers.snoring === "yes" ? "نعم" : "لا",
      tiredness: answers.tiredness === "yes" ? "نعم" : "لا",
      apnea: answers.apnea === "yes" ? "نعم" : "لا",
      bloodPressure: answers.bloodPressure === "yes" ? "نعم" : "لا",
      neckCircumference: answers.neck === "yes" ? "نعم" : "لا",
      
      // Calculated Risk Factors
      ageRisk: Number.parseInt(patientInfo.age) > 50 ? "نعم" : "لا",
      bmiRisk: bmi > 35 ? "نعم" : "لا",
      genderRisk: patientInfo.gender === "male" ? "نعم" : "لا",
      
      // Final Assessment
      totalScore: score,
      maxScore: 8,
      riskLevel: score <= 3 ? "منخفض" : score <= 5 ? "متوسط" : "عالي",
      riskCategory: score <= 3 ? "احتمالية منخفضة لانقطاع التنفس أثناء النوم" : 
                    score <= 5 ? "احتمالية متوسطة لانقطاع التنفس أثناء النوم" : 
                    "احتمالية عالية لانقطاع التنفس أثناء النوم",
      
      // Metadata
      submissionDate: new Date().toISOString(),
      submissionDateArabic: new Date().toLocaleDateString("en-GB"),
      platform: "منصة كيورا الطبية",
      source: "STOP-BANG Assessment",
      status: "طلب استشارة جديد",
      priority: score >= 6 ? "عالي" : score >= 4 ? "متوسط" : "منخفض",
      
      // Contact preferences
      preferredContactTime: "خلال ساعات العمل",
      consultationType: "استشارة مجانية أولية",
      followUpNeeded: score > 3 ? "نعم" : "لا",
      
      // Additional tracking
      sessionId: Date.now().toString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      referrer: typeof window !== 'undefined' ? window.document.referrer : 'direct'
    }

    try {
      // Submit to Google Sheets only
      const submissionPromises = []
      
      // Primary: Google Sheets submission
      submissionPromises.push(
        submitToGoogleSheets(submissionData).catch((error: unknown) => ({ 
          service: 'Google Sheets', 
          error: error instanceof Error ? error.message : 'Unknown error'
        }))
      )
      
      // Notification: Email to team
      submissionPromises.push(
        sendEmailNotification(submissionData).catch((error: unknown) => ({ 
          service: 'Email', 
          error: error instanceof Error ? error.message : 'Unknown error'
        }))
      )
      
      // Wait for all submissions
      const results = await Promise.allSettled(submissionPromises)
      
      // Check if at least one submission succeeded
      const successfulSubmissions = results.filter(result => 
        result.status === 'fulfilled' && !result.value?.error
      )
      
      if (successfulSubmissions.length === 0) {
        throw new Error('All submission methods failed')
      }
      
      console.log('Submission successful:', {
        successful: successfulSubmissions.length,
        total: submissionPromises.length,
        data: submissionData
      })
      
    } catch (error) {
      console.error('Submission failed:', error)
      
      // Even if submission fails, we can still show success page
      // and store data locally as backup
      if (typeof window !== 'undefined') {
        localStorage.setItem('cura-failed-submission', JSON.stringify({
          data: submissionData,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }))
      }
    }
    
    // Clear saved form data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cura-patient-info')
      localStorage.removeItem('cura-answers')
      localStorage.removeItem('cura-current-step')
    }
    
    // Show success page after delay
    setTimeout(() => {
      setShowSuccessPage(true)
      downloadResults()
    }, 3000)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return patientInfo.name && patientInfo.age && patientInfo.phone && patientInfo.gender
      case 2:
        return patientInfo.bodyWeight && patientInfo.height
      case 3:
        return Object.keys(answers).length === 5 // Changed from 7 to 5
      default:
        return true
    }
  }

  // Header Component
  const Header = () => (
    <div className="bg-white cura-shadow-md border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image src="/cura-logo.png" alt="كيورا" width={100} height={32} className="h-8 w-auto" />
            <div className="hidden md:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-800">منصة كيورا الطبية</h1>
              <p className="text-xs md:text-sm text-gray-600">تقييم اضطرابات النوم</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="font-medium">آمن ومحمي</span>
          </div>
        </div>
      </div>
    </div>
  )

  // Progress Component
  const ProgressSection = () => (
    <div className="bg-white border-b border-gray-100 cura-shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-700">
              الخطوة {currentStep} من {totalSteps}
            </span>
            <span className="text-sm text-gray-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {Math.round(progress)}% مكتمل
            </span>
          </div>
          <ProgressRTL value={progress} className="h-3 bg-gray-100 rounded-full overflow-hidden" />

          {/* Enhanced Step Indicators */}
          <div className="flex items-center justify-between mt-6">
            {stepTitles.map((step, index) => {
              const stepNumber = index + 1
              const isActive = stepNumber === currentStep
              const isCompleted = stepNumber < currentStep
              const IconComponent = step.icon

              return (
                <div key={stepNumber} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 cura-shadow-md ${
                      isCompleted
                        ? "cura-success"
                        : isActive
                          ? "cura-secondary cura-pulse-subtle"
                          : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={`text-sm font-medium transition-colors ${isActive ? "text-gray-800" : "text-gray-600"}`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500 hidden md:block">{step.subtitle}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )

  // Success Page - Minimalist Design
  const SuccessPage = () => {
    const score = calculateScore()

    return (
      <div className="min-h-screen cura-bg-gradient flex items-center justify-center p-4 cura-fade-in" dir="rtl">
        <div className="max-w-lg w-full">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-6 cura-success rounded-full flex items-center justify-center cura-shadow-lg cura-bounce-gentle">
              <CheckCircle className="w-12 h-12 md:w-14 md:h-14 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">تم بنجاح! 🎉</h1>
            <p className="text-lg text-gray-600 mb-2">
              شكراً لثقتك، {patientInfo.name}
            </p>
            <p className="text-sm text-gray-500">تم إرسال تقييمك بنجاح</p>
          </div>

          <Card className="cura-card cura-shadow-lg overflow-hidden mb-6">
            <CardContent className="p-6 text-center">
              {/* Score Display */}
              <div className="mb-6">
                <div className="bg-blue-50 rounded-lg p-4 inline-block">
                  <p className="text-lg font-bold text-blue-800">نتيجة التقييم: {score} من ٨</p>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 cura-success rounded-full flex items-center justify-center text-white font-bold text-sm">
                    ✓
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-green-800 text-sm">تم الإرسال بنجاح</h4>
                    <p className="text-xs text-green-700">وصلت بياناتك إلى فريق Air Liquide</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 cura-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    ٢
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-blue-800 text-sm">سيتم التواصل معك</h4>
                    <p className="text-xs text-blue-700">خلال ٢٤ ساعة على {patientInfo.phone}</p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <Button
                onClick={downloadResults}
                className="cura-btn-primary px-6 py-3 text-base flex items-center gap-2 mx-auto mb-4"
              >
                <Download className="w-4 h-4" />
                تحميل التقرير
              </Button>
              <p className="text-xs text-gray-500">احتفظ بنسخة للمراجعة مع الطبيب</p>
            </CardContent>
          </Card>

          {/* Trust & Footer */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4" />
              <span>بياناتك محمية وآمنة</span>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>© ٢٠٢٤ منصة كيورا الطبية</p>
              <p className="flex items-center justify-center gap-2">
                <span>بالشراكة مع</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                  Air Liquide Healthcare
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Step 4: Results
  const Step4 = () => {
    const score = calculateScore()
    const isLowRisk = score <= 3

    if (showSuccessPage) {
      return <SuccessPage />
    }

    return (
      <div className="space-y-6 md:space-y-8 cura-fade-in">
        {isLowRisk ? (
          // Low Risk - Clean & Simple
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-6 cura-success rounded-full flex items-center justify-center cura-shadow-lg cura-bounce-gentle">
              <div className="text-white text-center">
                <div className="text-2xl md:text-3xl font-bold">{score}</div>
                <div className="text-xs opacity-80">من 8</div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">نتيجة مطمئنة! 🎉</h2>
            <p className="text-lg text-gray-600 mb-8">احتمالية منخفضة لانقطاع التنفس أثناء النوم</p>

            <Card className="cura-card mb-6">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center justify-center gap-2">
                  <Award className="w-5 h-5" />
                  نصائح للحفاظ على نوم صحي
                </h3>
                <div className="grid grid-cols-2 gap-3 text-sm text-green-700">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>نوم منتظم</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>تجنب الكافيين مساءً</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>ممارسة الرياضة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>وزن صحي</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={downloadResults}
              className="cura-btn-secondary px-6 py-3 text-base flex items-center gap-2 mx-auto"
            >
              <Download className="w-4 h-4" />
              تحميل التقرير
            </Button>

            {/* Restart Option */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <Button
                onClick={() => {
                  // Clear all saved data
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('cura-patient-info')
                    localStorage.removeItem('cura-answers')
                    localStorage.removeItem('cura-current-step')
                  }
                  // Reset all state
                  setPatientInfo({
                    name: "",
                    age: "",
                    phone: "",
                    gender: "",
                    bodyWeight: "",
                    height: "",
                  })
                  setAnswers({})
                  setCurrentStep(1)
                  setShowSuccessPage(false)
                  setIsProcessing(false)
                  setHasConsented(false)
                }}
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                إعادة الاختبار من البداية
              </Button>
            </div>
          </div>
        ) : (
          // High Risk - Focused & Clean
          <div className="max-w-xl mx-auto">
            {/* Score Display */}
            <div className="text-center mb-8">
              <div className="w-24 h-24 md:w-28 md:h-28 mx-auto mb-4 cura-primary rounded-full flex items-center justify-center cura-shadow-lg cura-bounce-gentle">
                <div className="text-white text-center">
                  <span className="text-2xl md:text-3xl font-bold">{score}</span>
                  <span className="text-xs opacity-80 block">من 8</span>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {score >= 6 ? "خطورة عالية ⚠️" : "خطورة متوسطة ⚠️"}
              </h2>
              <p className="text-lg text-gray-600">
                احتمالية {score >= 6 ? "عالية" : "متوسطة"} لانقطاع التنفس أثناء النوم
              </p>
            </div>

            {/* Main Card */}
            <Card className="cura-card cura-shadow-lg overflow-hidden mb-6">
              <CardContent className="p-0">
                {/* Problem Awareness */}
                <div className="bg-red-50 p-6 border-b border-red-200 text-center">
                  <h3 className="text-xl font-bold text-red-800 mb-3">لماذا يجب أن تهتم؟</h3>
                  <p className="text-red-700 mb-4">اضطرابات النوم قد تؤثر على صحتك وجودة حياتك</p>
                  <div className="grid grid-cols-2 gap-3 text-sm text-red-700">
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>تعب مستمر</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>صعوبة التركيز</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>مشاكل القلب</span>
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>ارتفاع الضغط</span>
                    </div>
                  </div>
                </div>

                {/* Solution */}
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 cura-info rounded-full flex items-center justify-center">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">استشارة مجانية مع خبراء Air Liquide</h3>
                  <p className="text-gray-600 mb-6">احصل على تقييم مفصل لحالتك ونصائح متخصصة</p>

                  {/* CTA */}
                  {isProcessing ? (
                    <div className="bg-blue-50 rounded-lg p-6">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3 cura-loading"></div>
                      <h4 className="text-lg font-bold text-blue-800 mb-1">جاري الإرسال...</h4>
                      <p className="text-sm text-blue-700">سيتم التواصل معك خلال 24 ساعة</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Button
                        onClick={handleConsent}
                        className="w-full cura-btn-primary px-6 py-4 text-lg font-bold"
                      >
                        احجز استشارتك المجانية الآن
                      </Button>
                      <p className="text-xs text-gray-500">
                        بالضغط على الزر، توافق على إرسال بيانات تقييمك إلى Air Liquide Healthcare
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>مجاني 100%</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>سري وآمن</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>خلال 24 ساعة</span>
              </div>
            </div>

            {/* Restart Option */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <Button
                onClick={() => {
                  // Clear all saved data
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('cura-patient-info')
                    localStorage.removeItem('cura-answers')
                    localStorage.removeItem('cura-current-step')
                  }
                  // Reset all state
                  setPatientInfo({
                    name: "",
                    age: "",
                    phone: "",
                    gender: "",
                    bodyWeight: "",
                    height: "",
                  })
                  setAnswers({})
                  setCurrentStep(1)
                  setShowSuccessPage(false)
                  setIsProcessing(false)
                  setHasConsented(false)
                }}
                variant="ghost"
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                إعادة الاختبار من البداية
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Navigation Component
  const Navigation = () => (
    <div className="bg-white border-t border-gray-200 sticky bottom-0 z-40 cura-shadow-lg">
      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 border-gray-300 hover:bg-gray-50 disabled:opacity-50 bg-transparent cura-focus transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            السابق
          </Button>

          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            الخطوة {currentStep} من {totalSteps}
          </div>

          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="cura-btn-secondary px-4 py-2 md:px-6 md:py-3 flex items-center gap-2 disabled:opacity-50 disabled:transform-none disabled:hover:scale-100"
          >
            التالي
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  // Main Render
  if (showSuccessPage) {
    return <SuccessPage />
  }

  return (
    <div className="min-h-screen cura-bg-gradient" dir="rtl">
      <Header />
      <ProgressSection />

      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {currentStep === 1 && <Step1Component patientInfo={patientInfo} setPatientInfo={setPatientInfo} />}
          {currentStep === 2 && <Step2Component patientInfo={patientInfo} setPatientInfo={setPatientInfo} />}
          {currentStep === 3 && <Step3Component patientInfo={patientInfo} setPatientInfo={setPatientInfo} answers={answers} setAnswers={setAnswers} />}
          {currentStep === 4 && <Step4 />}
        </div>
      </main>

      {currentStep < 4 && <Navigation />}
    </div>
  )
}
