'use client';
import { useState } from "react";
import { apiService } from "../services/api";
import { useRouter } from 'next/navigation';

export default function Register(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
 
  const checkValidity = async () => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      const data = await apiService.register({ name, email });
      setError(data.message);
      router.push(`/verification?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const isDisabled= !name || !email || !isValidEmail(email);
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    if (!newEmail) {
      setError("Email is required");
    } else if (!isValidEmail(newEmail)) {
      setError("Please enter a valid email address");
    } else {
      setError("We will send an OTP on this registered email for authentication");
    }
  };
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    if (!newName) {
      setError("Name is required");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!isDisabled) {
      await checkValidity();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-[#006241] mb-6">Enter your details</h1>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-1">Name</label>
          <input
            onChange={handleNameChange}
            value={name}
            type="text"
            placeholder="Enter name"
            className="w-full border-b border-gray-400 outline-none py-2 focus:border-[#006241]"
          />
        </div>
        <div className="mb-6 relative">
          <label className="block text-gray-700 font-semibold mb-1">Email ID</label>
          <input
            onChange={handleEmailChange}
            value={email}
            type="email"
            placeholder="Enter email"
            className="w-full border-b border-gray-400 outline-none py-2 focus:border-[#006241] pr-10"
          />
          
          <p className="text-xs text-gray-500 ">{error}</p>
        </div>
        <button 
          type="submit"
          disabled={isDisabled || isSubmitting}
          className={`w-full py-2 rounded-lg ${
            isDisabled || isSubmitting
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-[#006241] hover:bg-[#004d32]'
          } text-white`}>
          {isSubmitting ? 'Submitting...' : 'Continue'}
        </button>
      </form>
    </div>
  );
} 