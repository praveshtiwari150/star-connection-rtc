
interface props{
    label: string
}
const Hero = ({label}:props) => {
  return (
    <div className='text-4xl text-cobalt-4 font-bold text-center'>
      {label}
    </div>
  )
}

export default Hero
