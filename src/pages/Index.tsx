import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface RarityData {
  id: number;
  value: number;
  label: string;
}

const Index = () => {
  const [rarities, setRarities] = useState<RarityData[]>([
    { id: 1, value: 0, label: 'Редкость 1' },
    { id: 2, value: 0, label: 'Редкость 2' },
    { id: 3, value: 0, label: 'Редкость 3' },
    { id: 4, value: 0, label: 'Редкость 4' },
    { id: 5, value: 0, label: 'Редкость 5' },
    { id: 6, value: 0, label: 'Редкость 6' },
    { id: 7, value: 0, label: 'Редкость 7' },
    { id: 8, value: 0, label: 'Редкость 8' },
  ]);
  const [showResults, setShowResults] = useState(false);

  const handleValueChange = (id: number, newValue: string) => {
    const numValue = parseFloat(newValue) || 0;
    setRarities(rarities.map(r => 
      r.id === id ? { ...r, value: numValue } : r
    ));
    setShowResults(false);
  };

  const handleLabelChange = (id: number, newLabel: string) => {
    setRarities(rarities.map(r => 
      r.id === id ? { ...r, label: newLabel } : r
    ));
  };

  const handleReset = () => {
    setRarities(rarities.map(r => ({ ...r, value: 0 })));
    setShowResults(false);
  };

  const totalSum = rarities.reduce((sum, r) => sum + r.value, 0);

  const calculateChance = (value: number): number => {
    if (totalSum === 0) return 0;
    return (value / totalSum) * 100;
  };

  const calculateDropRate = (chance: number): string => {
    if (chance === 0) return '—';
    const rate = 100 / chance;
    if (rate < 2) return 'каждый раз';
    return `~1 из ${Math.round(rate)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Icon name="TrendingUp" size={48} className="text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Калькулятор Шансов
          </h1>
          <p className="text-slate-600 text-lg">
            Введите значения редкостей для расчёта вероятностей
          </p>
        </div>

        <Card className="p-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {rarities.map((rarity, index) => (
              <div 
                key={rarity.id} 
                className="space-y-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Input
                  value={rarity.label}
                  onChange={(e) => handleLabelChange(rarity.id, e.target.value)}
                  className="text-sm font-medium text-slate-700 border-0 bg-transparent px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Название"
                />
                <Input
                  id={`rarity-${rarity.id}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={rarity.value || ''}
                  onChange={(e) => handleValueChange(rarity.id, e.target.value)}
                  placeholder="0"
                  className="text-lg h-12 border-slate-200 focus:border-primary transition-colors"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 my-6">
            <Button 
              onClick={handleReset}
              variant="outline" 
              size="lg"
              className="text-lg px-8 h-14"
            >
              <Icon name="RotateCcw" size={20} />
              Очистить
            </Button>
            <Button 
              onClick={() => setShowResults(true)} 
              size="lg"
              className="text-lg px-12 h-14 shadow-lg hover:shadow-xl transition-all"
              disabled={totalSum === 0}
            >
              <Icon name="Sparkles" size={24} />
              Рассчитать шансы
            </Button>
          </div>

          {showResults && totalSum > 0 && (
          <div className="border-t border-slate-200 pt-8 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Icon name="Calculator" size={24} className="text-primary" />
                <span className="text-lg font-semibold text-slate-700">Общая сумма:</span>
              </div>
              <span className="text-3xl font-bold text-primary">
                {totalSum.toFixed(2)}
              </span>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Icon name="PieChart" size={20} />
                Распределение шансов
              </h3>
              
              {rarities
                .filter(r => r.value > 0)
                .sort((a, b) => calculateChance(b.value) - calculateChance(a.value))
                .map((rarity) => {
                const chance = calculateChance(rarity.value);
                const dropRate = calculateDropRate(chance);
                return (
                  <div 
                    key={rarity.id} 
                    className="space-y-2 p-4 rounded-lg bg-gradient-to-r from-slate-50/80 to-primary/5 hover:from-slate-100/80 hover:to-primary/10 transition-all border border-slate-200/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">{rarity.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">
                          {rarity.value.toFixed(2)}
                        </span>
                        <span className="text-lg font-bold text-primary min-w-[70px] text-right">
                          {chance.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={chance} 
                      className="h-2"
                    />
                    <div className="flex items-center justify-end gap-2 text-xs text-slate-500">
                      <Icon name="Dices" size={14} />
                      <span>Выпадает {dropRate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </Card>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p className="flex items-center justify-center gap-2">
            <Icon name="Info" size={16} />
            Все расчёты выполняются в реальном времени
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;