// SVG icon components for Azure services
// Each returns an inline SVG styled with the service's brand color

export function AzureIcon({ serviceId, color = '#0078D4', size = 40 }) {
  const icons = {
    // Compute
    'vm': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="6" y="8" width="36" height="26" rx="3" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <rect x="10" y="12" width="28" height="18" rx="1" fill={color} opacity="0.3"/>
        <rect x="18" y="38" width="12" height="3" rx="1" fill={color}/>
        <rect x="14" y="40" width="20" height="2" rx="1" fill={color} opacity="0.5"/>
        <path d="M20 20l4 6h-8l4-6z" fill={color}/>
        <circle cx="30" cy="18" r="2" fill={color}/>
      </svg>
    ),
    'app-service': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="4" y="8" width="40" height="32" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <path d="M16 20l-5 5 5 5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M32 20l5 5-5 5" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M27 16l-6 16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'functions': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <path d="M8 12h32v24H8z" fill={color} opacity="0.1"/>
        <path d="M14 36l8-12-4-12h12" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="24" r="18" stroke={color} strokeWidth="2" opacity="0.3"/>
      </svg>
    ),
    'aks': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="18" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <circle cx="24" cy="14" r="4" fill={color} opacity="0.6"/>
        <circle cx="15" cy="30" r="4" fill={color} opacity="0.6"/>
        <circle cx="33" cy="30" r="4" fill={color} opacity="0.6"/>
        <line x1="24" y1="18" x2="15" y2="26" stroke={color} strokeWidth="2"/>
        <line x1="24" y1="18" x2="33" y2="26" stroke={color} strokeWidth="2"/>
        <line x1="15" y1="30" x2="33" y2="30" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    'container-instances': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="8" y="10" width="32" height="28" rx="3" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <rect x="12" y="16" width="10" height="8" rx="1" fill={color} opacity="0.5"/>
        <rect x="26" y="16" width="10" height="8" rx="1" fill={color} opacity="0.5"/>
        <rect x="12" y="28" width="24" height="6" rx="1" fill={color} opacity="0.3"/>
      </svg>
    ),
    'batch': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="4" y="12" width="14" height="10" rx="2" fill={color} opacity="0.4"/>
        <rect x="4" y="26" width="14" height="10" rx="2" fill={color} opacity="0.4"/>
        <rect x="22" y="12" width="14" height="10" rx="2" fill={color} opacity="0.4"/>
        <rect x="22" y="26" width="14" height="10" rx="2" fill={color} opacity="0.4"/>
        <rect x="40" y="18" width="4" height="12" rx="1" fill={color} opacity="0.6"/>
      </svg>
    ),

    // Networking
    'vnet': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="6" y="6" width="36" height="36" rx="4" fill={color} opacity="0.1" stroke={color} strokeWidth="2" strokeDasharray="4 2"/>
        <circle cx="16" cy="16" r="4" fill={color} opacity="0.6"/>
        <circle cx="32" cy="16" r="4" fill={color} opacity="0.6"/>
        <circle cx="16" cy="32" r="4" fill={color} opacity="0.6"/>
        <circle cx="32" cy="32" r="4" fill={color} opacity="0.6"/>
        <line x1="16" y1="16" x2="32" y2="16" stroke={color} strokeWidth="1.5"/>
        <line x1="16" y1="32" x2="32" y2="32" stroke={color} strokeWidth="1.5"/>
        <line x1="16" y1="16" x2="16" y2="32" stroke={color} strokeWidth="1.5"/>
        <line x1="32" y1="16" x2="32" y2="32" stroke={color} strokeWidth="1.5"/>
      </svg>
    ),
    'load-balancer': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="12" r="6" fill={color} opacity="0.5"/>
        <circle cx="12" cy="36" r="5" fill={color} opacity="0.4"/>
        <circle cx="24" cy="36" r="5" fill={color} opacity="0.4"/>
        <circle cx="36" cy="36" r="5" fill={color} opacity="0.4"/>
        <line x1="24" y1="18" x2="12" y2="31" stroke={color} strokeWidth="2"/>
        <line x1="24" y1="18" x2="24" y2="31" stroke={color} strokeWidth="2"/>
        <line x1="24" y1="18" x2="36" y2="31" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    'app-gateway': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="6" y="14" width="36" height="20" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <circle cx="18" cy="24" r="5" fill={color} opacity="0.4"/>
        <path d="M26 24h10" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M33 20l4 4-4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    'dns': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="18" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <text x="24" y="29" textAnchor="middle" fill={color} fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">DNS</text>
      </svg>
    ),
    'front-door': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="10" y="6" width="28" height="36" rx="3" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <line x1="24" y1="6" x2="24" y2="42" stroke={color} strokeWidth="2"/>
        <circle cx="28" cy="24" r="2" fill={color}/>
        <rect x="14" y="10" width="8" height="12" rx="1" fill={color} opacity="0.2"/>
        <rect x="26" y="10" width="8" height="12" rx="1" fill={color} opacity="0.2"/>
      </svg>
    ),
    'firewall': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="8" y="8" width="32" height="32" rx="4" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <path d="M24 14c0 0-8 4-8 12 0 6 4 10 8 10s8-4 8-10c0-8-8-12-8-12z" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/>
        <path d="M24 22v8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="32" r="1.5" fill={color}/>
      </svg>
    ),

    // Storage
    'storage-account': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="8" y="8" width="32" height="32" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <rect x="14" y="14" width="20" height="6" rx="1" fill={color} opacity="0.4"/>
        <rect x="14" y="22" width="20" height="6" rx="1" fill={color} opacity="0.3"/>
        <rect x="14" y="30" width="20" height="6" rx="1" fill={color} opacity="0.2"/>
        <circle cx="30" cy="17" r="1.5" fill="white"/>
        <circle cx="30" cy="25" r="1.5" fill="white"/>
        <circle cx="30" cy="33" r="1.5" fill="white"/>
      </svg>
    ),
    'blob-storage': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="16" rx="14" ry="6" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/>
        <path d="M10 16v16c0 3.3 6.3 6 14 6s14-2.7 14-6V16" stroke={color} strokeWidth="2"/>
        <ellipse cx="24" cy="26" rx="14" ry="6" fill={color} opacity="0.1"/>
      </svg>
    ),
    'disk': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <circle cx="24" cy="24" r="8" fill={color} opacity="0.2" stroke={color} strokeWidth="1.5"/>
        <circle cx="24" cy="24" r="3" fill={color}/>
      </svg>
    ),
    'file-storage': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <path d="M12 8h16l8 8v24a3 3 0 01-3 3H12a3 3 0 01-3-3V11a3 3 0 013-3z" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <path d="M28 8v8h8" stroke={color} strokeWidth="2"/>
        <line x1="15" y1="24" x2="33" y2="24" stroke={color} strokeWidth="1.5" opacity="0.5"/>
        <line x1="15" y1="29" x2="33" y2="29" stroke={color} strokeWidth="1.5" opacity="0.5"/>
        <line x1="15" y1="34" x2="25" y2="34" stroke={color} strokeWidth="1.5" opacity="0.5"/>
      </svg>
    ),

    // Database
    'sql-database': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="12" rx="14" ry="6" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/>
        <path d="M10 12v24c0 3.3 6.3 6 14 6s14-2.7 14-6V12" stroke={color} strokeWidth="2"/>
        <ellipse cx="24" cy="24" rx="14" ry="6" fill="none" stroke={color} strokeWidth="1" opacity="0.3"/>
        <ellipse cx="24" cy="36" rx="14" ry="6" fill="none" stroke={color} strokeWidth="1" opacity="0.3"/>
      </svg>
    ),
    'cosmos-db': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <ellipse cx="24" cy="24" rx="16" ry="8" fill="none" stroke={color} strokeWidth="1.5" transform="rotate(45 24 24)" opacity="0.5"/>
        <ellipse cx="24" cy="24" rx="16" ry="8" fill="none" stroke={color} strokeWidth="1.5" transform="rotate(-45 24 24)" opacity="0.5"/>
        <circle cx="24" cy="24" r="4" fill={color} opacity="0.5"/>
      </svg>
    ),
    'redis-cache': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="8" y="14" width="32" height="20" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <path d="M16 24h4m4 0h4m4 0h4" stroke={color} strokeWidth="3" strokeLinecap="round"/>
        <circle cx="14" cy="18" r="1.5" fill={color} opacity="0.5"/>
      </svg>
    ),
    'mysql': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="14" rx="14" ry="6" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/>
        <path d="M10 14v20c0 3.3 6.3 6 14 6s14-2.7 14-6V14" stroke={color} strokeWidth="2"/>
        <text x="24" y="30" textAnchor="middle" fill={color} fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">MY</text>
      </svg>
    ),
    'postgresql': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="14" rx="14" ry="6" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/>
        <path d="M10 14v20c0 3.3 6.3 6 14 6s14-2.7 14-6V14" stroke={color} strokeWidth="2"/>
        <text x="24" y="30" textAnchor="middle" fill={color} fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">PG</text>
      </svg>
    ),

    // AI + ML
    'cognitive-services': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <path d="M18 20c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="20" cy="24" r="2" fill={color}/>
        <circle cx="28" cy="24" r="2" fill={color}/>
        <path d="M20 30c0 0 2 3 4 3s4-3 4-3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'machine-learning': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <circle cx="16" cy="20" r="3" fill={color} opacity="0.4"/>
        <circle cx="32" cy="20" r="3" fill={color} opacity="0.4"/>
        <circle cx="24" cy="34" r="3" fill={color} opacity="0.4"/>
        <line x1="16" y1="20" x2="32" y2="20" stroke={color} strokeWidth="1.5"/>
        <line x1="16" y1="20" x2="24" y2="34" stroke={color} strokeWidth="1.5"/>
        <line x1="32" y1="20" x2="24" y2="34" stroke={color} strokeWidth="1.5"/>
        <circle cx="24" cy="14" r="2" fill={color}/>
      </svg>
    ),
    'openai': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <path d="M16 28c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M20 24c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="24" cy="18" r="2" fill={color}/>
      </svg>
    ),
    'bot-service': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="12" y="12" width="24" height="18" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <circle cx="19" cy="21" r="2.5" fill={color}/>
        <circle cx="29" cy="21" r="2.5" fill={color}/>
        <path d="M20 27h8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="18" y1="30" x2="14" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <line x1="30" y1="30" x2="34" y2="36" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <rect x="20" y="8" width="8" height="4" rx="2" fill={color} opacity="0.4"/>
      </svg>
    ),

    // Security
    'key-vault': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="10" y="14" width="28" height="24" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <circle cx="24" cy="24" r="5" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/>
        <path d="M24 29v6" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <rect x="18" y="8" width="12" height="6" rx="3" fill="none" stroke={color} strokeWidth="2"/>
      </svg>
    ),
    'active-directory': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="16" r="7" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/>
        <path d="M12 38c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke={color} strokeWidth="2" fill={color} opacity="0.15"/>
      </svg>
    ),
    'security-center': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <path d="M24 6L8 14v12c0 10 6.7 19.3 16 22 9.3-2.7 16-12 16-22V14L24 6z" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <path d="M20 24l3 3 6-6" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),

    // Integration
    'api-management': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="6" y="10" width="36" height="28" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <text x="24" y="28" textAnchor="middle" fill={color} fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif">API</text>
      </svg>
    ),
    'service-bus': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="6" y="14" width="36" height="20" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <path d="M14 24h20" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M14 20h20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        <path d="M14 28h20" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        <circle cx="12" cy="24" r="3" fill={color} opacity="0.5"/>
        <circle cx="36" cy="24" r="3" fill={color} opacity="0.5"/>
      </svg>
    ),
    'event-hub': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <circle cx="24" cy="24" r="4" fill={color}/>
        <path d="M24 8v12M24 28v12M8 24h12M28 24h12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    'logic-apps': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="8" y="8" width="32" height="32" rx="4" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <circle cx="16" cy="16" r="3" fill={color} opacity="0.5"/>
        <circle cx="32" cy="16" r="3" fill={color} opacity="0.5"/>
        <circle cx="16" cy="32" r="3" fill={color} opacity="0.5"/>
        <circle cx="32" cy="32" r="3" fill={color} opacity="0.5"/>
        <path d="M19 16h10M16 19v10M32 19v10M19 32h10" stroke={color} strokeWidth="1.5"/>
        <rect x="20" y="20" width="8" height="8" rx="2" fill={color} opacity="0.3"/>
      </svg>
    ),
    'event-grid': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="8" y="8" width="32" height="32" rx="4" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <rect x="13" y="13" width="8" height="8" rx="1" fill={color} opacity="0.4"/>
        <rect x="27" y="13" width="8" height="8" rx="1" fill={color} opacity="0.4"/>
        <rect x="13" y="27" width="8" height="8" rx="1" fill={color} opacity="0.4"/>
        <rect x="27" y="27" width="8" height="8" rx="1" fill={color} opacity="0.4"/>
      </svg>
    ),

    // DevOps
    'devops': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <path d="M24 8a16 16 0 0116 16" stroke={color} strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M40 24a16 16 0 01-16 16" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.6" fill="none"/>
        <path d="M24 40A16 16 0 018 24" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.3" fill="none"/>
        <circle cx="24" cy="24" r="4" fill={color}/>
      </svg>
    ),
    'monitor': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="6" y="8" width="36" height="26" rx="3" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <polyline points="12,28 18,20 24,25 30,15 36,22" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="18" y="38" width="12" height="3" rx="1" fill={color}/>
      </svg>
    ),
    'app-insights': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <path d="M16 30l4-8 4 4 4-12 4 8" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="24" r="6" fill="none" stroke={color} strokeWidth="1.5" opacity="0.3"/>
      </svg>
    ),
    'log-analytics': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="8" y="8" width="32" height="32" rx="4" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <circle cx="22" cy="22" r="8" fill="none" stroke={color} strokeWidth="2.5"/>
        <line x1="28" y1="28" x2="36" y2="36" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="18" y1="22" x2="26" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="22" y1="18" x2="22" y2="26" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),

    // General
    'resource-group': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="6" y="6" width="36" height="36" rx="6" fill={color} opacity="0.1" stroke={color} strokeWidth="2" strokeDasharray="6 3"/>
        <rect x="14" y="14" width="8" height="8" rx="2" fill={color} opacity="0.4"/>
        <rect x="26" y="14" width="8" height="8" rx="2" fill={color} opacity="0.4"/>
        <rect x="14" y="26" width="8" height="8" rx="2" fill={color} opacity="0.4"/>
        <rect x="26" y="26" width="8" height="8" rx="2" fill={color} opacity="0.3"/>
      </svg>
    ),
    'subscription': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <rect x="8" y="8" width="32" height="32" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
        <path d="M16 20h16M16 28h16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        <circle cx="16" cy="16" r="2" fill={color}/>
      </svg>
    ),
    'user': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="18" r="8" fill={color} opacity="0.3" stroke={color} strokeWidth="2"/>
        <path d="M10 42c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke={color} strokeWidth="2" fill={color} opacity="0.15"/>
      </svg>
    ),
    'internet': (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" fill={color} opacity="0.1" stroke={color} strokeWidth="2"/>
        <ellipse cx="24" cy="24" rx="8" ry="16" fill="none" stroke={color} strokeWidth="1.5"/>
        <line x1="8" y1="24" x2="40" y2="24" stroke={color} strokeWidth="1.5"/>
        <path d="M10 16h28M10 32h28" stroke={color} strokeWidth="1" opacity="0.4"/>
      </svg>
    ),
  };

  return icons[serviceId] || (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <rect x="8" y="8" width="32" height="32" rx="4" fill={color} opacity="0.15" stroke={color} strokeWidth="2"/>
      <text x="24" y="28" textAnchor="middle" fill={color} fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">?</text>
    </svg>
  );
}
