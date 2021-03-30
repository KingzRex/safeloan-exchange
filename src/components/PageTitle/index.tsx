import React from 'react'
import { Text } from '@carticfinance-libs/uikit'
import PageTitleWrapper from './style'

interface Props {
  title: string
  subtitle: string | string[]
}

const PageTitle: React.FC<Props> = ({ title, subtitle }) => {
  const len = title.length
  const hasSpace = title.includes(' ')
  const [left, right] = hasSpace
    ? title.split(' ')
    : [title.slice(0, Math.floor(len / 2)), title.slice(Math.floor(len / 2), len)]

  subtitle = typeof subtitle === 'string' ? [subtitle] : subtitle

  return (
    <PageTitleWrapper>
      <Text bold fontSize="64px">
        {left}
        {hasSpace ? ' ' : ''}
        <span style={{ color: '#28C8F9' }}>{right}</span>
      </Text>
      <>
        {subtitle.map((sub) => (
          <Text key={sub} bold fontSize="12px" textTransform="uppercase">
            {sub}
          </Text>
        ))}
      </>
    </PageTitleWrapper>
  )
}

export default PageTitle
