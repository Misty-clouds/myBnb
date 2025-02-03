import {useTranslations} from 'next-intl';
import LocaleSwitcher from '@/components/locale/LocaleSwitcher';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
<div>
        <h1 className="text-4xl font-semibold tracking-tight">{t('title')}</h1>
        <LocaleSwitcher/>     
    </div>
   
  );
}