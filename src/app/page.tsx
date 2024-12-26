import VideoRecorder from '../components/VideoRecorder';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 mt-4">Face Tracking Application</h1>
      <VideoRecorder />
    </main>
  );
}
