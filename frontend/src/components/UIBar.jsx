export default function UIBar() {
  return (
    <div>
      <div className="flex justify-center !my-2">
        {/* <form className="flex justify-center !my-2 border-gray-300 border-1"> */}
        <input
          className="!py-2 !px-4 border-gray-300 border-1 rounded-xl"
          type="text"
          placeholder="Search"
        ></input>
        {/* </form> */}
      </div>
    </div>
  );
}
