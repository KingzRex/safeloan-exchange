import React from 'react'
import styled from 'styled-components'
import { IconButton, Flex, useModal, CogIcon, ArrowBackIcon, Svg } from '@carticfinance-libs/uikit'
import useI18n from 'hooks/useI18n'
import SettingsModal from 'components/PageHeader/SettingsModal'
import RecentTransactionsModal from 'components/PageHeader/RecentTransactionsModal'
import { useHistory } from 'react-router-dom'

// interface PageHeaderProps {}

const HistoryIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <path
      d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3ZM12 8V13L16.28 15.54L17 14.33L13.5 12.25V8H12Z"
      fill="#fff"
    />
  </Svg>
)

const StyledPageHeader = styled.div`
  // border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding: 24px;
  padding-bottom: 8px;
  background: ${({ theme }) => theme.colors.contrast};
`

const ActionPane = ({ hasBackButton }: { hasBackButton?: boolean }) => {
  const TranslateString = useI18n()
  const [onPresentSettings] = useModal(<SettingsModal translateString={TranslateString} />)
  const [onPresentRecentTransactions] = useModal(<RecentTransactionsModal translateString={TranslateString} />)
  const history = useHistory()

  return (
    <StyledPageHeader>
      <Flex alignItems="center">
        {hasBackButton && (
          <IconButton variant="text" onClick={() => history.goBack()} title={TranslateString(1200, 'Go Back')}>
            <ArrowBackIcon width="24px" color="invertedContrast" />
          </IconButton>
        )}
        <Flex style={{ flex: 1 }} />
        <IconButton variant="text" onClick={onPresentSettings} title={TranslateString(1200, 'Settings')}>
          <CogIcon width="24px" color="invertedContrast" />
        </IconButton>
        <IconButton
          variant="text"
          onClick={onPresentRecentTransactions}
          title={TranslateString(1202, 'Recent transactions')}
        >
          <HistoryIcon />
        </IconButton>
      </Flex>
    </StyledPageHeader>
  )
}

export default ActionPane
