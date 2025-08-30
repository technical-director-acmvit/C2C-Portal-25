import Image from 'next/image';
const External = () => {
    return (
        <div className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/portal/bg1.svg)' }}>
            {/* Logo top left */}
            <div className="absolute top-6 left-18">
                <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
            </div>
            {/* Centered card for external info */}
            <div className="flex items-center justify-center h-full">
                <div className="bg-gray-900 rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-center mb-4">STUDENT INFORMATION</h2>
                    <input className="border rounded-md p-3" type="text" placeholder="Name" />
                    <input className="border rounded-md p-3" type="email" placeholder="Email" />
                    <input className="border rounded-md p-3" type="text" placeholder="College's Name" />
                    <select className="border rounded-md p-3" defaultValue="">
                        <option value="" disabled>Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <input className="border rounded-md p-3" type="tel" placeholder="Contact Number" />
                </div>
            </div>
        </div>
    );
};
export default External;