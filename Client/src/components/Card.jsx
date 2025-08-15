export default function Card({ children }) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-white via-blue-50 to-teal-50 shadow-lg p-8">
      {children}
    </div>
  );
}