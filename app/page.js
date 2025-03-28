"use client";
import { useRouter } from "next/navigation";
export default function Page() {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="w-1/3 max-w-52 aspect-square bg-[#006241] rounded-full -translate-y-10 ring-4 ring-brown ring-offset-10 ring-offset-white bg-cover bg-center" style={{ backgroundImage: "url('Avatar.jpg')" }}></div>
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Welcome to Starbucks</h1>
        <button onClick={() => router.push("/registration")} className="px-6 py-2 bg-[#006241] text-white rounded-lg hover:bg-[#004d32]">
          Register Now
        </button>
      </div>
    </div>
  );
}
