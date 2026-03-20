import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useEffect, useState } from "react";
import {
  getPlatformBilling,
  getPlatformMemberGrowth,
} from "../../services/gymAdminService";

export default function RevenuePage() {
  const [billing, setBilling] = useState(null);
  const [growth, setGrowth] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [billingRes, growthRes] = await Promise.all([
        getPlatformBilling(),
        getPlatformMemberGrowth(),
      ]);

      setBilling(billingRes);
      setGrowth(growthRes.series || []);
    };

    load();
  }, []);

  if (!billing) {
    return <div style={{ padding: 20 }}>Loading billing report...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Platform Billing</h2>
      <p>Current members: {billing.pricing_breakdown.member_count}</p>
      <p>Base price: KES {billing.pricing_breakdown.base_price.toLocaleString()}</p>
      <p>Extra members: {billing.pricing_breakdown.extra_members}</p>
      <p>Extra tiers: {billing.pricing_breakdown.extra_tiers}</p>
      <p>Extra cost: KES {billing.pricing_breakdown.extra_cost.toLocaleString()}</p>
      <p>
        <strong>
          Final invoice: KES {billing.pricing_breakdown.final_price.toLocaleString()}
        </strong>
      </p>
      <p>Rule: first 50 active members are KES 10,000, then each additional block of up to 50 members adds KES 10,000.</p>

      <h3 style={{ marginTop: 32 }}>Monthly Member Increase</h3>
      <LineChart width={800} height={300} data={growth}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short" })
          }
        />
        <YAxis allowDecimals={false} />
        <Tooltip
          labelFormatter={(value) =>
            new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "long" })
          }
        />
        <Line dataKey="new_members" strokeWidth={2} />
      </LineChart>
    </div>
  );
}
