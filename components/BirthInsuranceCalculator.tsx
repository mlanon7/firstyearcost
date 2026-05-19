'use client';

import { useMemo, useState } from 'react';
import { Segmented } from './Segmented';
import { tipsInsurance, tipsDelivery, tipsNewbornOnSeparate } from '@/content/optionTips';
import { Disclaimer } from './Disclaimer';
import {
  birthOOPRanges,
  newbornMedicalOOP,
  birthBilledAnchors,
  getNewbornDeductibleAddon,
} from '@/data/assumptions';
import { formatUSD } from '@/lib/format';

type Insurance = 'employer' | 'marketplace' | 'medicaid' | 'uninsured';
type Delivery = 'unknown' | 'vaginal' | 'csection';

export function BirthInsuranceCalculator() {
  const [insurance, setInsurance] = useState<Insurance>('employer');
  const [delivery, setDelivery] = useState<Delivery>('unknown');
  const [deductibleRemaining, setDeductibleRemaining] = useState<number | ''>('');
  const [oopMaxRemaining, setOopMaxRemaining] = useState<number | ''>('');
  const [hospitalCoinsurance, setHospitalCoinsurance] = useState<number | ''>('');
  const [newbornOnSeparate, setNewbornOnSeparate] = useState<'yes'|'no'|'unsure'>('unsure');

  const result = useMemo(() => {
    const insBirth = birthOOPRanges[insurance];
    const birth = delivery === 'unknown'
      ? {
          low: (insBirth.vaginal.low + insBirth.csection.low) / 2,
          mid: (insBirth.vaginal.mid + insBirth.csection.mid) / 2,
          high: (insBirth.vaginal.high + insBirth.csection.high) / 2,
        }
      : insBirth[delivery];

    const newborn = newbornMedicalOOP[insurance];

    // Optional refinement based on user-entered numbers
    let adjustedMid = birth.mid;
    if (typeof deductibleRemaining === 'number' && typeof oopMaxRemaining === 'number') {
      // Rough model:
      //   - You first owe `deductibleRemaining` out of pocket.
      //   - On the remaining billed amount above your deductible, you owe `coinsurance %`.
      //   - Total OOP is capped at `oopMaxRemaining`.
      // We use the mid total billed for the chosen delivery type as a proxy for billed cost,
      // anchored to the published averages from public/data/birth_billed_anchors.csv.
      const billedTotal =
        delivery === 'csection' ? birthBilledAnchors.csection :
        delivery === 'vaginal'  ? birthBilledAnchors.vaginal :
        (birthBilledAnchors.csection + birthBilledAnchors.vaginal) / 2;
      const coinsPct =
        typeof hospitalCoinsurance === 'number'
          ? Math.min(100, Math.max(0, hospitalCoinsurance)) / 100
          : 0.2; // default to 20% if user leaves it blank
      const postDeductibleSpend = Math.max(0, billedTotal - deductibleRemaining);
      const userPaysAfterDeductible = postDeductibleSpend * coinsPct;
      const modeled = deductibleRemaining + userPaysAfterDeductible;
      adjustedMid = Math.min(oopMaxRemaining, Math.max(deductibleRemaining, modeled));
    }

    // A separate newborn deductible adds a typical additional exposure that
    // varies by plan type. When the user is unsure, we still add a partial-
    // likelihood share rather than zero so the mid estimate reflects an
    // average across plan structures. All values come from
    // public/data/birth_newborn_deductible_addons.csv.
    const extraNewborn = getNewbornDeductibleAddon(insurance, newbornOnSeparate);

    return {
      birth,
      newborn,
      total: {
        low: birth.low + newborn.low,
        mid: adjustedMid + newborn.mid + extraNewborn,
        high: birth.high + newborn.high + extraNewborn,
      },
    };
  }, [insurance, delivery, deductibleRemaining, oopMaxRemaining, hospitalCoinsurance, newbornOnSeparate]);

  return (
    <div className="grid lg:grid-cols-[1fr_minmax(0,420px)] gap-6">
      <div className="card p-6 lg:p-8 space-y-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <Segmented
              label="Insurance type"
              value={insurance}
              onChange={setInsurance}
              options={[
                { value: 'employer',    label: 'Employer plan', info: tipsInsurance.employer    },
                { value: 'marketplace', label: 'Marketplace',   info: tipsInsurance.marketplace },
                { value: 'medicaid',    label: 'Medicaid',      info: tipsInsurance.medicaid    },
                { value: 'uninsured',   label: 'Uninsured',     info: tipsInsurance.uninsured   },
              ]}
            />
          </div>
          <div>
            <Segmented
              label="Expected delivery"
              value={delivery}
              onChange={setDelivery}
              options={[
                { value: 'unknown',  label: 'Unknown',   info: tipsDelivery.unknown  },
                { value: 'vaginal',  label: 'Vaginal',   info: tipsDelivery.vaginal  },
                { value: 'csection', label: 'C-section', info: tipsDelivery.csection },
              ]}
            />
          </div>
        </div>

        {(insurance === 'employer' || insurance === 'marketplace') && (
          <>
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="label">Deductible remaining</label>
                <input className="input" type="number" min={0} placeholder="e.g. 2500"
                  value={deductibleRemaining}
                  onChange={(e) => setDeductibleRemaining(e.target.value === '' ? '' : Number(e.target.value))} />
                <p className="help">Optional</p>
              </div>
              <div>
                <label className="label">Out-of-pocket max remaining</label>
                <input className="input" type="number" min={0} placeholder="e.g. 6000"
                  value={oopMaxRemaining}
                  onChange={(e) => setOopMaxRemaining(e.target.value === '' ? '' : Number(e.target.value))} />
                <p className="help">Optional</p>
              </div>
              <div>
                <label className="label">Hospital coinsurance %</label>
                <input className="input" type="number" min={0} max={100} placeholder="e.g. 20"
                  value={hospitalCoinsurance}
                  onChange={(e) => setHospitalCoinsurance(e.target.value === '' ? '' : Number(e.target.value))} />
                <p className="help">Optional, after deductible</p>
              </div>
            </div>

            <div>
              <Segmented
                label="Newborn on separate deductible?"
                value={newbornOnSeparate}
                onChange={setNewbornOnSeparate}
                options={[
                  { value: 'unsure', label: 'Unsure', info: tipsNewbornOnSeparate.unsure },
                  { value: 'yes',    label: 'Yes',    info: tipsNewbornOnSeparate.yes    },
                  { value: 'no',     label: 'No',     info: tipsNewbornOnSeparate.no     },
                ]}
                help="Some plans run the newborn under a separate deductible — call your insurer to confirm."
              />
            </div>
          </>
        )}

        <div>
          <h3 className="font-semibold text-ink-900 mb-3">Questions to ask your insurer</h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-ink-700">
            {[
              "Is my OB-GYN, hospital, and anesthesiologist all in-network?",
              "Is the hospital's pediatric group in-network for the newborn?",
              "Is the newborn covered under my deductible or theirs?",
              "How long do I have to add the baby to my plan after birth?",
              "What does my plan cover for breast pumps and lactation consultants?",
              "What's covered for newborn screening and circumcision?",
              "What's the average maternity facility fee at my hospital?",
              "Are there any pre-authorization requirements I need to file?",
            ].map((q) => (
              <li key={q} className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-coral-500 mt-2 shrink-0" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-ink-900 mb-3">Questions to ask hospital billing</h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-ink-700">
            {[
              "Can I get a written cost estimate before delivery?",
              "Are there bundled / global maternity packages?",
              "What's the cash discount if I pay before delivery?",
              "Are there income-based financial assistance programs?",
              "What's the charity care policy if I'm uninsured?",
              "Is the anesthesiologist billed separately?",
              "What payment plans are available after birth?",
              "How long do bills usually take to arrive?",
            ].map((q) => (
              <li key={q} className="flex gap-2 items-start">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-2 shrink-0" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <aside className="lg:sticky lg:top-20 self-start space-y-5 print:static">
        <div className="card p-6 bg-gradient-to-br from-white to-coral-50/40 border-coral-200">
          <p className="pill pill-coral mb-2">Planning out-of-pocket range</p>
          <p className="text-4xl font-extrabold tracking-tight text-ink-900 tabular-nums">
            {formatUSD(result.total.mid)}
          </p>
          <p className="mt-1 text-sm text-ink-600 tabular-nums">
            Range {formatUSD(result.total.low)} – {formatUSD(result.total.high)}
          </p>
          <hr className="my-4 border-ink-100" />
          <div className="flex justify-between text-sm py-1">
            <span className="text-ink-600">Birth & delivery</span>
            <span className="font-semibold text-ink-900 tabular-nums">{formatUSD(result.birth.mid)}</span>
          </div>
          <div className="flex justify-between text-sm py-1">
            <span className="text-ink-600">Newborn medical (yr 1)</span>
            <span className="font-semibold text-ink-900 tabular-nums">{formatUSD(result.newborn.mid)}</span>
          </div>
        </div>

        <div className="card p-6 text-sm text-ink-700">
          <h3 className="font-semibold text-ink-900 mb-3">National benchmarks</h3>
          <ul className="space-y-2">
            <li><strong>Employer plan added cost from giving birth:</strong> ~$18,865 average pregnancy + birth + postpartum (KFF, Aug 2024)</li>
            <li><strong>Employer plan OOP from giving birth:</strong> ~$2,854 average parent share (KFF, Aug 2024)</li>
            <li><strong>Vaginal delivery (employer):</strong> ~$15,712 total / ~$2,563 OOP (Peterson-KFF)</li>
            <li><strong>C-section (employer):</strong> ~$28,998 total / ~$3,071 OOP (Peterson-KFF)</li>
          </ul>
          <p className="mt-3 text-xs text-ink-500">
            Source: KFF analysis (Aug 2024) and Peterson-KFF Health System Tracker. National averages — your bill will vary.
          </p>
        </div>

        <Disclaimer>
          <strong>This tool does not tell you what your insurance will pay.</strong> Use it for planning ranges
          and questions to ask. Always verify with your insurer and hospital before delivery.
        </Disclaimer>
      </aside>
    </div>
  );
}
