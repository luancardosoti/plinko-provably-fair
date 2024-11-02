import { GameHistory } from '../../components/game-history';
import { Plinko } from '../../components/plinko';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-6xl w-full">
        <Plinko />
        <GameHistory />
      </div>
    </div>
  );
}