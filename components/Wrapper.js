import { Inter } from 'next/font/google'
import Sidebar from '../components/Sidebar'

const inter = Inter({ subsets: ['latin'] })
const Wrapper = ({children}) => (
  <main className={`flex min-h-screen max-w-7xl	mx-auto flex-row justify-between p-24 ${inter.className}`}>
    <Sidebar />
    <div className="w-full px-8">
      {children}
    </div>
  </main>
);

export default Wrapper;