'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { apiService } from '../services/api';

export default function Verification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  useEffect(() => {
    if (!email) {
      router.push('/registration');
      return;
    }
    inputRefs.current[0]?.focus();

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, router]);

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (isResending) return;
    
    try {
      setIsResending(true);
      setError('');
      await apiService.register({ email }); 
      setTimeLeft(300);
      setOtp(['', '', '', '', '', '']);
      setError('OTP resent successfully');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    if (isSubmitting) return;
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    if (timeLeft === 0) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');
      await apiService.verifyOTP({ email, otp: otpString });
      
      router.push('/congratulations');
    } catch (err) {
      setError(err.message || 'Verification failed');
      if (err.message?.includes('expired')) {
        setTimeLeft(0);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-2xl font-bold text-center text-gray-900">ENTER OTP</h1>
        
        <div className="text-center mb-4">
          <span className={`text-lg font-semibold ${timeLeft <= 30 ? 'text-red-500' : 'text-gray-600'}`}>
            {formatTime()}
          </span>
        </div>

        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={el => inputRefs.current[index] = el}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`w-12 h-14 text-center text-xl border-2 ${
                timeLeft === 0 ? 'border-gray-300' : 'border-[#006241]'
              } rounded-lg focus:outline-none focus:border-[#004d32]`}
              disabled={timeLeft === 0 || isSubmitting}
            />
          ))}
        </div>

        {error && (
          <p className={`text-center text-sm ${
            error.includes('successfully') ? 'text-green-500' : 'text-red-500'
          }`}>
            {error}
          </p>
        )}

        <div className="text-center text-sm text-gray-600">
          {timeLeft === 0 ? (
            <span>OTP expired. Please click {' '}
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-[#006241] hover:text-[#004d32] font-medium disabled:text-gray-400"
              >
                resend
              </button>
            </span>
          ) : (
            <>
              Didn't receive an OTP?{' '}
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-[#006241] hover:text-[#004d32] font-medium disabled:text-gray-400"
              >
                Resend
              </button>
            </>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={timeLeft === 0 || isSubmitting}
          className={`w-full py-3 ${
            timeLeft === 0 || isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-[#006241] hover:bg-[#004d32]'
          } text-white rounded-lg transition-colors`}
        >
          {isSubmitting ? 'Verifying...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
}
