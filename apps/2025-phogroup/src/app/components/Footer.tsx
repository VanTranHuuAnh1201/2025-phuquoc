'use client'

import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { footerSectionsData, type FooterSection } from '../lib/data';

interface FooterSectionProps {
    section: FooterSection;
}

function FooterSectionComponent({ section }: FooterSectionProps) {
    const { currentLocale } = useLanguage();
    return (
        <div className="mb-8">
            <h4 className="font-medium mb-4 text-gray-900">{section.title}</h4>
            <div className="flex flex-wrap gap-2">
                {section.links.map((link, index) => (<Link
                    key={index}
                    href={link.href.startsWith('/') ? `/${currentLocale}${link.href}` : link.href}
                    className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                    <span className="flex items-center justify-center w-5 h-5 bg-orange-100 text-orange-600 text-xs rounded font-medium">
                        {index + 1}
                    </span>
                    {link.name}
                </Link>
                ))}
            </div>
        </div>
    );
}


export default function Footer() {
    return (
        <footer className="bg-gray-50 border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-6">Hấp dẫn không kém</h3>
                    <div className="space-y-6">
                        {footerSectionsData.map((section, index) => (
                            <FooterSectionComponent key={index} section={section} />
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
                    <p>&copy; 2025 Pho Group. Tất cả quyền được bảo lưu. | Chuyên gia du lịch Phú Quốc hàng đầu.</p>
                </div>
            </div>
        </footer>
    )
}