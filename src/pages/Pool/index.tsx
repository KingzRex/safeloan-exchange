import React, { useContext, useMemo } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair } from '@carticfinance-libs/sdk'
import { Button, CardBody, Card, Text } from '@carticfinance-libs/uikit'
import { useHistory } from 'react-router-dom'
import Question from 'components/QuestionHelper'
import FullPositionCard from 'components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { LightCard } from 'components/Card'
import { RowBetween } from 'components/Row'
import { AutoColumn } from 'components/Column'

import { useActiveWeb3React } from 'hooks'
import { usePairs } from 'data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { Dots, Wrapper } from 'components/swap/styleds'
import useI18n from 'hooks/useI18n'
import ActionPane from 'components/ActionPane/index'
import PageTitle from 'components/PageTitle/index'
import AppBody from '../AppBody'

const AddButton = styled(Button)`
  width: 100%;
  color: #3d3d3f;
  margin-top: 16px;
`

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()
  const TranslateString = useI18n()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens,
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))
  const history = useHistory()

  return (
    <>
      <PageTitle title="Liquidity." subtitle="ADD LIQUIDITY TO RECEIVE LP TOKENS" />
      <AppBody bg="primary">
        <Wrapper>
          <ActionPane />
          <CardBody
            style={{
              backgroundColor: '#191326',
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              padding: 16,
            }}
          >
            <AddButton onClick={() => history.push('/add')} variant="tertiary">
              Add Liquidity
            </AddButton>
          </CardBody>
          <Card style={{ margin: 8 }}>
            <AutoColumn gap="lg" justify="center">
              <CardBody>
                <AutoColumn gap="12px" style={{ width: '100%' }}>
                  <RowBetween padding="0 8px">
                    <Text color={theme.colors.text}>{TranslateString(107, 'Your Liquidity')}</Text>
                    <Question
                      text={TranslateString(
                        1170,
                        'When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.'
                      )}
                    />
                  </RowBetween>

                  {!account ? (
                    <LightCard padding="40px">
                      <Text color="textDisabled" textAlign="center">
                        {TranslateString(156, 'Connect to a wallet to view your liquidity.')}
                      </Text>
                    </LightCard>
                  ) : v2IsLoading ? (
                    <LightCard padding="40px">
                      <Text color="textDisabled" textAlign="center">
                        <Dots>Loading</Dots>
                      </Text>
                    </LightCard>
                  ) : allV2PairsWithLiquidity?.length > 0 ? (
                    <>
                      {allV2PairsWithLiquidity.map((v2Pair) => (
                        <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                      ))}
                    </>
                  ) : (
                    <LightCard padding="40px">
                      <Text color="textDisabled" textAlign="center">
                        {TranslateString(104, 'No liquidity found.')}
                      </Text>
                    </LightCard>
                  )}
                </AutoColumn>
              </CardBody>
            </AutoColumn>
          </Card>
        </Wrapper>
      </AppBody>
    </>
  )
}
