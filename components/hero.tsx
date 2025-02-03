'use client'
import { useTranslations } from 'next-intl'
import LocaleSwitcher from './locale/LocaleSwitcher'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslations('HeroSection')

  const navLinks = [
    { href: '/home/properties', label: t('nav.properties') },
    { href: '/home/expenses', label: t('nav.expenses') },
    { href: '/home/bookings', label: t('nav.bookings') },
    { href: '/home/support', label: t('nav.support') }
  ]

  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/home" className="-m-1.5 p-1.5 transition duration-300 ease-in-out transform hover:scale-105">
              <span className="sr-only">MY BnB</span>
              <span className="text-2xl font-bold text-orange-600">MY BnB</span>
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 transition duration-300 hover:text-orange-600"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">{t('menu.open')}</span>
              <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-12">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="text-sm/6 font-semibold text-gray-900 transition duration-300 ease-in-out hover:text-orange-600 hover:translate-y-[-2px]"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <div className="flex items-center gap-x-6">
              <LocaleSwitcher />
              <Link 
                href="/sign-in" 
                className="text-sm/6 font-semibold text-gray-900 transition duration-300 ease-in-out hover:text-orange-600 group flex items-center"
              >
                {t('auth.login')}
                <span aria-hidden="true" className="ml-1 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile menu with slide animation */}
        {mobileMenuOpen && (
          <div className="lg:hidden" role="dialog" aria-modal="true">
            <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300"></div>
            <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transform transition-transform duration-300 ease-out">
              <div className="flex items-center justify-between">
                <Link href="/home" className="-m-1.5 p-1.5 transition duration-300 hover:scale-105">
                  <span className="sr-only">MY BnB</span>
                  <span className="text-2xl font-bold text-orange-600">MY BnB</span>
                </Link>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700 transition duration-300 hover:text-orange-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">{t('menu.close')}</span>
                  <svg className="size-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 transition duration-300 ease-in-out hover:bg-orange-50 hover:text-orange-600 hover:translate-x-1"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="py-6">
                    <Link 
                      href="/auth/sign-in" 
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 transition duration-300 ease-in-out hover:bg-orange-50 hover:text-orange-600 hover:translate-x-1"
                    >
                      {t('auth.login')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 animate-pulse" aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-300 to-orange-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-20 sm:py-48 lg:py-20">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 transition duration-300 ease-in-out transform hover:scale-105">
              {t('feature.text')}{' '}
              <Link href="/home/expenses" className="font-semibold text-orange-600 inline-flex items-center group">
                <span className="absolute inset-0" aria-hidden="true" />
                {t('feature.link')}
                <span aria-hidden="true" className="ml-1 transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl animate-fade-in">
              {t('title')}
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8 animate-fade-in-up">
              {t('description')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/home/properties"
                className="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-300 ease-in-out hover:bg-orange-500 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                {t('cta.browse')}
              </Link>
              <Link 
                href="/home/about" 
                className="text-sm/6 font-semibold text-gray-900 transition duration-300 ease-in-out hover:text-orange-600 group flex items-center"
              >
                {t('cta.learn')}
                <span aria-hidden="true" className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)] animate-pulse" aria-hidden="true">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-orange-300 to-orange-600 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
      `}</style>
    </div>
  )
}