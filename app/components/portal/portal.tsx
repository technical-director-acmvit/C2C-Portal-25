"use client"
import External from './external';
import Image from 'next/image';
import Internal from './internal';
import { useState } from 'react';

const Portal = () => {
    const [selected, setSelected] = useState<'internal' | 'external' | null>(null);

    if (selected === 'internal') {
        return <Internal />;
    }
    if (selected === 'external') {
        return <External />;
    }

    return (
        <div className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/portal/bg1.svg)' }}>
            {/* Logo top left */}
            <div className="absolute top-6 left-18">
                <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
            </div>
            {/* Centered text and buttons */}
            <div className="flex flex-col items-center justify-center h-full">
                <h1 className="text-white text-4xl font-bold mb-8">Are you in VIT</h1>
                <div className="flex gap-8">
                    <button
                        className="px-8 py-4 rounded-lg text-white text-2xl font-semibold"
                        style={{ backgroundColor: '#5EBF94' }}
                        onClick={() => setSelected('internal')}
                    >
                        Yes
                    </button>
                    <button
                        className="px-8 py-4 rounded-lg text-white text-2xl font-semibold"
                        style={{ backgroundColor: '#5EBF94' }}
                        onClick={() => setSelected('external')}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Portal;