import Image from 'next/image';
import TeamUp from './teamUp';
import { useState } from 'react';
import { signupExternal } from '../../api/signup';

const External = () => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        collegeName: '',
        gender: '',
        contactNumber: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isFormValid = () => {
        return formData.name.trim() !== '' &&
               formData.email.trim() !== '' &&
               formData.collegeName.trim() !== '' &&
               formData.gender !== '' &&
               formData.contactNumber.trim() !== '';
    };

    const handleSubmit = async () => {
        if (!isFormValid()) return;
        setLoading(true);
        setError(null);
        try {
            await signupExternal({
                name: formData.name,
                email: formData.email,
                contact_number: formData.contactNumber,
                gender: formData.gender,
                college_name: formData.collegeName,
            });
            setSubmitted(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Signup failed');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return <TeamUp />;
    }

    return (
        <div className="fixed inset-0 w-screen h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url(/portal/bg1.svg)' }}>
            {/* Logo top left */}
            <div className="absolute top-6 left-18">
                <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
            </div>
            {/* Centered card for external info */}
            <div className="flex items-center justify-center h-full">
                <div className="bg-gray-900 rounded-xl shadow-lg p-10 w-full max-w-md flex flex-col gap-6">
                    <h2 className="text-2xl font-bold text-center mb-4 text-white">STUDENT INFORMATION</h2>
                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <input 
                        className="border rounded-md p-3" 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Name" 
                    />
                    <input 
                        className="border rounded-md p-3" 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email" 
                    />
                    <input 
                        className="border rounded-md p-3" 
                        type="text" 
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleInputChange}
                        placeholder="College's Name" 
                    />
                    <select 
                        className="border rounded-md p-3" 
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled>Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <input 
                        className="border rounded-md p-3" 
                        type="tel" 
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Contact Number" 
                    />
                    <button 
                        className={`px-8 py-4 rounded-lg text-white text-xl font-semibold mt-4 ${
                            isFormValid() 
                                ? 'cursor-pointer' 
                                : 'cursor-not-allowed opacity-50'
                        }`}
                        style={{ backgroundColor: '#5EBF94' }}
                        onClick={handleSubmit}
                        disabled={!isFormValid() || loading}
                    >
                        {loading ? 'Submitting…' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default External;
