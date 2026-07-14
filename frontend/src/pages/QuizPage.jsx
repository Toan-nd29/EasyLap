import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import quizApi from '../api/quizApi';
import recommendationApi from '../api/recommendationApi';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { ArrowLeft, ArrowRight, CheckCircle2, ListChecks, Sparkles } from 'lucide-react';

const COMMON_ANSWER_KEYS = {
  userGroup: ['common_user_group', 'userGroup'],
  budget: ['common_budget', 'budget'],
  mobility: ['common_mobility', 'mobility'],
  usageYears: ['common_usage_years', 'usageYears', 'lifespan'],
  priorities: ['common_priorities', 'priorities']
};

const getAnswerByKeys = (answers, keys, fallback = '') => {
  const matchedKey = keys.find(key => answers[key] !== undefined);
  return matchedKey ? answers[matchedKey] : fallback;
};

const QuizPage = () => {
  const navigate = useNavigate();
  
  const [commonQuestions, setCommonQuestions] = useState([]);
  const [specificQuestions, setSpecificQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0); 
  const [answers, setAnswers] = useState({});
  const [userGroup, setUserGroup] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function fetchCommonQuestions() {
    try {
      const res = await quizApi.getCommonQuestions();
      if (res.success) {
        setCommonQuestions(res.questions || []);
      } else {
        setError('Không thể tải câu hỏi. Vui lòng thử lại.');
      }
    } catch (err) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCommonQuestions();
  }, []);

  const fetchSpecificQuestions = async (group) => {
    try {
      setLoading(true);
      const res = await quizApi.getQuestionsByGroup(group);
      if (res.success) {
        setSpecificQuestions(res.questions || []);
      }
    } catch (err) {
      console.error(err);
      setSpecificQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  const allQuestions = [...commonQuestions, ...specificQuestions];
  const currentQuestion = allQuestions[currentStep];

  const handleOptionClick = (value) => {
    const qKey = currentQuestion.question_key;
    const isMultiple = currentQuestion.type === 'multiple';
    
    if (isMultiple) {
      const currentAns = answers[qKey] || [];
      const newAns = currentAns.includes(value)
        ? currentAns.filter(v => v !== value)
        : [...currentAns, value];
      setAnswers({ ...answers, [qKey]: newAns });
    } else {
      setAnswers({ ...answers, [qKey]: value });
      
      if (COMMON_ANSWER_KEYS.userGroup.includes(qKey) && value !== userGroup) {
        setUserGroup(value);
        fetchSpecificQuestions(value);
      }
    }
  };

  const handleNext = () => {
    if (currentStep < allQuestions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError('');
      
      const specificAnswers = {};
      
      // Build commonAnswers object mapping properly
      const mappedCommonAnswers = {
        userGroup: getAnswerByKeys(answers, COMMON_ANSWER_KEYS.userGroup),
        budget: getAnswerByKeys(answers, COMMON_ANSWER_KEYS.budget),
        mobility: getAnswerByKeys(answers, COMMON_ANSWER_KEYS.mobility),
        usageYears: getAnswerByKeys(answers, COMMON_ANSWER_KEYS.usageYears),
        priorities: getAnswerByKeys(answers, COMMON_ANSWER_KEYS.priorities, [])
      };
      
      const commonKeysSet = new Set(Object.values(COMMON_ANSWER_KEYS).flat());

      Object.keys(answers).forEach(key => {
        if (!commonKeysSet.has(key)) {
          specificAnswers[key] = answers[key];
        }
      });
      
      const payload = {
        commonAnswers: mappedCommonAnswers,
        specificAnswers
      };
      
      const res = await recommendationApi.getRecommendation(payload);
      if (res.success) {
        const resultData = { ...res };
        delete resultData.success;
        delete resultData.message;
        sessionStorage.setItem('quizResult', JSON.stringify(resultData));
        navigate('/result');
      } else {
        setError(res.message || 'Có lỗi xảy ra khi phân tích kết quả');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && allQuestions.length === 0) return <Loading fullScreen />;
  if (error && allQuestions.length === 0) return <ErrorMessage message={error} />;
  if (!currentQuestion) return null;

  const currentAns = answers[currentQuestion.question_key];
  const isMultiple = currentQuestion.type === 'multiple';
  const hasAnswered = isMultiple ? (currentAns && currentAns.length > 0) : !!currentAns;
  const isLastStep = currentStep === allQuestions.length - 1;

  return (
    <main className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[#f5f8f6] py-8 sm:py-12 lg:py-16">
      <div className="pointer-events-none absolute -left-28 top-20 h-72 w-72 rounded-full bg-primary-100/55 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-white blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 rounded-[22px] border border-[#e2e9e5] bg-white/90 p-4 shadow-[0_10px_32px_rgba(32,55,43,0.055)] backdrop-blur sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-extrabold text-[#34443a]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-50 text-primary-700">
                <ListChecks className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              </span>
              Tiến độ tư vấn
            </div>
            <span className="rounded-full border border-primary-100 bg-primary-50 px-3 py-1 text-xs font-extrabold text-primary-700">
              {currentStep + 1} / {allQuestions.length}
            </span>
          </div>
          <ProgressBar current={currentStep + 1} total={allQuestions.length} />
        </div>

        <section className="overflow-hidden rounded-[28px] border border-[#e1e8e4] bg-white shadow-[0_24px_70px_rgba(32,55,43,0.09)]">
          <div className="border-b border-[#edf1ef] bg-gradient-to-br from-white via-white to-primary-50/60 px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
            <div className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-primary-700">
              <Sparkles className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
              Câu {currentStep + 1}
            </div>
            <h1 className="max-w-3xl text-2xl font-black leading-tight tracking-[-0.035em] text-[#111a14] sm:text-3xl">
              {currentQuestion.question}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-[#718078] sm:text-base">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-500" strokeWidth={1.8} aria-hidden="true" />
              {isMultiple ? 'Bạn có thể chọn nhiều đáp án' : 'Chọn một đáp án phù hợp nhất'}
            </p>
          </div>

          <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
            <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = isMultiple
                  ? (currentAns && currentAns.includes(opt.value))
                  : currentAns === opt.value;

                return (
                  <QuizOption
                    key={idx}
                    label={opt.label}
                    selected={isSelected}
                    isMultiple={isMultiple}
                    onClick={() => handleOptionClick(opt.value)}
                  />
                );
              })}
            </div>

            {error && <div className="mt-5"><ErrorMessage message={error} /></div>}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#edf1ef] pt-6">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0 || submitting}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-bold text-[#58685e] transition hover:bg-[#f1f5f2] hover:text-primary-700 sm:px-5 ${currentStep === 0 ? 'invisible' : ''}`}
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
                Quay lại
              </button>

              <Button
                onClick={handleNext}
                disabled={!hasAnswered}
                isLoading={submitting}
                className="min-w-36 px-6 shadow-[0_10px_24px_rgba(37,200,117,0.22)] sm:min-w-44"
              >
                <span className="inline-flex items-center gap-2">
                  {isLastStep ? 'Hoàn thành' : 'Tiếp tục'}
                  {!submitting && <ArrowRight className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />}
                </span>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default QuizPage;
