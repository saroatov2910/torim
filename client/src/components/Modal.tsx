import { useModal } from "../../context/Modal.context";

export default function Modal() {
  const { content, close } = useModal();
  if (!content) return null;
  return (
    <div className=" fixed bg-[rgba(0,0,0,0.5)] grid items-center h-full w-full z-[]">
      <div className="bg-[white] min-w-[400px] min-h-[400px] rounded-lg max-w-[70%] mx-auto p-4 flex flex-col">
        <button onClick={close} className=" ml-auto">X</button>
        {content}
      </div>
    </div>
  );
}
