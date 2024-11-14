export default function Spinner({
  loading,
  tip = "Loading...",
}: {
  loading: boolean;
  tip?: string;
}) {
  if (!loading) return null;
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="spinner"></div>
      <div>{tip}</div>
    </div>
  );
}
