import Image from 'next/image'
import darkmug from '../public/dark-mug.png'
import lightmug from '../public/light-mug.png'
import Link from 'next/link';

const Sidebar = () => (
  <div className="p-3 w-80 flex-none">
    <div className="flex justify-center">
      <picture>
        <source srcSet={darkmug.src} media="(prefers-color-scheme: dark)" />
        <Image
            src={lightmug}
            alt="A stylized mug"
            width={100}
        />
      </picture>
    </div>

    <Link href="/"><h1 className="text-2xl font-bold underline-wave text-center mb-5">Joel Sumner Smith</h1></Link>
    <p className="grow mb-2 text-center">VP of Product @ <a href="https://tokenterminal.com" target="blank" className="underline-wave">Token Terminal</a>.</p>
    <p className="grow text-center">Analogical thinker in an analytical world.</p>
    <p className="mt-3 text-center">© 2023, Joel Sumner Smith</p>
  </div>
);

export default Sidebar;

