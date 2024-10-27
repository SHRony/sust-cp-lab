import Image from "next/image"
import loaderIcon from "@/public/loader.gif"
export default function Loading() {
    return <Image src={loaderIcon} alt="loader" />
  }