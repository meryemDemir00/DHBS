export default function Card({ title, value, color }) {
  return (
    <div className={`rounded-xl p-5 shadow bg-white border-l-4 ${color}`}>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold mt-1 text-teal-900">{value}</p>
    </div>
  );
}