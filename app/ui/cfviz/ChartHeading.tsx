
export default function ChartHeading({text}:{text:string}) {
    return (
        <p 
        className='pr-4 px-2 mt-4 rounded-r-full bg-blue-100 text-blue-600 font-bold  tablet:text-2xl text-shadow-3xl'
        
        >
            {text}
        </p>
    )
}