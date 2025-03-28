'use client';


export default function Congratulations() {
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <div className="w-24 h-24 mx-auto bg-[#006241] rounded-full flex items-center justify-center">
          <svg 
            className="w-16 h-16 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">
          Successful!
        </h1>
        
        <p className="text-gray-600">
          Your registration is complete. We've sent a QR code to your email.
        </p>

        
      </div>
    </div>
  );
}