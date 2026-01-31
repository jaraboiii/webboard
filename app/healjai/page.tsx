
import RoleSelection from '@/components/healjai/RoleSelection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Healjai - พื้นที่พักใจ',
  description: 'Unwind and heal your mind with anonymous support.',
};

export default function HealjaiPage() {
  return (
    <>
      {/* Banner can be reused or new one for this page specifically */}
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Healjai (พื้นที่พักใจ)</h1>
      <RoleSelection />
    </>
  );
}
