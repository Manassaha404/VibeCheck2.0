"use client";

import React, { useState } from 'react';
import { Zap } from 'lucide-react';
import { useSignPetition } from '@/hook/petition/useSignPetition';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signPetitionDto } from '@repo/services/petition/model';
import { z } from 'zod';
import { Country, City } from 'country-state-city';

type SignPetitionFormData = z.infer<typeof signPetitionDto>;

export default function SignatureForm({ petitionId, hasSigned = false }: { petitionId: string, hasSigned?: boolean }) {
  const { handleSign, isSigning, apiError } = useSignPetition();
  const [success, setSuccess] = useState(hasSigned);

  const countries = Country.getAllCountries();
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignPetitionFormData>({
    resolver: zodResolver(signPetitionDto),
    defaultValues: {
      petitionId,
      firstName: '',
      lastName: '',
      email: '',
      city: '',
      country: '',
    }
  });

  const selectedCountryCode = watch('country');
  const cities = selectedCountryCode ? City.getCitiesOfCountry(selectedCountryCode) || [] : [];

  const onSubmit = async (data: SignPetitionFormData) => {
    const countryObj = countries.find(c => c.isoCode === data.country);
    const countryName = countryObj ? countryObj.name : data.country;
    
    const res = await handleSign({ ...data, country: countryName });
    if (res?.success) {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="lg:col-span-8 bg-leaf-green border-4 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] p-8 md:p-12 relative z-20 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <Zap size={64} className="mb-6 text-ink-charcoal animate-bounce" />
        <h2 className="font-headline-lg text-headline-lg mb-4 uppercase text-ink-charcoal">
          Vibe Signed!
        </h2>
        <p className="font-body-lg text-body-lg font-bold">Thanks for standing with us!</p>
      </div>
    );
  }

  return (
    <div className="lg:col-span-8 bg-pure-white border-4 border-ink-charcoal shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] p-8 md:p-12 relative z-20">
      <h2 className="font-headline-lg text-headline-lg mb-8 uppercase text-ink-charcoal border-b-4 border-ink-charcoal pb-4">
        Sign The Vibe!
      </h2>
      {apiError && (
        <div className="mb-6 bg-[var(--color-error-container)] text-[var(--color-on-error-container)] p-4 border-2 border-ink-charcoal font-bold">
          {apiError}
        </div>
      )}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" {...register('petitionId')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-label-md text-label-md mb-2 uppercase tracking-wide" htmlFor="firstName">First Name</label>
            <input 
              {...register('firstName')}
              className={`w-full bg-pure-white border-2 ${errors.firstName ? 'border-[var(--color-vivid-coral)]' : 'border-ink-charcoal'} p-4 font-body-lg text-body-lg focus:outline-none focus:border-electric-sun focus:ring-4 focus:ring-electric-sun transition-all`} 
              id="firstName" 
              placeholder="Zappy" 
              type="text" 
            />
            {errors.firstName && <span className="text-[var(--color-vivid-coral)] text-sm mt-1 font-bold">{errors.firstName.message}</span>}
          </div>
          <div className="flex flex-col">
            <label className="font-label-md text-label-md mb-2 uppercase tracking-wide" htmlFor="lastName">Last Name</label>
            <input 
              {...register('lastName')}
              className={`w-full bg-pure-white border-2 ${errors.lastName ? 'border-[var(--color-vivid-coral)]' : 'border-ink-charcoal'} p-4 font-body-lg text-body-lg focus:outline-none focus:border-electric-sun focus:ring-4 focus:ring-electric-sun transition-all`} 
              id="lastName" 
              placeholder="McZapface" 
              type="text" 
            />
            {errors.lastName && <span className="text-[var(--color-vivid-coral)] text-sm mt-1 font-bold">{errors.lastName.message}</span>}
          </div>
        </div>
        <div className="flex flex-col">
          <label className="font-label-md text-label-md mb-2 uppercase tracking-wide" htmlFor="email">Email Address</label>
          <input 
            {...register('email')}
            className={`w-full bg-pure-white border-2 ${errors.email ? 'border-[var(--color-vivid-coral)]' : 'border-ink-charcoal'} p-4 font-body-lg text-body-lg focus:outline-none focus:border-electric-sun focus:ring-4 focus:ring-electric-sun transition-all`} 
            id="email" 
            placeholder="zap@vibecaster.com" 
            type="email" 
          />
          {errors.email && <span className="text-[var(--color-vivid-coral)] text-sm mt-1 font-bold">{errors.email.message}</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-label-md text-label-md mb-2 uppercase tracking-wide" htmlFor="country">Country</label>
            <select 
              {...register('country')}
              className={`w-full bg-pure-white border-2 ${errors.country ? 'border-[var(--color-vivid-coral)]' : 'border-ink-charcoal'} p-4 font-body-lg text-body-lg focus:outline-none focus:border-electric-sun focus:ring-4 focus:ring-electric-sun transition-all appearance-none cursor-pointer`} 
              id="country"
            >
              <option value="">Select a country</option>
              {countries.map(c => (
                <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
              ))}
            </select>
            {errors.country && <span className="text-[var(--color-vivid-coral)] text-sm mt-1 font-bold">{errors.country.message}</span>}
          </div>
          <div className="flex flex-col">
            <label className="font-label-md text-label-md mb-2 uppercase tracking-wide" htmlFor="city">City</label>
            <select 
              {...register('city')}
              className={`w-full bg-pure-white border-2 ${errors.city ? 'border-[var(--color-vivid-coral)]' : 'border-ink-charcoal'} p-4 font-body-lg text-body-lg focus:outline-none focus:border-electric-sun focus:ring-4 focus:ring-electric-sun transition-all appearance-none cursor-pointer disabled:opacity-50`} 
              id="city"
              disabled={!selectedCountryCode || cities.length === 0}
            >
              <option value="">Select a city</option>
              {cities.map((city, index) => (
                <option key={`${city.name}-${index}`} value={city.name}>{city.name}</option>
              ))}
            </select>
            {errors.city && <span className="text-[var(--color-vivid-coral)] text-sm mt-1 font-bold">{errors.city.message}</span>}
          </div>
        </div>
        <div className="pt-8">
          <button disabled={isSigning} className="w-full bg-leaf-green text-ink-charcoal border-4 border-ink-charcoal py-6 px-8 font-headline-md text-headline-md uppercase tracking-wider shadow-[8px_8px_0px_0px_rgba(44,46,42,1)] hover:bg-electric-sun hover:-translate-y-1 hover:shadow-[12px_12px_0px_0px_rgba(44,46,42,1)] active:translate-y-2 active:shadow-none transition-all duration-200 flex items-center justify-center gap-4 disabled:opacity-50 disabled:pointer-events-none" type="submit">
            <Zap size={28} />
            {isSigning ? 'Signing...' : 'Sign the Vibe!'}
            <Zap size={28} />
          </button>
        </div>
      </form>
    </div>
  );
}
