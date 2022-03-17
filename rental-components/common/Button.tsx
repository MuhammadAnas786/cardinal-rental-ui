import styled from '@emotion/styled'
import { css } from '@emotion/react'
import { lighten } from 'polished'
import { useState } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { notify } from 'common/Notification'

export const Button = styled.button<{
  variant: 'primary' | 'secondary' | 'tertiary'
  boxShadow?: boolean
  disabled?: boolean
  bgColor?: string
}>`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: ${({ disabled }) => !disabled && 'pointer'};
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  border: none;
  outline: none;
  height: 26px;
  font-size: 12px;
  mix-blend-mode: normal;
  box-shadow: ${({ boxShadow }) =>
    boxShadow ? '0px 4px 4px rgba(0, 0, 0, 0.25)' : ''};
  border-radius: 4px;
  padding: 0 12px;
  transition: 0.2s background;
  ${({ variant = 'primary', disabled, bgColor = undefined }) => {
    if (disabled) return
    return bgColor
      ? css`
          background: ${bgColor};
          color: ${getColorByBgColor(bgColor)};
          &:hover {
            background: ${lighten(0.1, bgColor)}};
          }
        `
      : variant === 'primary'
      ? css`
          background: rgb(29, 155, 240);
          color: #fff;
          &:hover {
            background: ${lighten(0.1, 'rgb(29, 155, 240)')}};
          }
        `
      : variant === 'secondary'
      ? css`
          background: #000;
          color: #fff;
          &:hover {
            background: ${lighten(0.1, '#000')};
          }
        `
      : css`
          background: rgb(255, 255, 255, 0.15);
          color: #fff;
          &:hover {
            background: ${lighten(0.05, '#000')};
          }
        `
  }}
  & > span {
    font-size: 14px;
  }
`
export const hexColor = (colorString: string): string => {
  if (colorString.includes('#')) return colorString
  const [r, g, b] = colorString
    .replace('rgb(', '')
    .replace(')', '')
    .replace(' ', '')
    .split(',')
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = parseInt(x || '').toString(16)
        return hex.length === 1 ? '0' + hex : hex
      })
      .join('')
  )
}

export const getColorByBgColor = (bgColor: string) => {
  if (!bgColor) {
    return ''
  }
  return parseInt(hexColor(bgColor).replace('#', ''), 16) > 0xffffff / 2
    ? '#000'
    : '#fff'
}

export const AsyncButton = ({
  text,
  variant,
  boxShadow,
  disabled,
  bgColor,
  handleClick,
}: {
  text: string
  loading: boolean
  variant: 'primary' | 'secondary' | 'tertiary'
  boxShadow?: boolean
  disabled?: boolean
  bgColor?: string
  handleClick: Function
}) => {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      variant="primary"
      className="mx-auto mt-4"
      onClick={async () => {
        try {
          setLoading(true)
          await handleClick()
        } catch (e) {
          notify({
            message: `${e}`,
            type: 'error',
          })
        } finally {
          setLoading(false)
        }
      }}
    >
      {loading ? <LoadingSpinner height="25px" /> : text}
    </Button>
  )
}
