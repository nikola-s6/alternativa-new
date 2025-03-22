type SecondaryHeaderProps = {
  title: string;
};
export default function SecondaryHeader({ title }: SecondaryHeaderProps) {
  return (
    <section
      className='py-16 relative overflow-hidden'
      style={{
        backgroundImage: `linear-gradient(to right, rgba(0,51,110,0.95), rgba(0,51,110,0.8)), url('/cukarica/slika2.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <h1 className='text-6xl font-extrabold text-white text-center uppercase'>
        {title}
      </h1>
    </section>
  );
}
