'use client'

import { Doughnut } from 'react-chartjs-2'
import { ChartData } from 'chart.js'
import { pick } from '@mss/web/utils/pick'
import { getGenderWording } from '@mss/web/wording/gender'
import { useCssProperties } from '@mss/web/hooks/useCssProperty'
import { GenderStats } from '@mss/web/stats/stats'
import { BrowserOnly } from '@mss/web/utils/BrowserOnly'

export const GenderChart = ({ genderStats }: { genderStats: GenderStats }) => {
  const colors = useCssProperties([
    '--artwork-minor-green-emeraude',
    '--artwork-minor-blue-cumulus',
    '--artwork-minor-beige-gris-galet',
    '--artwork-minor-brown-cafe-creme',
  ])

  const data: ChartData<'doughnut'> = {
    labels: pick(genderStats.stats, 'gender').map(getGenderWording),
    datasets: [
      {
        label: 'Répartition des genres',
        data: pick(genderStats.stats, '_count'),
        backgroundColor: colors,
        hoverOffset: 4,
      },
    ],
  }
  return (
    <BrowserOnly>
      <Doughnut data={data} options={{}} />
    </BrowserOnly>
  )
}