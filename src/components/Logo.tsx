import Image from "next/image";

export default function Logo() {
  return (
    <div>
      <Image src={"/logo.png"} alt="inv0ice" width={140} height={40} />
    </div>
  );
}
