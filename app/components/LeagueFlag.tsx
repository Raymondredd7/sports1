import React from 'react';
import Image from 'next/image';

interface LeagueFlagProps {
  leagueId: string;
  className?: string;
}

const LeagueFlag: React.FC<LeagueFlagProps> = ({ leagueId, className = '' }) => {
  const getFlagPath = (id: string) => {
    // List of competition IDs that should show a trophy
    const competitionIds = [
      'CL', 'EL', 'ECL', 'EC', 'WC', 'CLI', 'CDR', 'FAC', 'DFB', 'COI',
      'AFC', 'CAF', 'CONCACAF', 'OFC', 'EURO', 'COPA', 'AFCON', 'GOLD', 'ASIA'
    ];

    if (competitionIds.includes(id)) {
      return '🏆';
    }

    switch (id) {
      // Top 5 European Leagues
      case 'PL': return '/flags/gb-eng.svg';
      case 'PD': return '/flags/es.svg';
      case 'BL1': return '/flags/de.svg';
      case 'SA': return '/flags/it.svg';
      case 'FL1': return '/flags/fr.svg';

      // Other European Leagues
      case 'PPL': return '/flags/pt.svg';
      case 'DED': return '/flags/nl.svg';
      case 'BSA': return '/flags/br.svg';
      case 'SPL': return '/flags/gb-sct.svg';
      case 'BUN': return '/flags/be.svg';
      case 'SUP': return '/flags/ch.svg';
      case 'AUT': return '/flags/at.svg';
      case 'DNK': return '/flags/dk.svg';
      case 'SWE': return '/flags/se.svg';
      case 'NOR': return '/flags/no.svg';
      case 'FIN': return '/flags/fi.svg';
      case 'POL': return '/flags/pl.svg';
      case 'CZE': return '/flags/cz.svg';
      case 'SVK': return '/flags/sk.svg';
      case 'HUN': return '/flags/hu.svg';
      case 'ROU': return '/flags/ro.svg';
      case 'BUL': return '/flags/bg.svg';
      case 'CRO': return '/flags/hr.svg';
      case 'SRB': return '/flags/rs.svg';
      case 'GRE': return '/flags/gr.svg';
      case 'TUR': return '/flags/tr.svg';

      // Other Major Leagues
      case 'MLS': return '/flags/us.svg';
      case 'J1': return '/flags/jp.svg';
      case 'K1': return '/flags/kr.svg';
      case 'CSL': return '/flags/cn.svg';
      case 'AUS': return '/flags/au.svg';
      case 'RPL': return '/flags/ru.svg';
      case 'ISR': return '/flags/il.svg';
      case 'RSA': return '/flags/za.svg';
      case 'EGY': return '/flags/eg.svg';
      case 'MEX': return '/flags/mx.svg';
      case 'ARG': return '/flags/ar.svg';
      case 'BRA': return '/flags/br.svg';
      case 'CHL': return '/flags/cl.svg';
      case 'COL': return '/flags/co.svg';
      case 'PER': return '/flags/pe.svg';
      case 'URU': return '/flags/uy.svg';
      case 'VEN': return '/flags/ve.svg';
      case 'ECU': return '/flags/ec.svg';
      case 'PAR': return '/flags/py.svg';
      case 'BOL': return '/flags/bo.svg';

      default: return '/flags/default.svg';
    }
  };

  const flagPath = getFlagPath(leagueId);

  // If the flag path is an emoji, render it directly
  if (flagPath === '🏆') {
    return <span className={`text-xl ${className}`}>{flagPath}</span>;
  }

  // Otherwise render the SVG flag
  return (
    <Image
      src={flagPath}
      alt={`${leagueId} flag`}
      width={24}
      height={24}
      className={`object-contain ${className}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = '/flags/default.svg';
      }}
    />
  );
};

export default LeagueFlag; 