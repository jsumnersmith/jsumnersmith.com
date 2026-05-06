import Image from 'next/image'
import coffee from '../public/coffee.jpg'
import Link from 'next/link';

const Sidebar = () => (
  <div className="p-3 w-80 flex-none">
    <div className="flex justify-center">
      <picture>
        <source srcSet={coffee.src} media="(prefers-color-scheme: dark)" />
        <Image
            src={coffee}
            alt="A stylized mug"
            width={100}
            style={{borderRadius: 100, marginBottom: 20}}
        />
      </picture>
    </div>

    <Link href="/"><h1 className="text-2xl font-bold underline-wave text-center mb-5">Joel Sumner Smith</h1></Link>
    <p className="grow mb-2 text-center">Head of Platform @ <a href="https://mastra.ai" target="blank" className="underline-wave">Mastra</a>.</p>
    <p className="grow text-center">Analogical thinker in an analytical world.</p>
    <p className="mt-3 text-center">© {new Date().getFullYear()}, Joel Sumner Smith</p>
  </div>
);

export default Sidebar;

