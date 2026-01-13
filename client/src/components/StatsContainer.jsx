import { FaSuitcaseRolling, FaCalendarCheck, FaBug } from 'react-icons/fa'
import Wrapper from '../assets/wrappers/StatsContainer'
import StatItem from './StatItem'

const StatsContainer = ({ defaultStats }) => {
  const stats = [
    {
      title: 'open tickets',
      count: defaultStats?.open || defaultStats?.pending || defaultStats?.maintenance || 0,
      icon: <FaSuitcaseRolling />,
      color: '#6b7280', // Gray for Open
      bcg: '#f3f4f6',
    },
    {
      title: 'in progress',
      count: defaultStats?.['in-progress'] || defaultStats?.interview || defaultStats?.active || 0,
      icon: <FaCalendarCheck />,
      color: '#3b82f6', // Blue for In Progress
      bcg: '#dbeafe',
    },
    {
      title: 'cancelled',
      count: defaultStats?.cancelled || defaultStats?.declined || defaultStats?.inactive || 0,
      icon: <FaBug />,
      color: '#dc2626', // Red for Cancelled
      bcg: '#fee2e2',
    },
  ]
  return (
    <Wrapper>
      {stats.map((item) => {
        return <StatItem key={item.title} {...item} />
      })}
    </Wrapper>
  )
}

export default StatsContainer
