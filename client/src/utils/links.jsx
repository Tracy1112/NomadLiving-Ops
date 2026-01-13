import React from 'react'

import { IoBarChartSharp } from 'react-icons/io5'
import { MdQueryStats } from 'react-icons/md'
import { FaWpforms } from 'react-icons/fa'
import { ImProfile } from 'react-icons/im'
import { MdAdminPanelSettings } from 'react-icons/md'

const links = [
  { text: 'new ticket', path: '.', icon: <FaWpforms /> },
  { text: 'task board', path: 'all-jobs', icon: <MdQueryStats /> },
  { text: 'performance', path: 'stats', icon: <IoBarChartSharp /> },
  { text: 'staff profile', path: 'profile', icon: <ImProfile /> },
  { text: 'admin', path: 'admin', icon: <MdAdminPanelSettings /> },
]

export default links
