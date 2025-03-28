export default function AppContainer({ children }) {
  return (
    <div className="bg-gray-100 rounded-3xl !mx-12 !my-6 !py-6 !px-12 min-h-fit flex-1 flex flex-col">
      {children}
    </div>
  );
}
