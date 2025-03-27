export default function ErrorComponent({ message }) {
  return (
    <div className="flex items-center justify-center !py-16 flex-1 text-black">
      {message}
    </div>
  );
}
