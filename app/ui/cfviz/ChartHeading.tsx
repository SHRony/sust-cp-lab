
export default function ChartHeading({text}:{text:string}) {
    return (
        <p 
        className='px-5 m-4 text-lg'
        style={{backgroundColor : 'var(--primaryContainer)', color : 'var(--primary)', borderRadius : '50px', fontWeight : 'bold'}}
        >
            {text}
        </p>
    )
}