export default function FormattedContent({ content }) {
  console.log(content);
  return (
    <>
      {content.split("\n").map((line, index) => {
        if (line.startsWith("## ")) {
          return (
            <h3
              className={`font-light ${
                index === 0 ? "!mt-8" : "!mt-4"
              } text-2xl text-gray-900`}
              key={index}
            >
              {line.slice(3)}
            </h3>
          );
        } else if (line.startsWith("# ")) {
          return (
            <h2
              className={`font-light ${
                index === 0 ? "!mt-8" : "!mt-3"
              } text-4xl text-gray-900`}
              key={index}
            >
              {line.slice(2)}
            </h2>
          );
        }
        return (
          <p className={`${index === 0 ? "!mt-8" : "!mt-2"}`} key={index}>
            {line}
          </p>
        );
      })}
    </>
  );
}
