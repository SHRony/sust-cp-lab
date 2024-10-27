import loaderIcon from '@/public/loader.gif'
import Image from "next/image";

export default function Loader() {
    return <Image src={loaderIcon} alt="loader" />
  }