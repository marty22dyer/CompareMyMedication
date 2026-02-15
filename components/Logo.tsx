import Image from "next/image";

export default function Logo() {
  return (
    <Image
      src="/CompareMyMedication_logo.png"
      alt="Compare My Medication"
      width={300}
      height={75}
      className="logo-image"
      priority
      unoptimized
    />
  );
}
