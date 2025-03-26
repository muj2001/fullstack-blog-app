export default function Button({
  onClick = null,
  bgColor = "bg-teal-500",
  hoverBgColor = "hover:bg-teal-800",
  textColor = "text-white",
  fontSize = null,
  children,
}) {
  <button
    onClick={onClick}
    className={`${bgColor} !px-4 !py-2 ${textColor} rounded-xl !mt-2 duration-75 ${hoverBgColor} ${
      fontSize ? fontSize : ""
    }`}
  >
    {children}
  </button>;
  return;
}
