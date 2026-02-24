import { useEffect, useState } from "react";
import { getMemberPayments } from "../../../services/gymAdminService";

const PaymentHistory = ({ memberId }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    getMemberPayments(memberId).then(setPayments);
  }, [memberId]);

  if (!payments.length) return <p>No payments found</p>;

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Amount</th>
          <th>Method</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {payments.map(p => (
          <tr key={p.id}>
            <td>{p.created_at}</td>
            <td>${p.amount}</td>
            <td>{p.method}</td>
            <td>{p.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PaymentHistory;
