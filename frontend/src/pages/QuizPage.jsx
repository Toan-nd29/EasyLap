import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import quizApi from '../api/quizApi';
import recommendationApi from '../api/recommendationApi';
import QuizOption from '../components/QuizOption';
import ProgressBar from '../components/ProgressBar';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { ArrowLeft } from 'lucide-react';

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

  useEffect(() => {
    fetchCommonQuestions();
  }, []);

  const fetchCommonQuestions = async () => {
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
  };

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
      
      if (qKey === 'common_user_group' && value !== userGroup) {
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
        userGroup: answers['common_user_group'] || '',
        budget: answers['common_budget'] || '',
        mobility: answers['common_mobility'] || '',
        usageYears: answers['common_usage_years'] || '',
        priorities: answers['common_priorities'] || []
      };
      
      const commonKeysSet = new Set([
        'common_user_group', 'common_budget', 'common_mobility', 'common_usage_years', 'common_priorities'
      ]);

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
        const { success, message, ...resultData } = res;
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

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProgressBar current={currentStep + 1} total={allQuestions.length} />
        
        <div className="text-sm text-gray-500 font-medium mb-4">
          Câu {currentStep + 1} / {allQuestions.length}
        </div>
        
        <div className="card shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentQuestion.question}</h2>
          <p className="text-gray-500 mb-6">
            {isMultiple ? '(Có thể chọn nhiều đáp án)' : '(Chọn 1 đáp án)'}
          </p>
          
          <div className="space-y-3 mb-8">
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
          
          {error && <div className="mb-4"><ErrorMessage message={error} /></div>}
          
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <button 
              onClick={handleBack} 
              disabled={currentStep === 0 || submitting}
              className={`flex items-center text-gray-600 hover:text-primary-600 font-medium transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
            >
              <ArrowLeft className="w-5 h-5 mr-1" /> Quay lại
            </button>
            
            <Button 
              onClick={handleNext}
              disabled={!hasAnswered}
              isLoading={submitting}
              className="px-8"
            >
              {currentStep === allQuestions.length - 1 ? 'Hoàn thành' : 'Tiếp tục'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
