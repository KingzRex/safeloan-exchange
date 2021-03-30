import React from 'react'
import styled from 'styled-components'
import { Card } from '@carticfinance-libs/uikit'

export type Colors = {
  primary: string
  primaryBright: string
  primaryDark: string
  secondary: string
  tertiary: string
  success: string
  failure: string
  warning: string
  contrast: string
  invertedContrast: string
  input: string
  inputSecondary: string
  background: string
  backgroundDisabled: string
  text: string
  textDisabled: string
  textSubtle: string
  borderColor: string
  card: string

  // Gradients
  gradients: any

  // Brand colors
  binance: string
}

export const BodyWrapper = styled(Card)`
  position: relative;
  max-width: 436px;
  width: 100%;
  z-index: 5;
  overflow: initial;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, bg }: { children: React.ReactNode; bg?: keyof Colors }) {
  return (
    <>
      <BodyWrapper bg={bg}>{children}</BodyWrapper>
    </>
  )
}
