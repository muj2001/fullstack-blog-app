import { ColorRing } from "react-loader-spinner";

export default function Loader() {
  return (
    <div className="flex items-center justify-center !py-16 flex-1">
      <ColorRing
        colors={["#10B981", "#10B981", "#10B981", "#38bdf8", "#38bdf8"]}
      />
    </div>
  );
}
