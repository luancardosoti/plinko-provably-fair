import { Plinko } from '@/components/plinko/index';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-6xl w-full">
        <Plinko />
      </div>
    </div>
  );
}