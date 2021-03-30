import React, { useState, useCallback } from 'react'
import { Currency, Pair } from '@carticfinance-libs/sdk'
import { Button, ChevronDownIcon, Text } from '@carticfinance-libs/uikit'
import styled from 'styled-components'
import { darken } from 'polished'
import useI18n from 'hooks/useI18n'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween } from '../Row'
import { Input as NumericalInput } from '../NumericalInput'
import { useActiveWeb3React } from '../../hooks'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin-top: 16px;
`
const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  background-color: #ffffff;
  color: ${({ selected, theme }) => (selected ? theme.colors.text : '#FFFFFF')};
  border-radius: 24px;
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 8px 16px;
  margin-top: 8px;
  :focus,
  :hover {
    background-color: #D7EBF0};
  }
`
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.colors.textSubtle)};
  }
`
const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const InputPanel = styled.div<{ hideInput?: boolean }>`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '16px' : '30px')};
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1;
`
const Container = styled.div<{ hideInput: boolean; bg?: string }>`
  border-radius: 30px;
  background-color: ${({ theme, bg }) => (bg ? theme.colors[bg] : theme.colors.input)};
  box-shadow: ${({ theme }) => theme.shadows.inset};
  padding: 16px 32px;
`

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  hideInput?: boolean
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  bg?: string
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  pair = null, // used for double token logo
  hideInput = false,
  otherCurrency,
  id,
  showCommonBases,
  bg,
}: CurrencyInputPanelProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const TranslateString = useI18n()
  const translatedLabel = label || TranslateString(132, 'Input')
  const handleDismissSearch = useCallback(() => {
    setModalOpen(false)
  }, [setModalOpen])
  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput} bg={bg}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <Text fontWeight="bold" color="#fff" textTransform="uppercase" fontSize="10px" letterSpacing="2px">
                {translatedLabel}
              </Text>
              {account && (
                <Text
                  onClick={onMax}
                  fontWeight="bold"
                  color="#fff"
                  textTransform="uppercase"
                  fontSize="10px"
                  style={{ display: 'inline', cursor: 'pointer' }}
                >
                  {!hideBalance && !!currency && selectedCurrencyBalance
                    ? `Balance: ${selectedCurrencyBalance?.toSignificant(6)}`
                    : ' -'}
                </Text>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow style={hideInput ? { padding: '0', borderRadius: '8px' } : {}} selected={disableCurrencySelect}>
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                value={value}
                placeholder="0.00"
                color="invertedContrast"
                onUserInput={(val) => {
                  onUserInput(val)
                }}
              />
              {account && currency && showMaxButton && label !== 'To' && (
                <Button onClick={onMax} noShadow variant="text">
                  MAX
                </Button>
              )}
            </>
          )}
          <CurrencySelect
            selected={!!currency}
            className="open-currency-select-button"
            onClick={() => {
              if (!disableCurrencySelect) {
                setModalOpen(true)
              }
            }}
          >
            <Aligner>
              {pair ? (
                <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
              ) : currency ? (
                <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
              ) : null}
              {pair ? (
                <Text fontWeight="600" id="pair">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </Text>
              ) : (
                <Text fontWeight="600" id="pair">
                  {(currency && currency.symbol && currency.symbol.length > 20
                    ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                        currency.symbol.length - 5,
                        currency.symbol.length
                      )}`
                    : currency?.symbol) || TranslateString(1196, 'Select a currency')}
                </Text>
              )}
              {!disableCurrencySelect && <ChevronDownIcon />}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
      {!disableCurrencySelect && onCurrencySelect && (
        <CurrencySearchModal
          isOpen={modalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={onCurrencySelect}
          selectedCurrency={currency}
          otherSelectedCurrency={otherCurrency}
          showCommonBases={showCommonBases}
        />
      )}
    </InputPanel>
  )
}
