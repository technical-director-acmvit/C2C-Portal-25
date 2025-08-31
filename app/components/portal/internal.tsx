"use client";

import { useState } from 'react';
import TeamUp from './team-up';
import PortalButton from './ui/button';
import { signupInternal } from '../../actions/signup';
import BackChevron from './ui/back-chevron';
import Select from './ui/select';
import Image from 'next/image';

interface Props { onBack?: () => void }
const Internal = ({ onBack }: Props) => {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        registrationNumber: '',
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
        return formData.registrationNumber.trim() !== '' &&
               formData.gender !== '' &&
               formData.contactNumber.trim() !== '';
    };

    const handleSubmit = async () => {
        if (isFormValid()) {
            setLoading(true);
            setError(null);
            
            try {
                await signupInternal({
                    contact_number: formData.contactNumber,
                    gender: formData.gender,
                    reg_no: formData.registrationNumber
                });
                
                setSubmitted(true);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Signup failed');
            } finally {
                setLoading(false);
            }
        }
    };

    if (submitted) {
        return <TeamUp />;
    }

    return (
        <div className="fixed inset-0 w-screen h-screen relative">
            {/* Background image via next/image */}
            <Image src="/portal/bg1.svg" alt="" aria-hidden fill className="object-cover" />
            {/* <div className="absolute top-6 left-6 sm:left-8">
                <Image src="/portal/logo.svg" alt="Logo" width={200} height={200} />
            </div> */}
            <div className="flex items-center justify-center h-full relative z-10">
                <div
                    className="w-full max-w-lg p-6 sm:p-8 rounded-2xl"
                    style={{
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))',
                        backdropFilter: 'blur(10px) saturate(120%)',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.55), 0 6px 24px rgba(72,186,134,0.06) inset, 0 1px 0 rgba(255,255,255,0.02) inset',
                        border: '1px solid rgba(255,255,255,0.10)'
                    }}
                >
                    <div className="flex items-center gap-3 mb-6">
                      <BackChevron onClick={onBack} />
                      <h2 className="text-2xl sm:text-3xl font-semibold text-white" style={{ fontFamily: "'Pilat Extended', 'Trap', Arial, sans-serif" }}>Student Details</h2>
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <label className="text-sm text-gray-300 mb-2">Registration Number</label>
                    <input
                        className="w-full bg-[#111213]/60 border border-white/10 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#48BA86]/40"
                        type="text"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleInputChange}
                        placeholder="Registration Number"
                    />

                    <label className="text-sm text-gray-300 mt-3 mb-2">Gender</label>
                    <Select
                        id="gender"
                        value={formData.gender}
                        onChange={(val: string) => setFormData(prev => ({ ...prev, gender: val }))}
                        options={[
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                        ]}
                        placeholder="Gender"
                        className=""
                    />

                    <label className="text-sm text-gray-300 mt-3 mb-2">Contact Number</label>
                    <input
                        className="w-full bg-[#111213]/60 border border-white/10 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
                        type="tel"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Contact Number"
                    />

                    <div className="flex justify-center mt-6">
                        <PortalButton onClick={handleSubmit} disabled={!isFormValid() || loading} className={`px-6 py-2 text-[20px] ${isFormValid() && !loading ? '' : 'opacity-50 cursor-not-allowed'}`}>
                            {loading ? 'Submitting…' : 'Proceed'}
                        </PortalButton>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Internal;
