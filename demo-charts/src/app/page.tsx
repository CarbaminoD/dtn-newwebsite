import PriceIndexChart from '@/components/price-index-chart';
import TradeChart from '@/components/trade-chart';
import MvaChart from '@/components/mva-chart';
import ThailandMapChart from '@/components/thailand-map-chart';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8 space-y-6">
      <PriceIndexChart />
      <TradeChart />
      <MvaChart />
      <ThailandMapChart />
    </main>
  );
}
