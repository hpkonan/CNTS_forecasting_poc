import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LDIS – Donor Risk Advisor',
  description:
    "POC démonstrateur — Assistant d'aide à la décision pour l'évaluation du risque résiduel des donneurs de sang (CNTS Côte d'Ivoire).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans text-ldis-navy antialiased">{children}</body>
    </html>
  );
}
