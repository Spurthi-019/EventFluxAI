import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  return (
    <>
    <nav className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-xl z-20 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            {/*Logo*/}
          <Link href={"/"}className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="EventFluxAI Logo" 
              width={500} 
              height={500}
              className="w-12 h-12"
              priority
            />
            </Link>
            <h1 className="text-2xl font-bold text-cyan-400">EventFluxAI</h1>

            {/* Search and Location - Desktop only*/ }
            </div>
      
    </nav>

    {/* Models */}
    </>
  );
};

export default Header;
