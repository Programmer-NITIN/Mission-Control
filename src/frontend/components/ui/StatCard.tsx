'use client';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: string;
  variant: 'error' | 'secondary' | 'primary';
  delay?: number;
}

const variantStyles = {
  error: {
    iconBg: 'bg-error-container',
    iconColor: 'text-mc-error',
  },
  secondary: {
    iconBg: 'bg-secondary-container',
    iconColor: 'text-on-secondary-container',
  },
  primary: {
    iconBg: 'bg-primary-fixed',
    iconColor: 'text-on-primary-fixed',
  },
};

export default function StatCard({ label, value, icon, variant, delay = 0 }: StatCardProps) {
  const styles = variantStyles[variant];
  return (
    <div
      className="card card-hover animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-body-sm text-on-surface-variant">{label}</span>
        <div className={`w-10 h-10 rounded-full ${styles.iconBg} flex items-center justify-center ${styles.iconColor}`}>
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
      </div>
      <div className="text-display-lg text-on-surface">{value}</div>
    </div>
  );
}
