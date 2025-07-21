import Timer from '@/components/Timer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Timer />
      </div>
    </div>
  );
}
