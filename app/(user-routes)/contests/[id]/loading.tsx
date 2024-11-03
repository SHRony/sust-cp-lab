import Image from "next/image"
import loaderIcon from "@/public/loader.gif"
export default function Loading() {
    return(
      <div className="flex justify-center items-center w-full h-full">
        <Image src={loaderIcon} alt="loader" />
      </div>
    )
}