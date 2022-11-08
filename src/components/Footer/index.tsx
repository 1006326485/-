import React from 'react'
import Tooltip from 'components/Tooltip'
import { useOpacity } from 'store/AppState'
import { findIndex } from 'lodash'

const 不透明度预设 = [0.1, 0.25, 0.5, 1]

const Footer: React.FC = () => {
  const [不透明度, 设置不透明度] = useOpacity()

  const 点击不透明度 = () => {
    const 当前不透明度下标 = findIndex(不透明度预设, (x) => x === 不透明度)
    const 下一个不透明度下标 = (当前不透明度下标 + 1) % 不透明度预设.length
    const 下一个不透明度 = 不透明度预设[下一个不透明度下标]
    设置不透明度(下一个不透明度)
  }

  return (
    <>
      <div className="w-11/12 ease-in">
        <Tooltip content="不透明度">
          <button className="w-10" onClick={点击不透明度}>
            {不透明度 * 100}%
          </button>
        </Tooltip>
      </div>
    </>
  )
}

export default Footer
