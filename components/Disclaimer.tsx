import { Info } from 'lucide-react';

export function Disclaimer({ children }: { children?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-sun-50 border border-sun-200 p-4 flex gap-3">
      <Info className="w-5 h-5 text-sun-700 shrink-0 mt-0.5" />
      <div className="text-sm text-sun-900 leading-relaxed">
        {children ?? (
          <>
            <strong>Planning estimate, not a bill.</strong> Costs vary widely by location, provider,
            insurance plan, and family choices. Talk with your pediatrician for medical questions and
            your insurer or HR for benefit specifics.
          </>
        )}
      </div>
    </div>
  );
}
