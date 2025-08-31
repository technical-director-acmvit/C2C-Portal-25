import Image from 'next/image';
import DotGrid from './DotGrid';

const About = ({ children }: { children?: React.ReactNode }) => (
	<div className="w-full h-[600px] relative overflow-hidden">
		<DotGrid dotSize={3} gap={25} baseColor="#a3a3a3" className='z-50' />
		{/* Absolutely center the text and ensure it's above the canvas */}
		<div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
			<div className="w-[994px] text-justify justify-start text-zinc-100 text-3xl font-normal leading-10 pointer-events-auto" style={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
				Id qui cupidatat dolor veniam incididunt. Sint sit officia eu deserunt dolore officia anim labore deserunt incididunt consectetur do. Magna incididunt aliqua nisi Lorem. Pariatur sit non ex tempor est excepteur occaecat reprehenderit ex velit laboris esse cillum incididunt ullamco.
			</div>
			{children}
		</div>
		<Image
			src="/Landing/hdmi.svg"
			alt="HDMI Decorative"
			width={450}
			height={355}
			className="absolute right-0 bottom-0 z-100 pointer-events-none select-none"
			draggable={false}
			priority
		/>
	</div>
);

export default About;
