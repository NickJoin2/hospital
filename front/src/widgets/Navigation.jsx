import React, { useState } from 'react';
import {Dialog, DisclosureButton, DisclosurePanel} from '@headlessui/react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Navigation = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const products = [
        { name: 'Product 1', description: 'Description 1', href: '#', icon: ChevronDownIcon },
        { name: 'Product 2', description: 'Description 2', href: '#', icon: ChevronDownIcon },
    ];

    const callsToAction = [
        { name: 'Call to Action 1', href: '#', icon: ChevronDownIcon },
        { name: 'Call to Action 2', href: '#', icon: ChevronDownIcon },
    ];

    return (
        <header className="bg-gray-800 position-relative h-[10] z-10">
            <nav aria-label="Global" className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                    <a href="#" className="-m-1.5 p-1.5">
                        <span className="font-bold text-white">Hospital</span>
                    </a>
                </div>

                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    >
                        <span className="sr-only">Open main menu</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">
                    <a href="#" className="text-sm font-semibold text-white">
                        Загаловок 1
                    </a>
                    <a href="#" className="text-sm font-semibold text-white">
                        Загаловок 2
                    </a>
                    <a href="#" className="text-sm font-semibold text-white">
                        Загаловок 3
                    </a>
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <a href="#" className="text-sm font-semibold text-white">
                        Войти <span aria-hidden="true">&rarr;</span>
                    </a>
                </div>
            </nav>

            <Dialog open={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} className="lg:hidden">
                <div className="fixed inset-0 z-10 bg-black opacity-50" />
                <div className="fixed inset-y-0 right-0 z-20 w-full sm:max-w-sm bg-white px-6 py-6">
                    <div className="flex items-center justify-between">
                        <a href="#" className="-m-1.5 p-1.5">
                            <span className="sr-only">Your Company</span>
                            <img
                                alt="Company Logo"
                                src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto"
                            />
                        </a>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="-m-2.5 rounded-md p-2.5 text-gray-700"
                        >
                            <span className="sr-only">Close menu</span>
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="mt-6 space-y-6">
                        <div>
                            <Disclosure as="div">
                                <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold text-gray-900 hover:bg-gray-50">
                                    Product
                                    <ChevronDownIcon className="h-5 w-5 group-data-[open]:rotate-180" aria-hidden="true" />
                                </DisclosureButton>
                                <DisclosurePanel className="mt-2 space-y-2">
                                    {[...products, ...callsToAction].map((item) => (
                                        <DisclosureButton
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                                        >
                                            {item.name}
                                        </DisclosureButton>
                                    ))}
                                </DisclosurePanel>
                            </Disclosure>
                        </div>

                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                            Features
                        </a>
                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                            Marketplace
                        </a>
                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                            Company
                        </a>
                    </div>

                    <div className="py-6">
                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50">
                            Log in
                        </a>
                    </div>
                </div>
            </Dialog>
        </header>
    );
};

export default Navigation;
